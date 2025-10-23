import type {
  RestDish,
  RestMenu,
  RestRestaurant,
  RestReview,
} from '../../common/rest/rest.types.js';

export interface ProductoDetalladoModel {
  plato: RestDish;
  menu: RestMenu;
  restaurante: RestRestaurant;
  resenas: RestReview[];
}
