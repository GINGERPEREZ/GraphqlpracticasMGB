import { Module } from '@nestjs/common';

import { AnalyticsResolver } from './resolvers/analytics.resolver.js';
import { AnalyticsService } from './services/analytics.service.js';

@Module({
  providers: [AnalyticsService, AnalyticsResolver],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
