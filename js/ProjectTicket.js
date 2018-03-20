var agileBoard = require('./AgileBoardModule');
var Backend = require('./Backend');
var fs = require('fs');

function ProjectTicketController($scope) {

}

module.exports =
    agileBoard.component('abProjectTicket', {
        controller: ['$scope', ProjectTicketController],
        bindings: {
            ticket: '='
        },
        template: fs.readFileSync('./templates/project-ticket.html')
    });