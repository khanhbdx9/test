import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfiguration } from '../../config/configuration';
import { OrderResponseDto } from '../orders/dto/order-response.dto';
import { SystemConfigsService } from '../system-configs/system-configs.service';
export declare class MailService implements OnModuleInit {
    private readonly configService;
    private readonly systemConfigsService;
    private readonly logger;
    private transporter;
    constructor(configService: ConfigService<AppConfiguration, true>, systemConfigsService: SystemConfigsService);
    onModuleInit(): void;
    notifyNewOrder(order: OrderResponseDto): Promise<void>;
    getNotificationRecipients(): Promise<string[]>;
    parseNotificationEmails(raw: string | null | undefined): string[];
    private sendViaSmtp;
    private sendViaGmailApi;
    private buildRawMimeMessage;
    private getTransporter;
}
