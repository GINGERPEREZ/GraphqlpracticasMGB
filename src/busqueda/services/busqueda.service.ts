import { Injectable, NotImplementedException } from '@nestjs/common';

@Injectable()
export class BusquedaService {
  async placeholder(): Promise<never> {
    throw new NotImplementedException(
      'La logica de Busqueda sera implementada por el integrante asignado.',
    );
  }
}
