var agileBoard = require('./AgileBoardModule');
var fs = require('fs');

module.exports =
    agileBoard.component('abHeader', {
        template: fs.readFileSync('./templates/header.html')
    });