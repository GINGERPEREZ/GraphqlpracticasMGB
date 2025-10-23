import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { RestClientService } from '../common/rest/rest-client.service.js';
import { AgregacionResolver } from './resolvers/agregacion.resolver.js';
import { PaymentSummaryResolver } from './resolvers/payment-summary.resolver.js';
import { ReservationSummaryResolver } from './resolvers/reservation-summary.resolver.js';
import { AgregacionService } from './services/agregacion.service.js';

@Module({
  imports: [
    HttpModule.register({
      baseURL: process.env.REST_API_URL ?? 'http://localhost:3000',
      timeout: 8000,
      maxRedirects: 5,
    }),
  ],
  providers: [
    RestClientService,
    AgregacionService,
    AgregacionResolver,
    ReservationSummaryResolver,
    PaymentSummaryResolver,
  ],
  exports: [AgregacionService],
})
export class AgregacionModule {}
