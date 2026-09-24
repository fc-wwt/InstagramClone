function timeDifference(current, previous) {

    const msPerMinute = 60 * 1000;
    const msPerHour = msPerMinute * 60;
    const msPerDay = msPerHour * 24;
    const msPerMonth = msPerDay * 30;
    const msPerYear = msPerDay * 365;

    const elapsed = current - previous;

    if (elapsed < msPerMinute) {
        return 'Now';
    }

    else if (elapsed < msPerHour) {
        const minutes = Math.round(elapsed / msPerMinute);
        return minutes + (minutes === 1 ? ' minute ago' : ' minutes ago');
    }

    else if (elapsed < msPerDay) {
        const hours = Math.round(elapsed / msPerHour);
        return hours + (hours === 1 ? ' hour ago' : ' hours ago');
    }

    else if (elapsed < msPerMonth) {
        const days = Math.round(elapsed / msPerDay);
        return days + (days === 1 ? ' day ago' : ' days ago');
    }

    else if (elapsed < msPerYear) {
        const months = Math.round(elapsed / msPerMonth);
        return months + (months === 1 ? ' month ago' : ' months ago');
    }

    else {
        const years = Math.round(elapsed / msPerYear);
        return years + (years === 1 ? ' year ago' : ' years ago');
    }
}

export { timeDifference };
