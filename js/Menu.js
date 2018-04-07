var agileBoard = require('./AgileBoardModule');
var Backend = require('./Backend');
var fs = require('fs');

function MenuController($rootScope, $scope) {
    $scope.Projects = [];
    $scope.ActiveProject = null;

    var that = this;

    Backend.GetProjects().then(
        function(projects) {
            $scope.Projects = projects;
            $scope.$apply();
        }
    );

    this.SetActiveProject = function (project) {
        $rootScope.ActiveProject = project;
        $scope.ActiveProject = project;
        $rootScope.$broadcast("project-changed");
    };

    this.AddNewProject = function() {
        Backend.AddNewProject().then(
            function(project) {
                $scope.Projects.push(project);
                that.SetActiveProject(project);
                $scope.$apply();
            }
        );
    };
}

module.exports =
    agileBoard.component('abMenu', {
        controller: ['$rootScope', '$scope', MenuController],
        template: fs.readFileSync('./templates/side-menu.html')
    });