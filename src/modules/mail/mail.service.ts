import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';
import nodemailer, { Transporter } from 'nodemailer';
import { AppConfiguration } from '../../config/configuration';
import { OrderResponseDto } from '../orders/dto/order-response.dto';
import { SYSTEM_CONFIG_KEYS } from '../system-configs/system-config.keys';
import { SystemConfigsService } from '../system-configs/system-configs.service';
import {
  buildOrderNotificationHtml,
  buildOrderNotificationText,
} from './order-notification.template';

type OutgoingMail = {
  from: string;
  to: string[];
  subject: string;
  text: string;
  html: string;
};

@Injectable()
export class MailService implements OnModuleInit {
  private readonly logger = new Logger(MailService.name);
  private transporter: Transporter | null = null;

  constructor(
    private readonly configService: ConfigService<AppConfiguration, true>,
    private readonly systemConfigsService: SystemConfigsService,
  ) {}

  onModuleInit(): void {
    const mail = this.configService.get('mail', { infer: true });
    if (!mail.enabled) {
      this.logger.warn('MAIL_ENABLED=false — bỏ qua gửi mail thông báo đơn');
      return;
    }
    if (mail.transport === 'gmail-api') {
      if (
        !mail.user ||
        !mail.gmail.clientId ||
        !mail.gmail.clientSecret ||
        !mail.gmail.refreshToken
      ) {
        this.logger.warn(
          'Gmail API chưa đủ (SMTP_USER + GMAIL_CLIENT_ID/SECRET/REFRESH_TOKEN)',
        );
      } else {
        this.logger.log('Mail transport: gmail-api (HTTPS — phù hợp server)');
      }
      return;
    }
    if (!mail.host || !mail.port || !mail.user || !mail.pass) {
      this.logger.warn(
        'SMTP chưa đủ (SMTP_HOST/PORT/USER/PASS) — thông báo đơn hàng sẽ bị bỏ qua cho đến khi cấu hình',
      );
    } else {
      this.logger.log('Mail transport: smtp');
    }
  }

  async notifyNewOrder(order: OrderResponseDto): Promise<void> {
    try {
      const mail = this.configService.get('mail', { infer: true });
      if (!mail.enabled) {
        this.logger.warn(
          `Bỏ qua gửi mail đơn ${order.id}: MAIL_ENABLED=false`,
        );
        return;
      }

      const recipients = await this.getNotificationRecipients();
      if (recipients.length === 0) {
        this.logger.warn(
          `Bỏ qua gửi mail đơn ${order.id}: thiếu hoặc rỗng config ${SYSTEM_CONFIG_KEYS.EMAIL_NOTIFICATION}`,
        );
        return;
      }

      const from = mail.from || mail.user;
      if (!from) {
        this.logger.warn(
          `Bỏ qua gửi mail đơn ${order.id}: thiếu SMTP_FROM/SMTP_USER`,
        );
        return;
      }

      const payload: OutgoingMail = {
        from,
        to: recipients,
        subject: `[Minh Sam] Đơn mới ${order.phone} — ${order.totalAmount} VND`,
        text: buildOrderNotificationText(order),
        html: buildOrderNotificationHtml(order),
      };

      if (mail.transport === 'gmail-api') {
        await this.sendViaGmailApi(mail, payload);
      } else {
        await this.sendViaSmtp(mail, payload);
      }

      this.logger.log(
        `Đã gửi mail đơn ${order.id} tới ${recipients.join('; ')} (${mail.transport})`,
      );
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Gửi mail đơn hàng thất bại: ${message}`);
    }
  }

  /** Đọc địa chỉ nhận từ system_configs.EMAIL_NOTIFICATION. */
  async getNotificationRecipients(): Promise<string[]> {
    const raw = await this.systemConfigsService.findValueByKey(
      SYSTEM_CONFIG_KEYS.EMAIL_NOTIFICATION,
    );
    return this.parseNotificationEmails(raw);
  }

  /** Nhiều email trong EMAIL_NOTIFICATION, phân tách bằng `;` hoặc `,`. */
  parseNotificationEmails(raw: string | null | undefined): string[] {
    if (!raw) {
      return [];
    }
    const unique = new Set<string>();
    for (const part of raw.split(/[;,]/)) {
      const email = part.trim().toLowerCase();
      if (email.length > 0) {
        unique.add(email);
      }
    }
    return [...unique];
  }

  private async sendViaSmtp(
    mail: AppConfiguration['mail'],
    payload: OutgoingMail,
  ): Promise<void> {
    const transporter = this.getTransporter(mail);
    if (!transporter) {
      throw new Error(
        'chưa cấu hình SMTP (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS)',
      );
    }
    await transporter.sendMail({
      from: payload.from,
      to: payload.to.join(', '),
      subject: payload.subject,
      text: payload.text,
      html: payload.html,
    });
  }

  private async sendViaGmailApi(
    mail: AppConfiguration['mail'],
    payload: OutgoingMail,
  ): Promise<void> {
    const { clientId, clientSecret, refreshToken } = mail.gmail;
    const user = mail.user;
    if (!clientId || !clientSecret || !refreshToken || !user) {
      throw new Error(
        'Gmail API thiếu SMTP_USER hoặc GMAIL_CLIENT_ID/SECRET/REFRESH_TOKEN',
      );
    }

    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
    oauth2Client.setCredentials({ refresh_token: refreshToken });
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    const raw = this.buildRawMimeMessage(payload);

    await gmail.users.messages.send({
      userId: 'me',
      requestBody: { raw },
    });
  }

  private buildRawMimeMessage(payload: OutgoingMail): string {
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

  private getTransporter(
    mail: AppConfiguration['mail'],
  ): Transporter | null {
    if (this.transporter) {
      return this.transporter;
    }

    const { host, port, user, pass } = mail;
    if (!host || !port || !user || !pass) {
      return null;
    }

    this.transporter = nodemailer.createTransport({
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
}
