var agileBoard = require('./AgileBoardModule');
var Backend = require('./Backend');

agileBoard.service('TicketModal', [
    function() {
        var _saveCallback = null;
        var that = {
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
            },
            SetTicket: function(ticket) {
                that.Ticket = JSON.parse(JSON.stringify(ticket));
            },
            Save: function() {
                var saveButton = document.getElementById("ticket-modal-save");
                saveButton.classList.add('is-loading');
                Backend.SaveTicket(that.Ticket).then(function(ticket) {
                    saveButton.classList.remove('is-loading');
                    _saveCallback(ticket);
                    that.Hide();
                });
            }
        };
        return that;
    }
]);