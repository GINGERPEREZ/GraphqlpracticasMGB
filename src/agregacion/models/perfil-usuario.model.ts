import type {
  RestPayment,
  RestReservation,
  RestUser,
} from '../../common/rest/rest.types.js';

export interface PerfilUsuarioModel {
  usuario: RestUser;
  reservas: RestReservation[];
  pagos: RestPayment[];
  gastoTotal: number;
}
