'use client';
import { Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const ICON_SIZE = [50, 50]
const ICON_ANCHOR = [25, 50]
const eventIcon = new L.Icon({
    iconUrl: '/assets/map-pin.svg',
    iconSize: ICON_SIZE,
    iconAnchor: ICON_ANCHOR,
});

const foodIcon = new L.Icon({
    iconUrl: '/assets/orange-flag.png',
    iconSize: ICON_SIZE,
    iconAnchor: ICON_ANCHOR,
});

const drinkIcon = new L.Icon({
    iconUrl: '/assets/blue-flag.png',
    iconSize: [50, 50],
    iconAnchor: ICON_ANCHOR,
});

const giftIcon = new L.Icon({
    iconUrl: '/assets/green-flag.png',
    iconSize: ICON_SIZE,
    iconAnchor: ICON_ANCHOR,
});

const balloonIcon = new L.Icon({
    iconUrl: '/assets/purple-flag.png',
    iconSize: ICON_SIZE,
    iconAnchor: ICON_ANCHOR,
});

const TYPE_FLAGS = {
    "Food": foodIcon,
    "Drink": drinkIcon,
    "Party": balloonIcon,
    "Gift": giftIcon,
    "Other": eventIcon
}

/**
 * Renders a collection of event markers on the map.
 *
 * @param {object} props - The component props.
 * @param {Array<object>} props.events - A list of event objects. Each event must have id, latitude, and longitude.
 * @param {Function} props.onPinClick - A callback function that is executed when a pin is clicked. It receives the event object.
 */
export default function EventPins({ events, onPinClick }) {
    const handleClick = (eventData) => {
        if (typeof onPinClick === 'function') {
            onPinClick(eventData);
        } else {
            console.warn("onPinClick prop is not a function!");
        }
    };

    return (
        <>
            {events.map((event) => (
                <Marker
                    key={event.id}
                    position={[event.latitude, event.longitude]}
                    icon={TYPE_FLAGS[event.type] || eventIcon}
                    eventHandlers={{
                        click: () => handleClick(event),
                    }}
                />
            ))}
        </>
    );
}