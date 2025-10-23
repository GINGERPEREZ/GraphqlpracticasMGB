import { Parent, ResolveField, Resolver } from '@nestjs/graphql';

import { AgregacionService } from '../services/agregacion.service.js';
import { ReservationSummaryType } from '../../types/reservation.type.js';
import { RestaurantType } from '../../types/restaurant.type.js';

@Resolver(() => ReservationSummaryType)
export class ReservationSummaryResolver {
  constructor(private readonly agregacionService: AgregacionService) {}

  @ResolveField(() => RestaurantType, {
    nullable: true,
    description:
      'Carga el restaurante asociado a la reservacion desde la API REST.',
  })
  async restaurant(
    @Parent() reservation: ReservationSummaryType,
  ): Promise<RestaurantType | null> {
    return this.agregacionService.obtenerRestaurantePorId(
      reservation.restaurantId,
    );
  }
}
