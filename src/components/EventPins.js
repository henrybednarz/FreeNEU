'use client';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const ICON_SIZE = [75, 75]
const ICON_ANCHOR = [38, 75]
const eventIcon = new L.Icon({
    iconUrl: '/assets/green_icon.png',
    iconSize: ICON_SIZE,
    iconAnchor: ICON_ANCHOR,
});

const foodIcon = new L.Icon({
    iconUrl: '/assets/orange_icon.png',
    iconSize: ICON_SIZE,
    iconAnchor: ICON_ANCHOR,
});

const drinkIcon = new L.Icon({
    iconUrl: '/assets/blue_icon.png',
    iconSize: ICON_SIZE,
    iconAnchor: ICON_ANCHOR,
});

const giftIcon = new L.Icon({
    iconUrl: '/assets/purple_icon.png',
    iconSize: ICON_SIZE,
    iconAnchor: ICON_ANCHOR,
});

const balloonIcon = new L.Icon({
    iconUrl: '/assets/red_icon.png',
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
export default function EventPins({ events, onPinClick, focusedEvent }) {
    const handleClick = (eventData) => {
        if (typeof onPinClick === 'function') {
            onPinClick(eventData);
        } else {
            console.warn("onPinClick prop is not a function!");
        }
    };
    const isEventFocused = (event) => focusedEvent && focusedEvent.id === event.id;

    return (
        <>
            {events.map((event) => (
                <Marker
                    key={event.id}
                    position={[event.latitude, event.longitude]}
                    icon={TYPE_FLAGS[event.type] || eventIcon}
                    eventHandlers={{
                        click: () => onPinClick(event),
                    }}
                >
                </Marker>
            ))}
        </>
    );
}
