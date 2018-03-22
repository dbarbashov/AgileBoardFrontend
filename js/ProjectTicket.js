var agileBoard = require('./AgileBoardModule');
var Backend = require('./Backend');
var fs = require('fs');

function ProjectTicketController($scope, TicketModal) {
    var that = this;

    $scope.TicketModal = TicketModal;

    var OnTicketSave = function(ticket) {
        console.info("Saved ", ticket);
    };

    this.EnableEditing = function(ticket) {
        TicketModal.Show(OnTicketSave);
        TicketModal.Ticket = ticket;
    };
}

module.exports =
    agileBoard.component('abProjectTicket', {
        controller: ['$scope', 'TicketModal', ProjectTicketController],
        bindings: {
            ticket: '='
        },
        template: fs.readFileSync('./templates/project-ticket.html')
    });