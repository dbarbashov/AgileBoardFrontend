var agileboardModule = require('./AgileBoardModule');
var Backend = require('./Backend');
var fs = require('fs');
var moment = require('moment');

function GanntChartController($scope, $q) {
    var TicketColumn = {};
    var TicketProject = {};
    var AllProjects = {};
    var AllTickets = [];
    var AllUsers = {};
    var g = new JSGantt.GanttChart(document.getElementById('gannt-chart'), 'day');

    var GetAllTickets = function (projectId) { return function(columns) {
        var pp = [];
        for (var j = 0; j < columns.length; ++j) {
            var column = columns[j];
            var p = Backend.GetTicketsByColumn(column.ColumnId).then(function(tickets) {
                for (var i = 0; i < tickets.length; ++i) {
                    TicketColumn[tickets[i].TicketId] = column.ColumnId;
                    TicketProject[tickets[i].TicketId] = projectId;
                }
                return tickets;
            });
            pp.push(p);
        }
        return $q.all(pp).then(function(ticketsOfColumns) {
            var allTickets = [];
            for (var i = 0; i < ticketsOfColumns.length; ++i) {
                for (var j = 0; j < ticketsOfColumns[i].length; ++j) {
                    allTickets.push(ticketsOfColumns[i][j]);
                }
            }
            return allTickets
        });
    } };

    function Init() {
        TicketProject = {};
        TicketColumn = {};
        return Backend.GetProjects().then(function(projects) {
            var pp = [];
            for (var i = 0; i < projects.length; ++i) {
                var project = projects[i];
                AllProjects[project.ProjectId] = project;
                var p = Backend.GetColumnsByProject(project.ProjectId).then(GetAllTickets(project.ProjectId));
                pp.push(p);
            }
            return $q.all(pp).then(function (ticketsOfProjects) {
                var allTickets = [];
                for (var i = 0; i < ticketsOfProjects.length; ++i) {
                    for (var j = 0; j < ticketsOfProjects[i].length; ++j) {
                        allTickets.push(ticketsOfProjects[i][j]);
                    }
                }
                return allTickets;
            });
        }).then(function (allTickets) {
            AllTickets = allTickets;
            return AllTickets;
        }).then(function() {
            return Backend.LoadAllUsers().then(function(users) {
                users.forEach(function (user) {
                    AllUsers[user.UserId] = user;
                })
            });
        });
    }

    /**
     * @return {string}
     */
    var GetAssigneeName = function (assigneeId) {
        if (typeof AllUsers[assigneeId] !== 'undefined') {
            return AllUsers[assigneeId].LastName + ' ' + AllUsers[assigneeId].FirstName;
        } else {
            return '';
        }
    };

    /**
     * @return {string}
     */
    var GetTicketDependencies = function(startI, t) {
        var deps = []
        t.Dependencies.forEach(function(dep) {
            AllTickets.forEach(function(idx, t2) {
                if (t2.TicketId === dep) {
                    deps.push(startI + idx);
                }
            });
        });
        return deps.join(',');
    };

    Init().then(function() {
        var startI = 0;
        var ProjectDates = {};
        for (var k in AllProjects) {
            ProjectDates[k] = {
                minDate: 1e16,
                maxDate: 0
            };
        }

        for (var i = 0; i < AllTickets.length; ++i) {
            var t = AllTickets[i];
            var projId = TicketProject[t.TicketId];
            ProjectDates[projId].minDate = Math.min(t.StartDate, ProjectDates[projId].minDate);
            ProjectDates[projId].maxDate = Math.max(t.EndDate, ProjectDates[projId].maxDate);
        }

        var i = 0;
        for (var k in AllProjects) {
            var p = AllProjects[k];
            var minDate = ProjectDates[k].minDate;
            var maxDate = ProjectDates[k].maxDate;
            var pr = i;
            var task = new JSGantt.TaskItem(
                i, p.ProjectName,
                moment(minDate).format('YYYY-MM-DD'),
                moment(maxDate).format('YYYY-MM-DD'),
                'ggroupblack',
                '',
                0,
                '',
                0,
                1,
                null,
                1,
                null,
                '',
                '',
                g
            );
            // g.AddTaskItem(task);
            i++;

            for (var j = 0; j < AllTickets.length; ++j) {
                var t = AllTickets[j];
                var projId = TicketProject[t.TicketId];
                if (projId !== k) {
                    continue;
                }

                var startDate = moment(t.StartDate).format('YYYY-MM-DD');
                var endDate = moment(t.EndDate).format('YYYY-MM-DD');
                var task1 = new JSGantt.TaskItem(
                    i, p.ProjectName + " " + t.TicketTitle, startDate, endDate,
                    'gtaskblue', // css class
                    '', // link
                    0, // is milestone (0 or 1)
                    GetAssigneeName(t.AssigneeId), // resource name
                    0, // completion percent
                    null, // is a group task
                    pr, // parent row #
                    0,  // is open
                    // GetTicketDependencies(startI, t),
                    null,
                    '',
                    '',
                    g
                );
                g.AddTaskItem(task1);
                i++;
            }
        }

        // g.setCaptionType('Complete');
        // g.setQuarterColWidth(36);
        g.setDateTaskDisplayFormat('day dd month yyyy');
        // g.setDayMajorDateDisplayFormat('mon yyyy - Week ww');
        // g.setWeekMinorDateDisplayFormat('dd mon');
        // g.setShowTaskInfoLink(1);
        // g.setShowEndWeekDate(0);
        // g.setUseSingleCell(10000);
        g.setFormatArr('Day', 'Week', 'Month', 'Quarter');
        g.Draw();
    });
}

module.exports =
    agileboardModule.component('abGanntChart', {
        controller: ['$scope', '$q', GanntChartController],
        template: fs.readFileSync('./templates/gannt-chart.html')
    });