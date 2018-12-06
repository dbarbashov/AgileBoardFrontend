var agileBoard = require('./AgileBoardModule');
var Backend = require('./Backend');
var fs = require('fs');

function LoginController($rootScope, $scope) {
}

module.exports =
    agileBoard.component('abLogin', {
        controller: ['$rootScope', '$scope', LoginController],
        template: fs.readFileSync('./templates/login.html')
    });