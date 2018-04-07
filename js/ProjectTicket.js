var agileBoard = require('./AgileBoardModule');
var Backend = require('./Backend');
var fs = require('fs');

function ProjectTicketController($scope, TicketModal) {
    var that = this;

    $scope.TicketModal = TicketModal;

    var OnTicketSave = function(ticket) {
        that.ticket = ticket;
        that.onTicketUpdate({updTicket: ticket});
        $scope.$apply();
    };

    this.EnableEditing = function(ticket) {
        TicketModal.Show(OnTicketSave);
        TicketModal.SetTicket(ticket);
    };
}

module.exports =
    agileBoard.component('abProjectTicket', {
        controller: ['$scope', 'TicketModal', ProjectTicketController],
        bindings: {
            ticket: '=',
            onTicketUpdate: '&'
        },
        template: fs.readFileSync('./templates/project-ticket.html')
    });