var agileBoard = require('./AgileBoardModule');
var Backend = require('./Backend');
var fs = require('fs');

function MenuController($rootScope, $scope) {
    $scope.Projects = [];
    $scope.ActiveProject = null;

    Backend.GetProjects().then(
        function(projects) {
            $scope.Projects = projects;
            $scope.$apply();
        }
    );

    this.SetActiveProject = function (project) {
        $rootScope.ActiveProject = project;
        $scope.ActiveProject = project;
        $scope.$apply();
    }
}

module.exports =
    agileBoard.component('abMenu', {
        controller: ['$rootScope', '$scope', MenuController],
        template: fs.readFileSync('./templates/side-menu.html')
    });