export const viewVariants = {
    active: {
        opacity: 1, x: 0, pointerEvents: 'auto',
        transition: { type: "tween", ease: "anticipate", duration: 0.7 }
    },
    inactiveLeft: {
        opacity: 0, x: "-100%", pointerEvents: 'none',
        transition: { type: "tween", ease: "anticipate", duration: 0.7 }
    },
    inactiveRight: {
        opacity: 0, x: "100%", pointerEvents: 'none',
        transition: { type: "tween", ease: "anticipate", duration: 0.7 }
    }
};

export const formOverlayVariants = {
    active: {
        opacity: 1, y: 0, pointerEvents: 'auto',
        transition: { type: "tween", ease: "anticipate", duration: 0.7 }
    },
    inactiveTop: {
        opacity: 0, y: "-100%", pointerEvents: 'none',
        transition: { type: "tween", ease: "anticipate", duration: 0.7 }
    },
};

export const pwaOverlayVariants = {
    active: {
        opacity: 1, y: 0, pointerEvents: 'auto',
        transition: { type: "tween", ease: "anticipate", duration: 0.7 }
    },
    inactiveBottom: {
        opacity: 0, y: "100%", pointerEvents: 'none',
        transition: { type: "tween", ease: "anticipate", duration: 0.7 }
    },
}