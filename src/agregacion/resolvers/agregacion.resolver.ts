import { Args, ID, Query, Resolver } from '@nestjs/graphql';

import { AgregacionService } from '../services/agregacion.service.js';
import { PerfilUsuarioType } from '../types/perfil-usuario.type.js';
import { ProductoDetalladoType } from '../types/producto-detallado.type.js';
import { ResumenGeneralType } from '../types/resumen-general.type.js';

@Resolver()
export class AgregacionResolver {
  constructor(private readonly agregacionService: AgregacionService) {}

  @Query(() => PerfilUsuarioType, {
    name: 'perfilUsuario',
    description:
      'Retorna un perfil enriquecido del usuario con sus ultimas actividades.',
  })
  async perfilUsuario(
    @Args('id', { type: () => ID, description: 'Identificador del usuario.' })
    id: string,
  ): Promise<PerfilUsuarioType> {
    return this.agregacionService.obtenerPerfilUsuario(id);
  }

  @Query(() => ProductoDetalladoType, {
    name: 'productoDetallado',
    description:
      'Obtiene la informacion completa de un plato incluyendo contexto y reseñas.',
  })
  async productoDetallado(
    @Args('id', {
      type: () => ID,
      description: 'Identificador del plato a consultar.',
    })
    id: string,
  ): Promise<ProductoDetalladoType> {
    return this.agregacionService.obtenerProductoDetallado(id);
  }

  @Query(() => ResumenGeneralType, {
    name: 'resumenGeneral',
    description: 'Metricas principales para un tablero ejecutivo.',
  })
  async resumenGeneral(): Promise<ResumenGeneralType> {
    return this.agregacionService.obtenerResumenGeneral();
  }
}
