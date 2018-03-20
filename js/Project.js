var agileBoard = require('./AgileBoardModule');
var Backend = require('./Backend');
var fs = require('fs');

function ProjectController($scope) {
    $scope.Columns = {};
    $scope.EditingColumn = null;
    // Индекс TicketId -> ColumnId
    var ColumnIdByTicketId = {};

    Backend.GetColumnsByProject(this.project)
        .then(
            function (cols) {
                $scope.Columns = {};
                // Индексируем колонки по ColumnId
                cols.forEach(function(col) {
                    $scope.Columns[col.ColumnId] = col;
                });
                $scope.$apply();
                return cols;
            }
        )
        .then(
            function (cols) {
                cols.forEach(function(col) {
                    // Запрашиваем карточки в колонке
                    Backend.GetTicketsByColumn(col.ColumnId).then(
                        function(tickets) {
                            col.Tickets = tickets;
                            // Индексируем id колонок по id карточки
                            tickets.forEach(function(ticket) {
                                ColumnIdByTicketId[ticket.TicketId] = col.ColumnId;
                            });
                            $scope.$apply();
                        }
                    )
                });
            }
        );

    this.OnTicketDrop = function(toColumn, index, ticket) {
        var fromColumn = $scope.Columns[ColumnIdByTicketId[ticket.TicketId]];

        var fromColumnTickets = fromColumn.Tickets;
        var toColumnTickets = toColumn.Tickets;

        // Перетащим карточку в другую колонку на фронте, чтобы быстро все отобразить
        fromColumn.Tickets.forEach(function(t, idx) {
            if (ticket.TicketId === t.TicketId) {
                fromColumn.Tickets.splice(idx, 1);
                return false;
            }
        });

        toColumn.Tickets.splice(index-1, 0, ticket);
        ColumnIdByTicketId[ticket.TicketId] = toColumn.ColumnId;

        // Отправим запрос на перенос на бекенде
        Backend.MoveTicketToColumn(fromColumn.ColumnId, toColumn.ColumnId, ticket.TicketId, index).then(
            function(res) {
                if (res !== true) {
                    // В случае, если бекенд отказывает в таком перетаскивании, откатим изменения на фронте
                    $scope.Columns[fromColumn].Tickets = fromColumnTickets;
                    $scope.Columns[toColumn].Tickets = toColumnTickets;
                    ColumnIdByTicketId[ticket.TicketId] = fromColumn.ColumnId;
                }
            }
        );
    };
    this.EnableColumnNameEditing = function(column) {
        $scope.EditingColumn = column.ColumnId;
        $scope.$apply();
    };
    this.DisableColumnNameEditing = function() {
        $scope.EditingColumn = null;
        $scope.$apply();
    }
}

module.exports =
    agileBoard.component('abProject', {
        controller: ['$scope', ProjectController],
        bindings: {
            project: '='
        },
        template: fs.readFileSync('./templates/project.html')
    });