var agileBoard = require('./AgileBoardModule');
var Backend = require('./Backend');
var fs = require('fs');

function MenuController($rootScope, $scope) {
    $scope.Projects = [];
    $scope.ActiveProject = null;
    $rootScope.View = "project";
    $scope.View = "project";

    var that = this;

    function Init() {
        return Backend.GetProjects().then(
            function(projects) {
                $scope.Projects = projects;
                if (projects.length > 0) {
                    that.SelectMenuItem("project", projects[0]);
                }
                $scope.$apply();
            }
        );
    }

    Init();

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

    $rootScope.$on('select-ticket-project', function (e, project) {
        that.SelectMenuItem('project', project);
    });

    this.SelectMenuItem = function(menuCategory, arg) {
        if (menuCategory === 'project') {
            $rootScope.View = 'project';
            $scope.View = "project";
            that.SetActiveProject(arg);
        } else {
            $rootScope.View = menuCategory;
            $scope.View = menuCategory;
            that.SetActiveProject(null);
        }
    };

    this.DeleteProject = function(project) {
        return Backend.DeleteProject(project.ProjectId).then(function(resp) {
            if (resp === "true") {
                if ($scope.ActiveProject === project) {
                    $rootScope.View = null;
                    $scope.View = null;
                    $scope.ActiveProject = null;
                }
                $rootScope.$broadcast("updateUser", $rootScope.CurrentUser);
                return Init();
            }
        });
    };
}

module.exports =
    agileBoard.component('abMenu', {
        controller: ['$rootScope', '$scope', MenuController],
        template: fs.readFileSync('./templates/side-menu.html')
    });