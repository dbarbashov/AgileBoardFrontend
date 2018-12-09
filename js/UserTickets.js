var agileBoard = require('./AgileBoardModule');
var Backend = require('./Backend');
var UserService = require('./UserService');
var fs = require('fs');

function UserTicketsController($rootScope, $scope) {

    var that = this;

    $scope.UserTickets = [];
    $scope.ActiveUserTicket = null;
    $scope.Projects = [];

    $rootScope.$on('updateUser', function (_, user) {
        $scope.UserTickets = [];
        $scope.Projects = [];
        Backend.GetProjects().then(function (projects) {
            $scope.Projects = projects;
            projects.forEach(function (project) {
                Backend.GetColumnsByProject(project.ProjectId).then(function (columns) {
                    columns.forEach(function (column) {
                        Backend.GetTicketsByColumn(column.ColumnId).then(function (tickets) {
                            tickets.forEach(function (ticket) {
                                if (ticket.AssigneeId === user.UserId) {
                                    ticket.ProjectId = project.ProjectId;
                                    $scope.UserTickets.push(ticket);
                                    $scope.$apply();
                                }
                            });
                        });
                    });
                });
            });
        });
    });

    this.SelectTicket = function (ticket) {
        $rootScope.$emit('open-current-user-ticket', ticket);
    }
}


module.exports =
    agileBoard.component('abUserTickets', {
        controller: ['$rootScope', '$scope', UserTicketsController],
        template: fs.readFileSync('./templates/user-tickets.html')
    });