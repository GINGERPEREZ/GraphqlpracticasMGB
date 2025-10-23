import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { BusquedaResolver, BusquedaPurchaseResolver } from './resolvers/busqueda.resolver.js';
import { BusquedaService } from './services/busqueda.service.js';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  providers: [BusquedaService, BusquedaResolver, BusquedaPurchaseResolver],
  exports: [BusquedaService],
})
export class BusquedaModule {}
