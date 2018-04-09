var agileBoard = require('./AgileBoardModule');
var Backend = require('./Backend');
var moment = require('moment');
var bulmaCalendar = require('../node_modules/bulma-calendar/dist/bulma-calendar');

agileBoard.service('TicketModal', [
    function() {
        var _saveCallback = null;
        var _scopeUpdate = null;

        var startDateInput = document.getElementById('ticket-start-date');
        var startDatePicker = new bulmaCalendar(startDateInput, {
            dateFormat: 'yyyy-mm-dd',
            overlay: true,
            onSelect: function(val) {
                that.Ticket.StartDate = val*1;
            }
        });
        var endDateInput = document.getElementById('ticket-end-date');
        var endDatePicker = new bulmaCalendar(endDateInput, {
            dateFormat: 'yyyy-mm-dd',
            overlay: true,
            onSelect: function(val) {
                that.Ticket.EndDate = val*1;
            }
        });

        var that = {
            Ticket: null,
            Show: function(saveCallback, scopeUpdate) {
                var modal = document.getElementById("ticket-modal");
                modal.classList.add("is-active");
                _saveCallback = saveCallback;
                _scopeUpdate = scopeUpdate;
            },
            Hide: function () {
                var modal = document.getElementById("ticket-modal");
                modal.classList.remove("is-active");
                _saveCallback = null;
                _scopeUpdate = null;
                that.TicketSearch = "";
            },
            SetTicket: function(ticket) {
                that.Ticket = JSON.parse(JSON.stringify(ticket));
            },
            Save: function() {
                var saveButton = document.getElementById("ticket-modal-save");
                saveButton.classList.add('is-loading');
                Backend.SaveTicket(that.Ticket).then(function(isOk) {
                    if (isOk === "true") {
                        saveButton.classList.remove('is-loading');
                        _saveCallback(that.Ticket);
                        that.Hide();
                    } else {
                        that.Hide();
                    }
                });
            },
            EditStartDate: function() {
                startDatePicker.show();
            },
            EditEndDate: function() {
                endDatePicker.show();
            },
            TicketSearch: ""
        };
        return that;
    }
]);