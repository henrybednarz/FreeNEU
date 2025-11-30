import React from 'react';
import '@/styles/FormCard.css';
import '@/styles/PWAInfoCard.css';

const PWAInfoCard = ({ onClose }) => {
    return (
            <div className="pwa-card">
                <div className="form-header">
                    <h3 className="form-title">Are you in your browser?</h3>
                    <div className="subtitle-text">Add <strong>FreeNEU</strong> to your home screen for full-screen browsing and push notifications</div>
                    <div>
                        <hr/>
                    </div>
                    <div className="instruction-text">To add me to your device,</div>
                    <div className="instruction-text">
                        <b>1.</b> Press the share <svg
                            className="share-icon"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                        >
                            <path xmlns="http://www.w3.org/2000/svg" id="Vector" d="M9 6L12 3M12 3L15 6M12 3V13M7.00023 10C6.06835 10 5.60241 10 5.23486 10.1522C4.74481 10.3552 4.35523 10.7448 4.15224 11.2349C4 11.6024 4 12.0681 4 13V17.8C4 18.9201 4 19.4798 4.21799 19.9076C4.40973 20.2839 4.71547 20.5905 5.0918 20.7822C5.5192 21 6.07899 21 7.19691 21H16.8036C17.9215 21 18.4805 21 18.9079 20.7822C19.2842 20.5905 19.5905 20.2839 19.7822 19.9076C20 19.4802 20 18.921 20 17.8031V13C20 12.0681 19.9999 11.6024 19.8477 11.2349C19.6447 10.7448 19.2554 10.3552 18.7654 10.1522C18.3978 10 17.9319 10 17 10" strokeWidth="1.5" stroke="#000000"/>
                        </svg> button

                    </div>
                    <div className="instruction-text"><b>2.</b> Select "Add to Home Screen" in the menu
                        <div className="home-screen-reference">
                            <div className="add-to-home-button">
                                <span className="add-to-home-text">Add to Home Screen</span>
                                <span className="add-to-home-icon">
                                    <svg
                                        width="45"
                                        height="45"
                                        viewBox="0 0 24 24"
                                        stroke="black"
                                        fill="none"
                                    >
                                      <rect x="4" y="4" width="16" height="16" rx="5"/>
                                      <line x1="12" y1="9" x2="12" y2="15"/>
                                      <line x1="9" y1="12" x2="15" y2="12"/>
                                    </svg>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="instruction-text"><b>3.</b> In the pop-up select "Add"</div>
                    <div className="dismiss" onClick={onClose}>Don't care? <u>Dismiss</u></div>
                </div>
            </div>
    )
}

export default PWAInfoCard;