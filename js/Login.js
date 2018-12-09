var agileBoard = require('./AgileBoardModule');
var Backend = require('./Backend');
var UserService = require('./UserService');
var fs = require('fs');

function LoginController($rootScope, $scope) {

    $scope.Login = null;
    $scope.Password = null;
    $rootScope.CurrentUser = null;
    $scope.LoginError = "";

    UserService.LoadAllUsers().then(function (users) {
        $scope.AllUsers = users;
        function getCookie(name) {
            var matches = document.cookie.match(new RegExp(
                "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
            ));
            return matches ? decodeURIComponent(matches[1]) : undefined;
        }

        var cookie = getCookie("agileUser");

        if (typeof cookie !== 'undefined') {
            var curUser = users.find(function (user) {
                return user.Login === cookie;
            });
            if (typeof curUser !== 'undefined') {
                $rootScope.CurrentUser = curUser;
                $rootScope.$broadcast("updateUser", curUser, true);
                UserService.CurrentUser = curUser;
                document.getElementById("loginPage").style.display = "none";
            }
        }
    });

    this.HideLoginPage = function () {
        document.getElementById("loginPage").style.display = "none";
    };

    this.LogIn = function(login, password) {
        var user = $scope.AllUsers.find(function (user) {
            return user.Login === login && user.Password === password
        });
        if (typeof user !== 'undefined') {
            $scope.Login = "";
            $scope.Password = "";
            $scope.LoginError = "";
            document.cookie = "agileUser=" + user.Login;
            this.HideLoginPage();
            $rootScope.CurrentUser = user;
            $rootScope.$broadcast("updateUser", user, false);
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