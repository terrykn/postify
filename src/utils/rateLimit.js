const CREDITS_KEY = 'api_credits';
const RESET_KEY = 'api_credits_last_reset';
const MAX_CREDITS = 20;
const RESET_INTERVAL_MS = 24 * 60 * 60 * 1000; // 24 hours

function maybeResetCredits() {
    const now = Date.now();
    let lastReset = parseInt(localStorage.getItem(RESET_KEY), 10);
    if (isNaN(lastReset)) lastReset = 0;

    if (now - lastReset >= RESET_INTERVAL_MS) {
        localStorage.setItem(CREDITS_KEY, MAX_CREDITS);
        localStorage.setItem(RESET_KEY, now.toString());
    }
}

export function canMakeApiCall() {
    maybeResetCredits();
    let credits = parseInt(localStorage.getItem(CREDITS_KEY), 10);
    if (isNaN(credits)) credits = MAX_CREDITS;

    if (credits <= 0) {
        return false;
    }

    credits -= 1;
    localStorage.setItem(CREDITS_KEY, credits);
    return true;
}

export function getApiCallsLeft() {
    maybeResetCredits();
    let credits = parseInt(localStorage.getItem(CREDITS_KEY), 10);
    if (isNaN(credits)) credits = MAX_CREDITS;
    return credits;
}

export function getApiResetTimeLeft() {
    let lastReset = parseInt(localStorage.getItem(RESET_KEY), 10);
    if (isNaN(lastReset)) lastReset = 0;
    const now = Date.now();
    const nextReset = lastReset + RESET_INTERVAL_MS;
    return Math.max(0, nextReset - now);
}

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