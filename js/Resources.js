var agileboardModule = require('./AgileBoardModule');
var fs = require('fs');
var uuid = require('uuid/v4');
var Backend = require('./Backend');
var UserService = require('./UserService');

function ResourcesController($scope) {
    var that = this;
    $scope.NewUser = {
        UserId: uuid(),
        Login: "",
        Password: "",
        FirstName: "",
        LastName: "",
        UserPic: ""
    };

    $scope.AllUsers = UserService.AllUsers;

    this.AddUser = function() {
        if ($scope.NewUser.FirstName.length === 0) {
            return;
        }
        if ($scope.NewUser.LastName.length === 0) {
            return;
        }

        Backend.SaveUser($scope.NewUser).then(function (user) {
            if (user !== null) {
                $scope.NewUser = {
                    UserId: uuid(),
                    Login: "",
                    Password: "",
                    FirstName: "",
                    LastName: "",
                    UserPic: ""
                };
                UserService.AllUsers.push(user);
                $scope.AllUsers = UserService.AllUsers;
                $scope.$apply();
            }
        });
    };

    this.DeleteUser = function(user) {
        Backend.DeleteUser(user.UserId).then(function(resp) {
            if (resp === "true") {
                return UserService.LoadAllUsers();
            }
        }).then(function(users) {
            $scope.AllUsers = users;
            $scope.$apply();
        });
    };
}

module.exports =
    agileboardModule.component('abResources', {
        controller: ['$scope', ResourcesController],
        template: fs.readFileSync('./templates/resources.html')
    });