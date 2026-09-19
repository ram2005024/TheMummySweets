interface Props {
  latitude: number;
  longitude: number;
}
const MapView = ({ latitude, longitude }: Props) => {
  return (
    <div>
      Latitude is {latitude}
      Longitude is {longitude}
    </div>
  );
};

export default MapView;
