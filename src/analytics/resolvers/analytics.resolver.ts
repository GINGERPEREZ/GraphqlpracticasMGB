import { Resolver } from '@nestjs/graphql';

import { AnalyticsService } from '../services/analytics.service.js';

@Resolver()
export class AnalyticsResolver {
  constructor(private readonly analyticsService: AnalyticsService) {}
}
