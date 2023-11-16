import { LatLng, LatLngExpression } from 'leaflet';
import React, { useEffect } from 'react';
import { Marker, useMap } from 'react-leaflet';

interface Props {
  position?: LatLngExpression;
  onChange: (position: LatLng) => void;
}

export default function MapAreaSelect(props: Props) {
  const map = useMap();

  useEffect(() => {
    map.once('click', e => {
      props.onChange(e.latlng);
    });
  });

  return (
    <div>{props.position != null && <Marker position={props.position} />}</div>
  );
}
