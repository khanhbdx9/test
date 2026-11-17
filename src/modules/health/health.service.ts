import { Injectable } from '@nestjs/common';

export interface HealthData {
  status: string;
}

@Injectable()
export class HealthService {
  getHealth(): HealthData {
    return { status: 'ok' };
  }
}
