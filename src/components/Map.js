'use client';
import { MapContainer, TileLayer, useMap, useMapEvents, Marker } from 'react-leaflet';
import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import EventPins from './EventPins';

const stadiaApiKey = process.env.NEXT_PUBLIC_STADIA_API_KEY;
const stadiaTonerLiteUrl = `https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}{r}.png?api_key=${stadiaApiKey}`;
const openMapUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const stadiaAttribution = '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors';
const openMapAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors';


const userIcon = new L.Icon({
    iconUrl: './assets/orange-flag.png',
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -38],
});

const ChangeView = ({ center, zoom }) => {
    const map = useMap();
    map.flyTo(center, zoom);
    return null;
};

const MapClickHandler = ({ onMapClick }) => {
    useMapEvents({
        click(e) {
            onMapClick(e.latlng);
        },
    });
    return null;
};

const UserLocationMarker = ({ position }) => {
    const map = useMap();
    useEffect(() => {
        if (position) {
            map.flyTo(position, map.getZoom());
        }
    }, [position, map]);

    if (!position) {
        return null;
    }

    return (
        <Marker position={position} icon={userIcon} />
    );
};

export default function Map({ events, onPinClick, focusedEvent, onMapClick, userLocation }) {
    const defaultPosition = [42.3601, -71.0589];
    const initialCenter = userLocation || defaultPosition;

    return (
        <MapContainer
            center={initialCenter}
            zoom={16}
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
        >
            <TileLayer
                url={openMapUrl}
                attribution={openMapAttribution}
            />

            {onMapClick && <MapClickHandler onMapClick={onMapClick} />}

            {focusedEvent && (
                <ChangeView center={[focusedEvent.latitude, focusedEvent.longitude]} zoom={17} />
            )}

            <EventPins
                events={events}
                focusedEvent={focusedEvent}
                onPinClick={onPinClick}
            />
            {userLocation && <UserLocationMarker position={userLocation} />}
        </MapContainer>
    );
}