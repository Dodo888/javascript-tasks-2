'use strict';

var phoneBook = []; // Здесь вы храните записи как хотите

/*
    Функция добавления записи в телефонную книгу.
    На вход может прийти что угодно, будьте осторожны.
*/
module.exports.add = function add(name, phone, email) {
    var isNameValid = (name.length > 0);
    var isEmailValid = ((email.indexOf('@') !== -1) &&
                        (email.indexOf('@') === email.lastIndexOf('@')) &&
                        (email.indexOf('.') !== -1));
    var isPhoneValid = false;
    if (isEmailValid) {
        var phoneInFormat = checkPhoneValidity(phone);
        if (phoneInFormat) {
        var phoneLength = phoneInFormat.length;
        var phoneWithSpaces = phoneInFormat.slice(0, phoneLength-10) + ' (' +
            phoneInFormat.substr(phoneLength-10, 3) + ') ' +
            phoneInFormat.substr(phoneLength-7, 3) + '-' +
            phoneInFormat.substr(phoneLength-4, 1) + '-' +
            phoneInFormat.substr(phoneLength-3);
        isPhoneValid = phoneInFormat;
    }
    }
    if (isNameValid && isEmailValid && isPhoneValid) {
        phoneBook.push({name: name, phone: phoneInFormat, phone2: phoneWithSpaces, email: email});
    }
    return isNameValid && isEmailValid && isPhoneValid;
};

/*
    Функция проверки валидности телефонного номера.
*/
function checkPhoneValidity(phone) {
    var count;
    var phoneInFormat = '';
    var areBracketsOpened = false;
    var numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    var validSymbols = ['(', ')', ' ', '-', '+'];
    for (count = 0; count < phone.length; count++) {
        if ((numbers.indexOf(phone[count]) === -1) &&
            (validSymbols.indexOf(phone[count]) === -1)) {
            return null;
        }
        if (numbers.indexOf(phone[count]) !== -1) {
            phoneInFormat = phoneInFormat + phone[count];
        }
        if (phone[count] === '(') {
            if (phoneInFormat.length === 1) {
                areBracketsOpened = true;
            } else {
                return null;
            }
        }
        if ((phone[count] === ')' && (!areBracketsOpened || phoneInFormat.length !== 4)) ||
            (phone[count] === '+' && phoneInFormat.length > 0) ||
            (phone[count] === '-' && phoneInFormat.length < 6)) {
            return null;
        }
        if (phone[count] === ')') {
            areBracketsOpened = false;
        }
    }
    if (areBracketsOpened) {
        return null;
    }
    phoneInFormat = (phoneInFormat.length === 10) ? '+7' + phoneInFormat : '+' + phoneInFormat;
    return phoneInFormat;
}

/*
   Функция поиска записи в телефонную книгу.
   Поиск ведется по всем полям.
*/
module.exports.find = function find(query) {
    if (!query) {
        query = '';
    }
    var currentRecord;
    for (currentRecord = 0; currentRecord < phoneBook.length; currentRecord++) {
        if (isRecordSuitable(phoneBook[currentRecord], query)) {
            console.log(phoneBook[currentRecord].name + ', ' +
                        phoneBook[currentRecord].phone2 + ', ' +
                        phoneBook[currentRecord].email);
        }
    }

};

/*
   Функция удаления записи в телефонной книге.
*/
module.exports.remove = function remove(query) {
    var currentRecord;
    var newPhoneBook = [];
    var deletedRecordsAmount = 0;
    for (currentRecord = 0; currentRecord < phoneBook.length; currentRecord++) {
        if (!isRecordSuitable(phoneBook[currentRecord], query)) {
            newPhoneBook.push(phoneBook[currentRecord]);
        } else {
            deletedRecordsAmount++;
        }
    }
    phoneBook = newPhoneBook;
    console.log(deletedRecordsAmount + ' records deleted');
};

/*
   Функция проверки, удовлетворяет ли запись запросу.
*/
function isRecordSuitable(record, query) {
    var fields = Object.keys(record);
    for (var currentField = 0; currentField < fields.length; currentField++) {
        if (record[fields[currentField]].indexOf(query) !== -1) {
            return true;
        }
    }
    return false;
}

/*
   Функция импорта записей из файла (задача со звёздочкой!).
*/
module.exports.importFromCsv = function importFromCsv(filename) {
    var data = require('fs').readFileSync(filename, 'utf-8');
    var records = data.split('\r\n');
    var currentRecord;
    var addedRecordsAmount = 0;
    for (currentRecord = 0; currentRecord < records.length; currentRecord++) {
        var wasAdded = false;
        if (records[currentRecord].indexOf(';') !== -1) {
            var fields = records[currentRecord].split(';');
            wasAdded = module.exports.add(fields[0], fields[1], fields[2]);
            if (wasAdded) {
                addedRecordsAmount++;
            }
        }
    }
    console.log(addedRecordsAmount + ' records added');
};

var tableHeader = [
    '┌────────────────────────┬────────────────────────┬────────────────────────┐',
    '│ Имя                    │ Телефон                │ email                  │',
    '├────────────────────────┼────────────────────────┼────────────────────────┤'
];
var tableFooter = [
    '└────────────────────────┴────────────────────────┴────────────────────────┘'
];

/*
   Функция вывода всех телефонов в виде ASCII (задача со звёздочкой!).
*/

var COLUMN_WIDTH = 23;
module.exports.showTable = function showTable() {
    var line;
    console.log(tableHeader.join('\n'));
    var currentRecord;
    for (currentRecord = 0; currentRecord < phoneBook.length; currentRecord++) {
        var spacesAmount = 0;
        var recordString = '';
        var fields = ['name', 'phone2', 'email'];
        var currentField;
        for (currentField = 0; currentField < fields.length; currentField++) {
            recordString += '│ ' + phoneBook[currentRecord][fields[currentField]];
            for (spacesAmount = 0;
                 spacesAmount < COLUMN_WIDTH -
                    (phoneBook[currentRecord][fields[currentField]]).length;
                 spacesAmount++) {
                recordString += ' ';
            }
        }
        recordString += '│';
        console.log(recordString);
    }
    console.log(tableFooter[0]);

};
