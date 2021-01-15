const ics = require('ics');
const fs = require('fs');
const uuidv4 = require('uuid/v4');
const eventsParser = require('./eventsParser');
const csvParser = require('./csvParser');
const vbsParser = require('./vbsParser');

const beginEventIdentifier = "BEGIN:VEVENT";
const endEventIdentifier = "END:VEVENT";
const icsSuffix = "END:VCALENDAR";
const msProp = "X-MICROSOFT-CDO-BUSYSTATUS:OOF\r\nX-MICROSOFT-CDO-IMPORTANCE:1\r\nX-MICROSOFT-DISALLOW-COUNTER:FALSE\r\nX-MS-OLK-AUTOFILLLOCATION:TRUE\r\nX-MS-OLK-CONFTYPE:0\r\n";
// TODO?: make changes to alarmText below to customize the alarm trigger, discription, etc.
const alarmText = "BEGIN:VALARM\r\nTRIGGER:-PT720M\r\nACTION:DISPLAY\r\nDESCRIPTION:Reminder\r\nEND:VALARM\r\n";
const classProp = "CLASS:PUBLIC\r\n";

var args = process.argv.slice(2);
if (args.length < 4 || args.length > 6) {
	console.log("Invalid number of arguments. Please supply the following arguments.");
    console.log("CSV-file-name, ics-file-name, year, calendar-identifier-or-company-name, " +
        "(optional)use-vbs-default-is-false, (optional)vbs-line-identifier-for-each-event-entry");
    console.log("");
	console.log("Example:");
    console.log('node icsCalendarParser US2020Holidays-acme.csv US2020Holidays.ics 2020 "ACME US"');
    console.log("");
    console.log("vbs Parse Example:");
    console.log('node icsCalendarParser US2021Holidays-acme.vbs US2021Holidays.ics 2021 "ACME US" true objDict.Add');
    console.log("");
	return;
}

const csvFileName = args[0];
const icsFileName = args[1];
const year = parseInt(args[2]);
const icsPrefix = "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nCALSCALE:GREGORIAN\r\nPRODID:" + args[3] + "\r\n";
const useVbs = !!args[4] && args[4].toUpperCase() === 'TRUE'
const vbsIdentifier = useVbs ? args[5] : "";

eventsParser.parse(function() {
    if (useVbs)
        return vbsParser.parse(csvFileName, vbsIdentifier, year);
    else
        return csvParser.parse(csvFileName, year);
});

const errors = eventsParser.getErrors();
if (errors.length > 0) {
    errors.forEach(error => {
        console.log(error);
    });
    return;
}

const calendarEvents =  eventsParser.getEvents();

/* To debug issues and to check whether events are created properly, uncomment this block
for (var i = 0; i < calendarEvents.length; i++) {
    console.log(calendarEvents[i].title);
}
*/

fs.writeFileSync(icsFileName, icsPrefix, (error) => {
    if (error) throw error
});

calendarEvents.map((event) => {
    ics.createEvent(event, (error, value) => {
        if (error) throw error
        var newVal = trimEvent(value);
        console.log(newVal);
        fs.appendFileSync(icsFileName, newVal, (error) => {
            if (error) throw error
        })
    })
})

fs.appendFileSync(icsFileName, icsSuffix, (error) => {
    if (error) throw error
});

function trimEvent(icsValue) {
    var beginIndex = icsValue.indexOf(beginEventIdentifier);
    var endIndex = icsValue.indexOf(endEventIdentifier) + endEventIdentifier.length;
    var temp = icsValue.substring(beginIndex, endIndex) + '\r\n';
    var dateTimeIndexStart = temp.indexOf("DTSTART");
    var timeIndexStart = temp.indexOf("T", dateTimeIndexStart + 7);
    var tempOrig = temp.substring(timeIndexStart + 1, timeIndexStart + 8);
    var tempReplace = "000000";
    var newTemp = temp.replace(tempOrig, tempReplace);
    // replace end vevent with other strings plus vevent
    var new2temp = newTemp.replace(endEventIdentifier, classProp + msProp + alarmText + endEventIdentifier);
    return new2temp;    
}
