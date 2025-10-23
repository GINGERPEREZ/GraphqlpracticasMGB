import { Injectable, NotImplementedException } from '@nestjs/common';

@Injectable()
export class AnalyticsService {
  async placeholder(): Promise<never> {
    throw new NotImplementedException(
      'La logica de Analytics sera implementada por el integrante asignado.',
    );
  }
}
