const fs = require('fs');
var events = [];
var errors = [];

// function parse(parsingFunction, fileName, identifier) {
//     try {
//         events = parsingFunction(fileName, identifier);    
//     } catch (error) {
//         errors.push(error);
//     }
//     if (!events)
//         errors.push("Unknown error occurred.");
//     if (events.length == 0)
//         errors.push("No events found.");
// }

function parse(parsingFunction) {
    try {
        events = parsingFunction();
    } catch (error) {
        errors.push(error);
    }
    if (!events)
        errors.push("Unknown error occurred.");
    if (events.length == 0)
        errors.push("No events found.");
}

function getErrors() {
    return errors;
}

function getEvents() {
    return events;
}

module.exports = {
    parse,
    getErrors,
    getEvents
};