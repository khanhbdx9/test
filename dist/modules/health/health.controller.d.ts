import { HealthDataDto } from './dto/health-data.dto';
import { HealthService } from './health.service';
export declare class HealthController {
    private readonly healthService;
    constructor(healthService: HealthService);
    getHealth(): HealthDataDto;
}
