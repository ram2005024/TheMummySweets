"use client";

import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";

interface Props {
  latitude: number;
  longitude: number;
}

const MapView = ({ latitude, longitude }: Props) => {
  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <div className="relative h-full w-full overflow-hidden rounded-lg">
        <Map
          defaultCenter={{
            lat: latitude,
            lng: longitude,
          }}
          defaultZoom={16}
          gestureHandling="greedy"
          disableDefaultUI={false}
          mapId="DELIVERY_MAP"
          className="h-full w-full"
        >
          <Marker
            position={{
              lat: latitude,
              lng: longitude,
            }}
          />
        </Map>

        <div className="absolute bottom-3 left-3 right-3 z-10">
          <div className="rounded-xl bg-white/95 p-3 shadow-lg backdrop-blur">
            <p className="text-xs font-semibold text-gray-900">
              Delivery Location
            </p>

            <p className="mt-1 text-xs text-gray-600">
              {latitude.toFixed(6)}, {longitude.toFixed(6)}
            </p>
          </div>
        </div>
      </div>
    </APIProvider>
  );
};

export default MapView;
