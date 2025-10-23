import { Parent, ResolveField, Resolver } from '@nestjs/graphql';

import { AgregacionService } from '../services/agregacion.service.js';
import { PaymentSummaryType } from '../../types/payment.type.js';
import { ReservationSummaryType } from '../../types/reservation.type.js';

@Resolver(() => PaymentSummaryType)
export class PaymentSummaryResolver {
  constructor(private readonly agregacionService: AgregacionService) {}

  @ResolveField(() => ReservationSummaryType, {
    nullable: true,
    description:
      'Recupera la reservacion ligada al pago consultando la API REST subyacente.',
  })
  async reservation(
    @Parent() payment: PaymentSummaryType,
  ): Promise<ReservationSummaryType | null> {
    return this.agregacionService.obtenerReservacionPorId(
      payment.reservationId,
    );
  }
}
