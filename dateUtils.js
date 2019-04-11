// Utilities
var monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
var weekDays = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6
}
module.exports.getDayAndMonth = (dateTime)=>{
  return `${dateTime.getDate()} ${monthNames[dateTime.getMonth()]}`;
};
module.exports.getTime = (dateTime)=>{
  var hh = dateTime.getHours();
  var mm = dateTime.getMinutes();
  var ampm = 'am';
  if (hh>12) {
    hh-=12;
    ampm = 'pm';
  }
  if (mm==0) {
    mm = '';
  } else if (mm<10) {
    mm = 'Oh ' + mm; // Zero is pronounced as Oh when saying the time
  }
  return `${hh} ${mm} ${ampm}`;
};
module.exports.calcDateInFuture = (dayOfWeekStr, timeInPMStr)=>{
  var dt = new Date();

  var dayOfWeek = weekDays[dayOfWeekStr.toLowerCase()]
  if (dayOfWeek < dt.getDay()) dayOfWeek += 7;

  dt.setDate(dt.getDate() + dayOfWeek - dt.getDay());

  dt.setHours(parseInt(timeInPMStr) + 12);
  dt.setMinutes(0);
  dt.setSeconds(0);
  dt.setMilliseconds(0);

  return dt;
};
