function timeDifference(current, previous) {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
        return 'Now';
    }

    else if (elapsed < msPerHour) {
        const minutes = Math.round(elapsed / msPerMinute);
        return minutes === 1 ? '1 minute ago' : minutes + ' minutes ago';
    }

    else if (elapsed < msPerDay) {
        const hours = Math.round(elapsed / msPerHour);
        return hours === 1 ? '1 hour ago' : hours + ' hours ago';
    }

    else if (elapsed < msPerMonth) {
        const days = Math.round(elapsed / msPerDay);
        return days === 1 ? '1 day ago' : days + ' days ago';
    }

    else if (elapsed < msPerYear) {
        const months = Math.round(elapsed / msPerMonth);
        return months === 1 ? '1 month ago' : months + ' months ago';
    }

    else {
        const years = Math.round(elapsed / msPerYear);
        return years === 1 ? '1 year ago' : years + ' years ago';
    }
}

export { timeDifference };
