var agileBoard = require('./AgileBoardModule');
var UserService = require('./UserService');
var fs = require('fs');

module.exports =
    agileBoard.component('abHeader', {
        controller: ['$scope', function($scope) {
            $scope.CurrentUser = null;
            UserService.LoadCurrentUser().then(function (user) {
                $scope.$apply(function () {
                    $scope.CurrentUser = user;
                });
            });

            this.LogOut = function() {
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