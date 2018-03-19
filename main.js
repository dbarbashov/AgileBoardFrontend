var angular = require('angular');
var fs = require('fs');

var agileBoard = angular.module('AgileBoard', []);
agileBoard.component('home', {
    template: fs.readFileSync('./templates/home.html')
});