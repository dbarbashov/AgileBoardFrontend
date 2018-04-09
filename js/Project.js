var agileBoard = require('./AgileBoardModule');
var Backend = require('./Backend');
var fs = require('fs');

function ProjectController($rootScope, $scope, TicketModal) {
    var that = this;

    $scope.Columns = {};
    $scope.TicketsIndex = {};
    $scope.AllTickets = [];

    $scope.EditingProject = false;
    $scope.EditingProjectName = null;

    $scope.EditingColumn = null;
    $scope.EditingColumnName = null;

    $scope.TicketModal = TicketModal;

    // Индекс TicketId -> ColumnId
    var ColumnIdByTicketId = {};

    var Init = function () {
        if ($rootScope.ActiveProject === null) {
            return;
        }
        return Backend.GetColumnsByProject($rootScope.ActiveProject.ProjectId)
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
                                    $scope.TicketsIndex[ticket.TicketId] = ticket;
                                    $scope.AllTickets.push(ticket);
                                });
                                $scope.$apply();
                            }
                        )
                    });
                    return true;
                }
            );
    };

    this.OnTicketDrop = function(toColumn, index, ticket) {
        var fromColumn = $scope.Columns[ColumnIdByTicketId[ticket.TicketId]];

        var fromColumnTickets = fromColumn.Tickets.slice();
        var toColumnTickets = toColumn.Tickets.slice();

        var prevIdx = 0;
        // Перетащим карточку в другую колонку на фронте, чтобы быстро все отобразить
        fromColumn.Tickets.forEach(function(t, idx) {
            if (ticket.TicketId === t.TicketId) {
                fromColumn.Tickets.splice(idx, 1);
                prevIdx = idx;
                return false;
            }
        });

        if (fromColumn.ColumnId === toColumn.ColumnId) {
            if (prevIdx < index) {
                index--;
            }
        }

        toColumn.Tickets.splice(index, 0, ticket);
        ColumnIdByTicketId[ticket.TicketId] = toColumn.ColumnId;

        // Отправим запрос на перенос на бекенде
        Backend.MoveTicketToColumn(fromColumn.ColumnId, toColumn.ColumnId, ticket.TicketId, index).then(
            function(res) {
                if (res !== "true") {
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
                if (success === "false") {
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
                that.EnableColumnNameEditing(column);
                $scope.$apply();
            }
        );
    };

    this.AddNewTicket = function(column) {
        Backend.AddTicket(column.ColumnId).then(
            function(ticket) {
                column.Tickets.splice(0, 0, ticket);
                ColumnIdByTicketId[ticket.TicketId] = column.ColumnId;
                $scope.TicketsIndex[ticket.TicketId] = ticket;
                $scope.AllTickets.push(ticket);
                $scope.$apply();
            }
        );
    };

    $rootScope.$on('project-changed', function() {
        Init();
    });
    $rootScope.$on('update-ticket', function() {
        $scope.$apply();
    });
    Init();
}

module.exports =
    agileBoard.component('abProject', {
        controller: ['$rootScope', '$scope', 'TicketModal', ProjectController],
        bindings: {
            project: '<'
        },
        template: fs.readFileSync('./templates/project.html')
    });