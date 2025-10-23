import { Module } from '@nestjs/common';

import { BusquedaResolver } from './resolvers/busqueda.resolver.js';
import { BusquedaService } from './services/busqueda.service.js';

@Module({
  providers: [BusquedaService, BusquedaResolver],
  exports: [BusquedaService],
})
export class BusquedaModule {}
