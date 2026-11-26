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
        if (!mail.host || !mail.port || !mail.user || !mail.pass) {
            this.logger.warn('SMTP chưa đủ (SMTP_HOST/PORT/USER/PASS) — thông báo đơn hàng sẽ bị bỏ qua cho đến khi cấu hình');
        }
    }
    async notifyNewOrder(order) {
        try {
            const recipients = await this.getNotificationRecipients();
            if (recipients.length === 0) {
                this.logger.warn(`Bỏ qua gửi mail đơn ${order.id}: thiếu hoặc rỗng config ${system_config_keys_1.SYSTEM_CONFIG_KEYS.EMAIL_NOTIFICATION}`);
                return;
            }
            const mail = this.configService.get('mail', { infer: true });
            const transporter = this.getTransporter(mail);
            if (!transporter) {
                this.logger.warn(`Bỏ qua gửi mail đơn ${order.id}: chưa cấu hình SMTP (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS)`);
                return;
            }
            const from = mail.from || mail.user;
            if (!from) {
                this.logger.warn(`Bỏ qua gửi mail đơn ${order.id}: thiếu SMTP_FROM/SMTP_USER`);
                return;
            }
            await transporter.sendMail({
                from,
                to: recipients.join(', '),
                subject: `[Minh Sam] Đơn mới ${order.phone} — ${order.totalAmount} VND`,
                text: (0, order_notification_template_1.buildOrderNotificationText)(order),
                html: (0, order_notification_template_1.buildOrderNotificationHtml)(order),
            });
            this.logger.log(`Đã gửi mail đơn ${order.id} tới ${recipients.join('; ')}`);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            this.logger.error(`Gửi mail đơn hàng thất bại: ${message}`, error);
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
            auth: { user, pass },
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