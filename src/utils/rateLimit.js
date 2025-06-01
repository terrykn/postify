export function canMakeApiCall() {
    const now = Date.now();
    const windowMs = 60 * 60 * 1000; 
    const maxCalls = 20;
    const key = 'api_call_timestamps';

    let timestamps = [];
    try {
        timestamps = JSON.parse(localStorage.getItem(key)) || [];
    } catch {
        timestamps = [];
    }

    timestamps = timestamps.filter(ts => now - ts < windowMs);

    if (timestamps.length >= maxCalls) {
        return false;
    }

    timestamps.push(now);
    localStorage.setItem(key, JSON.stringify(timestamps));
    return true;
}

export function getApiCallsLeft() {
    const now = Date.now();
    const windowMs = 60 * 60 * 1000;
    const maxCalls = 40;
    const key = 'api_call_timestamps';

    let timestamps = [];
    try {
        timestamps = JSON.parse(localStorage.getItem(key)) || [];
    } catch {
        timestamps = [];
    }
    timestamps = timestamps.filter(ts => now - ts < windowMs);

    return Math.max(0, maxCalls - timestamps.length)/2;
}

// https://open.spotify.com/album/1NAmidJlEaVgA3MpcPFYGq
// https://open.spotify.com/album/5H7ixXZfsNMGbIE5OBSpcb?si=xVc4UC8LSey98r4EK-yKdw

export function canMakeApiCallWithThrottle(showSlowDownDialog) {
    const now = Date.now();
    const windowMs = 5000; 
    const maxCalls = 2;
    const key = 'api_throttle_timestamps';

    let timestamps = [];
    try {
        timestamps = JSON.parse(localStorage.getItem(key)) || [];
    } catch {
        timestamps = [];
    }

    timestamps = timestamps.filter(ts => now - ts < windowMs);

    if (timestamps.length >= maxCalls) {
        if (showSlowDownDialog) showSlowDownDialog();
        return false;
    }

    timestamps.push(now);
    localStorage.setItem(key, JSON.stringify(timestamps));
    return true;
}