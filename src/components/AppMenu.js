'use client';
import SwitchSelector from "@/components/SwitchSelector.js";
import IconButton from "@/components/IconButton.js";

const MAP_VIEW = 'Map';
const EVENT_VIEW = 'Events';

export default function AppMenu({
                                    currentView,
                                    isEventFormOpen,
                                    onSwitchView,
                                    onCloseForms,
                                    onToggleEmailForm,
                                    onToggleEventForm,
                                    showNotificationBtn
                                }) {
    return (
        <div className="menu-container">
            <div
                className="bell-button-container"
                style={{ visibility: showNotificationBtn ? 'visible' : 'hidden' }}
            >
                <IconButton
                    type="bell"
                    onClick={onToggleEmailForm}
                />
            </div>

            <div className="radio-container">
                <SwitchSelector
                    option1={MAP_VIEW}
                    option2={EVENT_VIEW}
                    onSwitch={onSwitchView}
                    setShowForm={onCloseForms}
                    value={currentView}
                />
            </div>

            <div className="plus-button-container">
                <IconButton
                    type="plus"
                    isOpen={isEventFormOpen}
                    onClick={onToggleEventForm}
                />
            </div>
        </div>
    );
}