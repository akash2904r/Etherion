import moment from "moment";

export default function _ago (timestamp) {
    const milliseconds = timestamp * 1000;

    const now = moment();
    const secondsAgo = now.diff(moment(milliseconds), 'seconds');
    const minutesAgo = now.diff(moment(milliseconds), 'minutes');
    const hoursAgo = now.diff(moment(milliseconds), 'hours');
    const daysAgo = now.diff(moment(milliseconds), 'days');

    if (secondsAgo < 60) return secondsAgo === 1 ? "1 sec ago" : `${secondsAgo} secs ago`;
    else if (minutesAgo < 60) return minutesAgo === 1 ? "1 min ago" : `${minutesAgo} mins ago`;
    else if (hoursAgo < 24) return hoursAgo === 1 ? "1 hr ago" : `${hoursAgo} hrs ago`;
    else return daysAgo === 1 ? "1 day ago" : `${daysAgo} days ago`;
}