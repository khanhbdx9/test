import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer, { Transporter } from 'nodemailer';
import { AppConfiguration } from '../../config/configuration';
import { OrderResponseDto } from '../orders/dto/order-response.dto';
import { SYSTEM_CONFIG_KEYS } from '../system-configs/system-config.keys';
import { SystemConfigsService } from '../system-configs/system-configs.service';
import {
  buildOrderNotificationHtml,
  buildOrderNotificationText,
} from './order-notification.template';

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
    if (!mail.host || !mail.port || !mail.user || !mail.pass) {
      this.logger.warn(
        'SMTP chưa đủ (SMTP_HOST/PORT/USER/PASS) — thông báo đơn hàng sẽ bị bỏ qua cho đến khi cấu hình',
      );
    }
  }

  async notifyNewOrder(order: OrderResponseDto): Promise<void> {
    try {
      const recipients = await this.getNotificationRecipients();
      if (recipients.length === 0) {
        this.logger.warn(
          `Bỏ qua gửi mail đơn ${order.id}: thiếu hoặc rỗng config ${SYSTEM_CONFIG_KEYS.EMAIL_NOTIFICATION}`,
        );
        return;
      }

      const mail = this.configService.get('mail', { infer: true });
      const transporter = this.getTransporter(mail);
      if (!transporter) {
        this.logger.warn(
          `Bỏ qua gửi mail đơn ${order.id}: chưa cấu hình SMTP (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS)`,
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

      await transporter.sendMail({
        from,
        to: recipients.join(', '),
        subject: `[Minh Sam] Đơn mới ${order.phone} — ${order.totalAmount} VND`,
        text: buildOrderNotificationText(order),
        html: buildOrderNotificationHtml(order),
      });
      this.logger.log(
        `Đã gửi mail đơn ${order.id} tới ${recipients.join('; ')}`,
      );
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Gửi mail đơn hàng thất bại: ${message}`, error);
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
      auth: { user, pass },
    });
    return this.transporter;
  }
}
