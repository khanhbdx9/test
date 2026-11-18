import { ConfigService } from '@nestjs/config';
import { AppConfiguration } from '../../config/configuration';
import { OrderResponseDto } from '../orders/dto/order-response.dto';
import { SystemConfigsService } from '../system-configs/system-configs.service';
export declare class MailService {
    private readonly configService;
    private readonly systemConfigsService;
    private readonly logger;
    private transporter;
    constructor(configService: ConfigService<AppConfiguration, true>, systemConfigsService: SystemConfigsService);
    notifyNewOrder(order: OrderResponseDto): Promise<void>;
    parseNotificationEmails(raw: string | null | undefined): string[];
    private getTransporter;
}
