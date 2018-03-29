var agileBoard = require('./AgileBoardModule');
var moment = require('moment');

agileBoard.filter('datetime', function() {
    return function(input) {
        return moment(input).format('DD MMM HH:mm');
    };
});