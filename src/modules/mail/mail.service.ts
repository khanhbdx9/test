import { Injectable, Logger } from '@nestjs/common';
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
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: Transporter | null = null;

  constructor(
    private readonly configService: ConfigService<AppConfiguration, true>,
    private readonly systemConfigsService: SystemConfigsService,
  ) {}

  async notifyNewOrder(order: OrderResponseDto): Promise<void> {
    try {
      const raw = await this.systemConfigsService.findValueByKey(
        SYSTEM_CONFIG_KEYS.EMAIL_NOTIFICATION,
      );
      const recipients = this.parseNotificationEmails(raw);
      if (recipients.length === 0) {
        this.logger.warn(
          `Bỏ qua gửi mail: thiếu config ${SYSTEM_CONFIG_KEYS.EMAIL_NOTIFICATION}`,
        );
        return;
      }

      const mail = this.configService.get('mail', { infer: true });
      const transporter = this.getTransporter(mail);
      if (!transporter) {
        this.logger.warn('Bỏ qua gửi mail: chưa cấu hình SMTP');
        return;
      }

      const from = mail.from || mail.user;
      if (!from) {
        this.logger.warn('Bỏ qua gửi mail: thiếu SMTP_FROM/SMTP_USER');
        return;
      }

      await transporter.sendMail({
        from,
        to: recipients,
        subject: `[Minh Sam] Đơn mới ${order.phone} — ${order.totalAmount} VND`,
        text: buildOrderNotificationText(order),
        html: buildOrderNotificationHtml(order),
      });
      this.logger.log(
        `Đã gửi mail đơn ${order.id} tới ${recipients.join('; ')}`,
      );
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Gửi mail đơn hàng thất bại: ${message}`);
    }
  }

  /** Nhiều email trong EMAIL_NOTIFICATION, phân tách bằng `;`. */
  parseNotificationEmails(raw: string | null | undefined): string[] {
    if (!raw) {
      return [];
    }
    return raw
      .split(';')
      .map((email) => email.trim())
      .filter((email) => email.length > 0);
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
