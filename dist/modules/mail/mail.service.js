"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var MailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const googleapis_1 = require("googleapis");
const nodemailer_1 = __importDefault(require("nodemailer"));
const system_config_keys_1 = require("../system-configs/system-config.keys");
const system_configs_service_1 = require("../system-configs/system-configs.service");
const order_notification_template_1 = require("./order-notification.template");
let MailService = MailService_1 = class MailService {
    configService;
    systemConfigsService;
    logger = new common_1.Logger(MailService_1.name);
    transporter = null;
    constructor(configService, systemConfigsService) {
        this.configService = configService;
        this.systemConfigsService = systemConfigsService;
    }
    onModuleInit() {
        const mail = this.configService.get('mail', { infer: true });
        if (!mail.enabled) {
            this.logger.warn('MAIL_ENABLED=false — bỏ qua gửi mail thông báo đơn');
            return;
        }
        if (mail.transport === 'gmail-api') {
            if (!mail.user ||
                !mail.gmail.clientId ||
                !mail.gmail.clientSecret ||
                !mail.gmail.refreshToken) {
                this.logger.warn('Gmail API chưa đủ (SMTP_USER + GMAIL_CLIENT_ID/SECRET/REFRESH_TOKEN)');
            }
            else {
                this.logger.log('Mail transport: gmail-api (HTTPS — phù hợp server)');
            }
            return;
        }
        if (!mail.host || !mail.port || !mail.user || !mail.pass) {
            this.logger.warn('SMTP chưa đủ (SMTP_HOST/PORT/USER/PASS) — thông báo đơn hàng sẽ bị bỏ qua cho đến khi cấu hình');
        }
        else {
            this.logger.log('Mail transport: smtp');
        }
    }
    async notifyNewOrder(order) {
        try {
            const mail = this.configService.get('mail', { infer: true });
            if (!mail.enabled) {
                this.logger.warn(`Bỏ qua gửi mail đơn ${order.id}: MAIL_ENABLED=false`);
                return;
            }
            const recipients = await this.getNotificationRecipients();
            if (recipients.length === 0) {
                this.logger.warn(`Bỏ qua gửi mail đơn ${order.id}: thiếu hoặc rỗng config ${system_config_keys_1.SYSTEM_CONFIG_KEYS.EMAIL_NOTIFICATION}`);
                return;
            }
            const from = mail.from || mail.user;
            if (!from) {
                this.logger.warn(`Bỏ qua gửi mail đơn ${order.id}: thiếu SMTP_FROM/SMTP_USER`);
                return;
            }
            const payload = {
                from,
                to: recipients,
                subject: `[Minh Sam] Đơn mới ${order.phone} — ${order.totalAmount} VND`,
                text: (0, order_notification_template_1.buildOrderNotificationText)(order),
                html: (0, order_notification_template_1.buildOrderNotificationHtml)(order),
            };
            if (mail.transport === 'gmail-api') {
                await this.sendViaGmailApi(mail, payload);
            }
            else {
                await this.sendViaSmtp(mail, payload);
            }
            this.logger.log(`Đã gửi mail đơn ${order.id} tới ${recipients.join('; ')} (${mail.transport})`);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            this.logger.error(`Gửi mail đơn hàng thất bại: ${message}`);
        }
    }
    async getNotificationRecipients() {
        const raw = await this.systemConfigsService.findValueByKey(system_config_keys_1.SYSTEM_CONFIG_KEYS.EMAIL_NOTIFICATION);
        return this.parseNotificationEmails(raw);
    }
    parseNotificationEmails(raw) {
        if (!raw) {
            return [];
        }
        const unique = new Set();
        for (const part of raw.split(/[;,]/)) {
            const email = part.trim().toLowerCase();
            if (email.length > 0) {
                unique.add(email);
            }
        }
        return [...unique];
    }
    async sendViaSmtp(mail, payload) {
        const transporter = this.getTransporter(mail);
        if (!transporter) {
            throw new Error('chưa cấu hình SMTP (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS)');
        }
        await transporter.sendMail({
            from: payload.from,
            to: payload.to.join(', '),
            subject: payload.subject,
            text: payload.text,
            html: payload.html,
        });
    }
    async sendViaGmailApi(mail, payload) {
        const { clientId, clientSecret, refreshToken } = mail.gmail;
        const user = mail.user;
        if (!clientId || !clientSecret || !refreshToken || !user) {
            throw new Error('Gmail API thiếu SMTP_USER hoặc GMAIL_CLIENT_ID/SECRET/REFRESH_TOKEN');
        }
        const oauth2Client = new googleapis_1.google.auth.OAuth2(clientId, clientSecret);
        oauth2Client.setCredentials({ refresh_token: refreshToken });
        const gmail = googleapis_1.google.gmail({ version: 'v1', auth: oauth2Client });
        const raw = this.buildRawMimeMessage(payload);
        await gmail.users.messages.send({
            userId: 'me',
            requestBody: { raw },
        });
    }
    buildRawMimeMessage(payload) {
        const boundary = `minhsam_${Date.now()}`;
        const toHeader = payload.to.join(', ');
        const lines = [
            `From: ${payload.from}`,
            `To: ${toHeader}`,
            `Subject: =?UTF-8?B?${Buffer.from(payload.subject).toString('base64')}?=`,
            'MIME-Version: 1.0',
            `Content-Type: multipart/alternative; boundary="${boundary}"`,
            '',
            `--${boundary}`,
            'Content-Type: text/plain; charset="UTF-8"',
            'Content-Transfer-Encoding: base64',
            '',
            Buffer.from(payload.text, 'utf8').toString('base64'),
            `--${boundary}`,
            'Content-Type: text/html; charset="UTF-8"',
            'Content-Transfer-Encoding: base64',
            '',
            Buffer.from(payload.html, 'utf8').toString('base64'),
            `--${boundary}--`,
        ];
        return Buffer.from(lines.join('\r\n'))
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/g, '');
    }
    getTransporter(mail) {
        if (this.transporter) {
            return this.transporter;
        }
        const { host, port, user, pass } = mail;
        if (!host || !port || !user || !pass) {
            return null;
        }
        this.transporter = nodemailer_1.default.createTransport({
            host,
            port,
            secure: port === 465,
            auth: {
                user,
                pass: pass.replace(/\s+/g, ''),
            },
            connectionTimeout: 5_000,
            greetingTimeout: 5_000,
            socketTimeout: 10_000,
            tls: {
                servername: host,
            },
        });
        return this.transporter;
    }
};
exports.MailService = MailService;
exports.MailService = MailService = MailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        system_configs_service_1.SystemConfigsService])
], MailService);
//# sourceMappingURL=mail.service.js.map