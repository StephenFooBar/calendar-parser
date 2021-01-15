const fs = require('fs');
const moment = require('moment');
const uuidv4 = require('uuid/v4')

function parse(fileName, year) {
    console.log("Parsing csv file.");
    var contents = fs.readFileSync(fileName, 'utf8');
    var lines = contents.split("\n");
    var events = [];
    for (var i =0; i < lines.length; i++) {
        var eventInfo = getEventDateAndTitle(lines[i]);
        if (eventInfo.date.year() !== year)
            continue;
        var event = createIcsEvent(eventInfo);
        events.push(event);
    }
    return events;
}

function getEventDateAndTitle(textArray) {
    var event = {}
    try {
        var comma = textArray.indexOf(",");
        var momentDate = moment(textArray.substring(0,comma));
        if (!momentDate.isValid()) throw "invalid date";
        event.date = momentDate;
        event.title = textArray.substring(comma + 1).replace('"', '').replace('"', '').trim();
    }
    catch (error) {
        throw error;
    }
    return event;
}

function createIcsEvent(eventInfo) {
    return {
        categories: ['Holiday'],
        title: eventInfo.title,
        start: createStartArray(eventInfo.date),
        duration: {hours: 24},
        uid: uuidv4()
    }
}

function createStartArray(date) {
    var startArray = [];
    startArray.push(date.year());
    startArray.push(date.month() + 1);
    startArray.push(date.date());
    startArray.push(0);
    startArray.push(0);
    return startArray;
}

module.exports = {
    parse
};
