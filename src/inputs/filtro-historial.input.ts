import { Field, Float, InputType } from '@nestjs/graphql';
import { GraphQLISODateTime } from '@nestjs/graphql';

@InputType({ description: 'Filtro para historial de compras de un cliente.' })
export class FiltroHistorialInput {
  @Field(() => GraphQLISODateTime, { nullable: true })
  fechaDesde?: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  fechaHasta?: Date;

  @Field(() => Float, { nullable: true })
  totalMin?: number;

  @Field(() => Float, { nullable: true })
  totalMax?: number;
}
