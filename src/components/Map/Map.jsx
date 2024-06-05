import classNames from "classnames/bind";
import styles from "./Map.module.scss";
import { useEffect, useRef, useState } from "react";
import { getCoordinates } from "../../services/geoapifyService";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet"

const cx = classNames.bind(styles);
const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
const url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

const Map = ({ address = "", zoom = 16, coordinates = [] }) => {
  const [center, setCenter] = useState([]);
  useEffect(() => {
    const fetchCenter = async () => {
      try {
        const res = await getCoordinates(address);
        if (res.status === 200 && res.data.features?.length > 0) {
          setCenter([
            res.data.features[0].geometry?.coordinates[1],
            res.data.features[0].geometry?.coordinates[0],
          ])
        }
        else {
          window.navigator.geolocation.getCurrentPosition((pos) => {
            setCenter([
              pos.coords.latitude,
              pos.coords.longitude
            ])
          })
        }
      } catch (error) {
        console.log(error);
        window.navigator.geolocation.getCurrentPosition((pos) => {
          setCenter([
            pos.coords.latitude,
            pos.coords.longitude
          ])
        })
      }
    }
    if (address) {
      fetchCenter();
    }
  }, [])
  return (
    <div className={cx("map-container")}>
      {(center.length > 0 || coordinates.length > 0) && <MapContainer center={center.length > 0 ? center : coordinates} zoom={zoom}
        scrollWheelZoom={true}
        className={cx("map-content")}
      >
        <TileLayer
          attribution={attribution}
          url={url}
        />
        <Marker position={center.length > 0 ? center : coordinates}>
          <Popup>
            {address}
          </Popup>
        </Marker>
      </MapContainer>}
    </div>
  )
};

export default Map;
