import { LatLngLiteral } from 'leaflet';

export interface Location {
  center: LatLngLiteral;
  max: LatLngLiteral;
  min: LatLngLiteral;
  city: string;
}
