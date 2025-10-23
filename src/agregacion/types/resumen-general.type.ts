import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Metricas generales para tableros ejecutivos.' })
export class ResumenGeneralType {
  @Field(() => Int)
  totalClientes!: number;

  @Field(() => Int)
  totalPlatos!: number;

  @Field(() => Float)
  totalVentasHoy!: number;
}
