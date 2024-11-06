export function convertToHumanReadable(dateTimeString, hoursMinutes = false) {
    // Parse the datetime string into a Date object
    const dateTime = new Date(dateTimeString);

    // Define arrays for days and months
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    // Extract components
    const dayOfWeek = days[dateTime.getDay()];
    const month = months[dateTime.getMonth()];
    const day = dateTime.getDate();
    const year = dateTime.getFullYear();
    let hours = dateTime.getHours();
    let minutes = dateTime.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    // Convert hours to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // Handle midnight
    // Add leading zero to minutes if needed
    minutes = minutes < 10 ? '0' + minutes : minutes;

    // Construct the human-readable datetime string
    if(hoursMinutes === true){
        const humanReadableDateTime = `${dayOfWeek}, ${month} ${day}, ${year} ${hours}:${minutes} ${ampm}`;
        return humanReadableDateTime;
    }else{
        const humanReadableDateTime = `${month} ${day}, ${year}`;
        return humanReadableDateTime;
    }

}
