'use client';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import EventList from '@/components/EventList.js';
import { viewVariants } from '@/styles/views.js';

const MAP_VIEW = 'Map';
const EVENT_VIEW = 'Events';

const Map = dynamic(
    () => import('@/components/Map'),
    { loading: () => <p>A map is loading...</p>, ssr: false }
);

export default function ViewContainer({
                                          currentView,
                                          mapProps,
                                          eventListProps
                                      }) {
    return (
        <>
            <motion.div
                className="page-container"
                variants={viewVariants}
                animate={currentView === MAP_VIEW ? 'active' : 'inactiveLeft'}
            >
                <div className="map-container">
                    <Map
                        events={mapProps.events}
                        focusedEvent={mapProps.focusedEvent}
                        onPinClick={mapProps.onPinClick}
                        onMapClick={mapProps.onMapClick}
                        isAddingEvent={mapProps.isAddingEvent}
                        userLocation={mapProps.userLocation}
                    />
                </div>
            </motion.div>

            <motion.div
                className="event-container"
                variants={viewVariants}
                animate={currentView === EVENT_VIEW ? 'active' : 'inactiveRight'}
            >
                <EventList
                    events={eventListProps.events}
                    onCardClick={eventListProps.onCardClick}
                    focusedEvent={eventListProps.focusedEvent}
                    userLocation={eventListProps.userLocation}
                />
            </motion.div>
        </>
    );
}