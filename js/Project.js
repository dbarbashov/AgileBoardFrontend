var agileBoard = require('./AgileBoardModule');
var Backend = require('./Backend');
var fs = require('fs');

function ProjectController($scope) {
    var that = this;

    $scope.Columns = {};

    $scope.EditingProject = false;
    $scope.EditingProjectName = null;

    $scope.EditingColumn = null;
    $scope.EditingColumnName = null;
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

        var fromColumnTickets = fromColumn.Tickets.slice();
        var toColumnTickets = toColumn.Tickets.slice();

        // Перетащим карточку в другую колонку на фронте, чтобы быстро все отобразить
        fromColumn.Tickets.forEach(function(t, idx) {
            if (ticket.TicketId === t.TicketId) {
                fromColumn.Tickets.splice(idx, 1);
                return false;
            }
        });

        toColumn.Tickets.splice(index, 0, ticket);
        ColumnIdByTicketId[ticket.TicketId] = toColumn.ColumnId;

        // Отправим запрос на перенос на бекенде
        Backend.MoveTicketToColumn(fromColumn.ColumnId, toColumn.ColumnId, ticket.TicketId, index).then(
            function(res) {
                if (res !== true) {
                    // В случае, если бекенд отказывает в таком перетаскивании, откатим изменения на фронте
                    $scope.Columns[fromColumn.ColumnId].Tickets = fromColumnTickets;
                    $scope.Columns[toColumn.ColumnId].Tickets = toColumnTickets;
                    ColumnIdByTicketId[ticket.TicketId] = fromColumn.ColumnId;
                    $scope.$apply();
                }
            }
        );
    };
    this.EnableColumnNameEditing = function(column) {
        $scope.EditingColumn = column.ColumnId;
        $scope.EditingColumnName = column.ColumnName;
    };

    this.DisableColumnNameEditing = function() {
        $scope.EditingColumn = null;
        $scope.EditingColumnName = null;
    };

    this.SetColumnName = function(column, columnName) {
        var oldColumnName = column.ColumnName;
        column.ColumnName = columnName;

        Backend.SetColumnName(column.ColumnId, columnName).then(
            function(success) {
                if (!success) {
                    column.ColumnName = oldColumnName;
                    $scope.$apply();
                }
            }
        );

        that.DisableColumnNameEditing();
    };

    this.EnableProjectNameEditing = function(project) {
        $scope.EditingProject = true;
        $scope.EditingProjectName = project.ProjectName;
    };

    this.DisableProjectNameEditing = function() {
        $scope.EditingProject = false;
        $scope.EditingProjectName = null;
    };

    this.SetProjectName = function(project, projectName) {
        var oldProjectName = project.ProjectName;
        project.ProjectName = projectName;

        Backend.SetProjectName(project.ProjectId, projectName).then(
            function(success) {
                if (!success) {
                    project.ProjectName = oldProjectName;
                    $scope.$apply()
                }
            }
        );

        that.DisableProjectNameEditing();
    };

    this.AddNewColumn = function(project) {
        Backend.AddNewColumn(project.ProjectId).then(
            function(column) {
                $scope.Columns[column.ColumnId] = column;
                column.Tickets = [];
                $scope.$apply();
            }
        );
    };
}

module.exports =
    agileBoard.component('abProject', {
        controller: ['$scope', ProjectController],
        bindings: {
            project: '='
        },
        template: fs.readFileSync('./templates/project.html')
    });