import { DivIcon } from 'leaflet';
import React from 'react';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';

import 'leaflet/dist/leaflet.css';

export type Coordinates = {
  latitude: any;
  longitude: any;
};

export type LeafletMapProps = {
  height: string;
  width: string;
  initialCenter: Coordinates;
  defaultZoom: number;
  minZoom?: number;
  maxZoom?: number;
};

const MARKER_ICON = new DivIcon({
  className: 'leaflet-marker-icon',
  iconSize: [44, 44],
  iconAnchor: [22, 44],
  html: `<svg xmlns="http://www.w3.org/2000/svg" height="44" viewBox="0 0 24 24" width="44"><path d="M0 0h24v24H0z" fill="none"/><path fill="#1F3A93" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`
});

export const LeafletMap = ({ height, width, initialCenter, defaultZoom, minZoom, maxZoom }: LeafletMapProps) => {
  return (
    <div style={{ height: height, width: width }} className="c rounded-md ">
      <MapContainer
        center={[initialCenter.latitude, initialCenter.longitude]}
        zoom={defaultZoom}
        scrollWheelZoom={false}
        style={{ height: height, width: width }}
        className="z-0 rounded-md"
      >
        <TileLayer
          minZoom={minZoom}
          minNativeZoom={minZoom}
          maxZoom={maxZoom}
          maxNativeZoom={maxZoom}
          attribution=""
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"
        />
        <Marker position={[initialCenter.latitude, initialCenter.longitude]} icon={MARKER_ICON} />
      </MapContainer>
    </div>
  );
};

export default LeafletMap;
