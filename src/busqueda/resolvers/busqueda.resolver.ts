import { Resolver } from '@nestjs/graphql';

import { BusquedaService } from '../services/busqueda.service.js';

@Resolver()
export class BusquedaResolver {
  constructor(private readonly busquedaService: BusquedaService) {}
}
