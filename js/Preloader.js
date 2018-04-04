var preloader = document.getElementById("preloader");

module.exports = {
    Hide: function() {
        preloader.style.display = "none";
    },
    Show: function() {
        preloader.style.display = "block";
    }
};