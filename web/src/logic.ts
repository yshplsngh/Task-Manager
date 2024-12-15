const st = dayjs(isValid.data.startTime)
const et = dayjs(isValid.data.endTime)
const diffInMinutes = et.diff(st, 'minute');

// Calculate hours and remaining minutes
const hours = Math.floor(diffInMinutes / 60);
const minutes = diffInMinutes % 60;

console.log(`Time difference: ${hours} hours and ${minutes} minutes`);