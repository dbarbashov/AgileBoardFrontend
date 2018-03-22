var agileBoard = require('./AgileBoardModule');

agileBoard.service('TicketModal', [
    function() {
        var _saveCallback = null;
        return {
            Ticket: null,
            Show: function(saveCallback) {
                var modal = document.getElementById("ticket-modal");
                modal.classList.add("is-active");
                _saveCallback = saveCallback;
            },
            Hide: function () {
                var modal = document.getElementById("ticket-modal");
                modal.classList.remove("is-active");
                _saveCallback = null;
            }
        };
    }
]);