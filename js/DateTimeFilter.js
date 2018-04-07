var agileBoard = require('./AgileBoardModule');
var moment = require('moment');

agileBoard.filter('datetime', function() {
    return function(input, format) {
        if (input === null) {
            return "Not set";
        }
        if (typeof format === 'undefined') {
            // format = 'DD MMM HH:mm';
            format = 'DD MMM';
        }
        return moment(input).format(format);
    };
});