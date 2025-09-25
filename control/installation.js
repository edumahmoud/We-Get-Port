// Service Worker register
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./control/sw.js");
}


// Cache Editor
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistration().then(reg => {
    if (reg && reg.waiting) {
        reg.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
    });
}