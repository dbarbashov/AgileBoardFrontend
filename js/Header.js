var agileBoard = require('./AgileBoardModule');
var UserService = require('./UserService');
var fs = require('fs');

module.exports =
    agileBoard.component('abHeader', {
        controller: ['$scope', function($scope) {
            $scope.CurrentUser = UserService.CurrentUser;
            this.LogOut = function() {
                console.info("login");
                $scope.CurrentUser = null;
                UserService.CurrentUser = null;
                this.RedirectToLogin();
            };

            this.RedirectToLogin = function () {
                var curAddress = location.href;
                location.replace(curAddress.replace("index", "login"));
            };
        }],
        template: fs.readFileSync('./templates/header.html')
    });