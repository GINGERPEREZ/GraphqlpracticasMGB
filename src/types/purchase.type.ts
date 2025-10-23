import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
import { GraphQLISODateTime } from '@nestjs/graphql';

@ObjectType({ description: 'Compra/venta realizada por un cliente.' })
export class PurchaseType {
  @Field(() => ID)
  id!: string;

  @Field(() => ID)
  clienteId!: string;

  @Field(() => Float)
  total!: number;

  @Field(() => GraphQLISODateTime)
  fecha!: Date;
}
