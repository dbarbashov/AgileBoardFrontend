var agileBoard = require('./AgileBoardModule');
var UserService = require('./UserService');
var fs = require('fs');

module.exports =
    agileBoard.component('abHeader', {
        controller: ['$rootScope', '$scope', function($rootScope, $scope) {

            $rootScope.$on('updateUser', function (_, user, apply) {
                if (apply) {
                    $scope.$apply(function () {
                        $scope.CurrentUser = user;
                    })
                } else
                $scope.CurrentUser = user;
            });

            this.LogOut = function() {
                document.getElementById("loginPage").style.display = "block";
                document.cookie = "agileUser=";
            };


        }],
        template: fs.readFileSync('./templates/header.html')
    });