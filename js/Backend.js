var angular = require('angular');

var injector = angular.injector(['ng']);
var $q = injector.get('$q');

module.exports = {
    GetProjects: function() {
        return $q(function(resolve, reject) {
            var projects = [
                { ProjectId: "1", ProjectName: "Project 1" },
                { ProjectId: "2", ProjectName: "Project 2" },
                { ProjectId: "3", ProjectName: "Project 3" }
            ];
            resolve(JSON.parse(JSON.stringify(projects)));
        });
    },
    GetColumnsByProject: function(projectId) {
        return $q(function(resolve, reject) {
            var columns = [
                { ColumnId: "1", ColumnName: "First column", Tickets: [] },
                { ColumnId: "2", ColumnName: "Second column", Tickets: [] },
                { ColumnId: "3", ColumnName: "Third column", Tickets: [] }
            ];
            resolve(JSON.parse(JSON.stringify(columns)));
        });
    },
    GetTicketsByColumn: function(columnId) {
        return $q(function(resolve, reject) {
            var tickets = [
                { TicketId: columnId + "1", TicketTitle: "Длинное название тикета очень длинное что прям не вмещается", TicketDescription: "Lorem ipsum set dolor amet",
                    TicketPic: null,
                    StartDate: (new Date())*1 - 60*60*24*1000, EndDate: (new Date)*1 + 60*60*24*1000,
                    Tags: [
                        {TagId: '1', TagTitle: 'Важно', TagColor: 'danger'},
                        {TagId: '2', TagTitle: 'Tag2', TagColor: 'warning'},
                        {TagId: '3', TagTitle: 'Просто тег', TagColor: 'success'}
                    ],
                    AssigneeId: "1",
                    Dependencies: []
                },
                { TicketId: columnId + "2", TicketTitle: "Ticket 2", TicketDescription: "Lorem ipsum set dolor amet",
                    TicketPic: "https://bulma.io/images/placeholders/1280x960.png",
                    StartDate: (new Date())*1 - 60*60*49*1000, EndDate: (new Date)*1 - 60*60*1000,
                    Tags: [
                        {TagId: '3', TagTitle: 'Просто тег', TagColor: 'success'}
                    ],
                    AssigneeId: null,
                    Dependencies: []
                },
                { TicketId: columnId + "3", TicketTitle: "Ticket 3", TicketDescription: "Раз два три четыре пять",
                    TicketPic: null,
                    StartDate: (new Date())*1 - 60*60*49*1000, EndDate: (new Date)*1 - 60*60*1000,
                    Tags: [],
                    AssigneeId: null,
                    Dependencies: []
                }
            ];
            resolve(JSON.parse(JSON.stringify(tickets)));
        });
    },
    SetColumnName: function(columnId, columnName) {
        return $q(function(resolve, reject) {
            resolve(true);
        });
    },
    SetProjectName: function(projectId, projectName) {
        return $q(function(resolve, reject) {
            resolve(true);
        });
    },
    MoveTicketToColumn: function(fromColumnId, toColumnId, ticketId, index) {
        return $q(function(resolve, reject) {
            resolve(true);
        });
    },
    AddNewColumn: function(projectId) {
        return $q(function(resolve, reject) {
            resolve({
                ColumnId: projectId + Math.random().toString(),
                ColumnName: "New Column"
            });
        });
    },
    AddNewProject: function() {
        return $q(function (resolve, reject) {
            resolve({
                ProjectId: Math.random().toString(),
                ProjectName: "New Project"
            });
        });
    },

    LoadAllUsers: function() {
        return $q(function(resolve, reject) {
            resolve([
                {
                    UserId: "1",
                    FirstName: "Daniil",
                    LastName: "Barbashov",
                    UserPic: "https://bulma.io/images/placeholders/1280x960.png"
                },
                {
                    UserId: "2",
                    FirstName: "Michael",
                    LastName: "Sapunov",
                    UserPic: "https://bulma.io/images/placeholders/1280x960.png"
                }
            ]);
        });
    },
    LoadCurrentUser: function() {
        return $q(function(resolve, reject) {
            resolve({
                UserId: "1",
                FirstName: "Daniil",
                LastName: "Barbashov",
                UserPic: "https://bulma.io/images/placeholders/1280x960.png"
            });
        });
    },
    SaveTicket: function(ticket) {
        return $q(function(resolve, reject) {
            setTimeout(function() {
                resolve(ticket);
            }, 500);
        });
    },
    AddTicket: function(columnId) {
        return $q(function(resolve, reject) {
            resolve(JSON.parse(JSON.stringify({
                TicketId: columnId + Math.random(),
                TicketTitle: "New ticket",
                TicketDescription: "",
                TicketPic: null,
                StartDate: null,
                EndDate: null,
                Tags: [],
                AssigneeId: null,
                Dependencies: []
            })));
        });
    }
};