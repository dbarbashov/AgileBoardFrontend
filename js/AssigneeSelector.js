var agileBoard = require('./AgileBoardModule');
var UserService = require('./UserService');
var fs = require('fs');

module.exports =
    agileBoard.component('abAssigneeSelector', {
        controller: ['$scope', '$rootScope', function($scope, $rootScope) {
            var that = this;

            $scope.CurrentUser = $rootScope.CurrentUser;
            $scope.AllUsers = [];
            $scope.Assignee = null;
            $scope.SelectAssignee = function(user) {
                that.onAssigneeSelected({user: user});
            };

            UserService.LoadAllUsers().then(function (users) {
               $scope.AllUsers = users;
            });

            var updateAssignee = function() {
                $scope.Assignee = null;
                $scope.AllUsers.forEach(function(user) {
                    if (user.UserId === that.currentAssignee) {
                        $scope.Assignee = user;
                        return false;
                    }
                });
            };

            this.$onChanges = function(changesObj) {
                if (typeof changesObj.currentAssignee !== 'undefined') {
                    updateAssignee();
                }
            };
        }],
        $onChanges: function(changesObj) {
        },
        bindings: {
            currentAssignee: '<',
            onAssigneeSelected: '&'
        },
        template: fs.readFileSync('./templates/assignee-selector.html')
    });