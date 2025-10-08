'use client';
import { MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import EventPins from './EventPins';

// Your constants remain the same
const stadiaApiKey = process.env.NEXT_PUBLIC_STADIA_API_KEY;
const stadiaTonerLiteUrl = `https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}{r}.png?api_key=${stadiaApiKey}`;
const openMapUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const stadiaAttribution = '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors';
const openMapAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors';


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


export default function Map({ events, onPinClick, focusedEvent, onMapClick }) {
    const position = [42.3601, -71.0589];

    return (
        <MapContainer
            center={position}
            zoom={16}
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
        >
            <TileLayer
                url={stadiaTonerLiteUrl}
                attribution={stadiaAttribution}
            />

            {onMapClick && <MapClickHandler onMapClick={onMapClick} />}

            {focusedEvent && (
                <ChangeView center={[focusedEvent.latitude, focusedEvent.longitude]} zoom={17} />
            )}

            <EventPins
                events={events}
                onPinClick={onPinClick}
            />
        </MapContainer>
    );
}