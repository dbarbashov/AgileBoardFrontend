var agileBoard = require('./AgileBoardModule');
var Backend = require('./Backend');
var fs = require('fs');

function ProjectController($scope) {
    $scope.Columns = [];

    Backend.GetColumnsByProject(this.project)
        .then(
            function (cols) {
                $scope.Columns = cols;
                $scope.$apply();
                return cols;
            }
        )
        .then(
            function (cols) {
                cols.forEach(function(col) {
                    Backend.GetTicketsByColumn(col.ColumnId).then(
                        function(tickets) {
                            col.Tickets = tickets;
                            $scope.$apply();
                        }
                    )
                });
            }
        );
}

module.exports =
    agileBoard.component('abProject', {
        controller: ['$scope', ProjectController],
        bindings: {
            project: '='
        },
        template: fs.readFileSync('./templates/project.html')
    });