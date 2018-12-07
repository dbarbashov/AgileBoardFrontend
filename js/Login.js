var agileBoard = require('./AgileBoardModule');
var Backend = require('./Backend');
var UserService = require('./UserService');
var fs = require('fs');

function LoginController($rootScope, $scope) {
     UserService.LoadAllUsers().then(function (users) {
         $scope.AllUsers = users;
    });
    $scope.Login = null;
    $scope.Password = null;
    $scope.CurrentUser = null;
    $scope.LoginError = "";

    this.RedirectToIndex = function () {
        var curAddress = location.href;
        location.replace(curAddress.replace("login", "index"));
    };

    this.LogIn = function(login, password) {
        var found = $scope.AllUsers.some(function (user) {
            return user.Login === login && user.Password === password
        });
        if (angular.isDefined(found) && found) {
            $scope.LoginError = "";
            this.RedirectToIndex();
            $scope.CurrentUser = user;
            UserService.CurrentUser = user;
        } else {
            $scope.LoginError = "Incorrect login or password."
        }
    }
}

module.exports =
    agileBoard.component('abLogin', {
        controller: ['$rootScope', '$scope', LoginController],
        template: fs.readFileSync('./templates/login.html')
    });