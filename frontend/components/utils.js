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
        var minutes = Math.round(elapsed / msPerMinute);
        return minutes + (minutes === 1 ? ' minute ago' : ' minutes ago');
    }

    else if (elapsed < msPerDay) {
        var hours = Math.round(elapsed / msPerHour);
        return hours + (hours === 1 ? ' hour ago' : ' hours ago');
    }

    else if (elapsed < msPerMonth) {
        var days = Math.round(elapsed / msPerDay);
        return days + (days === 1 ? ' day ago' : ' days ago');
    }

    else if (elapsed < msPerYear) {
        var months = Math.round(elapsed / msPerMonth);
        return months + (months === 1 ? ' month ago' : ' months ago');
    }

    else {
        var years = Math.round(elapsed / msPerYear);
        return years + (years === 1 ? ' year ago' : ' years ago');
    }
}

export { timeDifference };
