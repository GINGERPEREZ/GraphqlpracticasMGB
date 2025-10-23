import { Injectable } from '@nestjs/common';

import { RestClientService } from '../../common/rest/rest-client.service.js';
import type {
  RestPayment,
  RestReservation,
  RestReview,
  RestUser,
  RestRestaurant,
} from '../../common/rest/rest.types.js';

@Injectable()
export class AnalyticsService {
  constructor(private readonly restClient: RestClientService) {}

  async getAllPayments(): Promise<RestPayment[]> {
    return this.restClient.getAllPaginated<RestPayment>('/payments');
  }

  async getAllReservations(): Promise<RestReservation[]> {
    return this.restClient.getAllPaginated<RestReservation>('/reservations');
  }

  async getAllUsers(): Promise<RestUser[]> {
    return this.restClient.getAllPaginated<RestUser>('/users');
  }

  async getAllReviews(): Promise<RestReview[]> {
    return this.restClient.getAllPaginated<RestReview>('/reviews');
  }

  async getAllRestaurants(): Promise<RestRestaurant[]> {
    return this.restClient.getAllPaginated<RestRestaurant>('/restaurants');
  }
}
