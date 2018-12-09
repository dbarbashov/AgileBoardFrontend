var agileBoard = require('./js/AgileBoardModule');
var header = require('./js/Header');
var menu = require('./js/Menu');
var login = require('./js/Login');
var ticketModal = require('./js/TicketModal');
var project = require('./js/Project');
var projectTicket = require('./js/ProjectTicket');
var dateTimeFilter = require('./js/DateTimeFilter');
var UserService = require('./js/UserService');
var Preloader = require('./js/Preloader');
var assigneeSelector = require('./js/AssigneeSelector');
var ganntChart = require('./js/GanntChart');
var resources = require('./js/Resources');
var userTickets = require('./js/UserTickets');

Preloader.Show();
UserService.LoadCurrentUser().then(function(_) {
    UserService.LoadAllUsers().then(function(_) {
        Preloader.Hide();
    });
});