export default function formatTimestamp(date: Date) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dateToCompare = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    // Check if the date is today
    if (dateToCompare.getTime() === today.getTime()) {
        const formatter = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        const diffInHours = Math.floor(diffInMinutes / 60);

        if (diffInSeconds < 60) {
            return formatter.format(-diffInSeconds, 'second');
        } else if (diffInMinutes < 60) {
            return formatter.format(-diffInMinutes, 'minute');
        } else {
            return formatter.format(-diffInHours, 'hour');
        }
    } else {
        // Use Intl.DateTimeFormat for dates that are not today
        const formatter = new Intl.DateTimeFormat(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return formatter.format(date);
    }
}
