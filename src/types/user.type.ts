import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Representa un usuario dentro del dominio REST.' })
export class UserType {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  email!: string;

  @Field(() => String)
  names!: string;

  @Field(() => String)
  phone!: string;
}
