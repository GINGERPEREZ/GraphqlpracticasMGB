import { Field, Float, ObjectType } from '@nestjs/graphql';

import { PaymentSummaryType } from '../../types/payment.type.js';
import { ReservationSummaryType } from '../../types/reservation.type.js';
import { UserType } from '../../types/user.type.js';

@ObjectType({ description: 'Perfil consolidado de un usuario.' })
export class PerfilUsuarioType {
  @Field(() => UserType)
  usuario!: UserType;

  @Field(() => [ReservationSummaryType])
  ultimasReservas!: ReservationSummaryType[];

  @Field(() => [PaymentSummaryType])
  ultimosPagos!: PaymentSummaryType[];

  @Field(() => Float)
  gastoTotal!: number;
}
