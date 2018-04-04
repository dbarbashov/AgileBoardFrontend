var agileBoard = require('./AgileBoardModule');
var Backend = require('./Backend');

var service = {
    CurrentUser: null,
    AllUsers: [],
    LoadCurrentUser: function() {
        return Backend.LoadCurrentUser().then(function(user) {
            service.CurrentUser = user;
            return user;
        });
    },
    LoadAllUsers: function() {
        return Backend.LoadAllUsers().then(function(users) {
            service.AllUsers = users;
            return users;
        });
    }
};

module.exports = service;