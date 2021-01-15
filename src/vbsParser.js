const fs = require('fs');
const moment = require('moment');
const uuidv4 = require('uuid/v4')

function parse(fileName, identifier, year) {
    console.log("Parsing vbs file.");
    var contents = fs.readFileSync(fileName, 'utf8');
    var lines = contents.split("\n");
    var events = [];
    console.log(identifier);
    for (var i =0; i < lines.length; i++) {
        if (lines[i].indexOf(identifier) === -1)
            continue;
            console.log(lines[i]);
        var eventInfoRawTextArray = findStringValues(lines[i]);
        if (eventInfoRawTextArray.length < 2)
            continue;
        var eventInfo = getEventDateAndTitle(eventInfoRawTextArray);
        if (eventInfo.date.year() !== year)
            continue;
        var event = createIcsEvent(eventInfo);
        events.push(event);
    }
    return events;
}

function findStringValues(text) {
    var stringValueArray = [];
    var doubleQuoteIndexes = getIndexesOfCharacter(text, '"');
    // check for odd number of double quote character occurrences
    if (doubleQuoteIndexes.length % 2 === 1)
        doubleQuoteIndexes = [];
    
    var singleQuoteIndexes = getIndexesOfCharacter(text, "'");
    // check for odd number of single quote character occurrences
    if (singleQuoteIndexes.length % 2 === 1)
        singleQuoteIndexes = [];
    
    if (doubleQuoteIndexes.length === 0 && singleQuoteIndexes.length > 0) {
        for (var i = 0; i < singleQuoteIndexes.length - 1; i+=2) {
            var strValue = text.substring(singleQuoteIndexes[i], singleQuoteIndexes[i + 1]);
            stringValueArray.push(strValue);
        }
    }
    else if (singleQuoteIndexes.length === 0 && doubleQuoteIndexes.length > 0) {
        for (var i = 0; i < doubleQuoteIndexes.length - 1; i+=2) {
            var strValue = text.substring(doubleQuoteIndexes[i] + 1, doubleQuoteIndexes[i + 1]);
            stringValueArray.push(strValue);
        }
    }
    else if (singleQuoteIndexes.length > 0 && doubleQuoteIndexes.length > 0) {
        // TO DO: Get values from both index sets. If anything overwraps, throw an error
        return [];
    }
    else {
        // both indexes are empty.
        return [];
    }
    return stringValueArray;
}

function getIndexesOfCharacter(text, ch) {
    var characterIndex = 0;
    var indexes = [];
    while (characterIndex < text.length) {
        var characterIndex = text.indexOf(ch, characterIndex);
        if (characterIndex === -1)
            break;
        indexes.push(characterIndex);
        characterIndex++;
    }
    return indexes;
}

function getEventDateAndTitle(textArray) {
    var event = {}
    for (var i=0; i< textArray.length; i++) {
        try {
            var momentDate = moment(textArray[i]);
            if (momentDate.isValid())
                event.date = momentDate;
            else
                event.title = textArray[i];
        }
        catch (error) {
            event.title = textArray[i];
        }
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
