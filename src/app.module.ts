import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'node:path';
import { AgregacionModule } from './agregacion/agregacion.module.js';
import { AnalyticsModule } from './analytics/analytics.module.js';
import { BusquedaModule } from './busqueda/busqueda.module.js';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      cors: true,
      playground: true,
    }),
    AgregacionModule,
    AnalyticsModule,
    BusquedaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
