var agileBoard = require('./AgileBoardModule');
var UserService = require('./UserService');

var fs = require('fs');


module.exports =
    agileBoard.component('abHeader', {
        controller: ['$scope', function($scope) {
            $scope.CurrentUser = UserService.CurrentUser;
        }],
        template: fs.readFileSync('./templates/header.html')
    });