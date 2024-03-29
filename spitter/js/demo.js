function tabs() {
    var args = models.application.arguments;
    var current = document.getElementById(args[0]);
    var sections = document.getElementsByClassName('section');
    for (i=0;i<sections.length;i++){
        sections[i].style.display = 'none';
    }
    current.style.display = 'block';
}

var sp = getSpotifyApi(1);
var models = sp.require('sp://import/scripts/api/models');
var views = sp.require('sp://import/scripts/api/views');
var dom = sp.require('sp://import/scripts/dom');
var ui = sp.require("sp://import/scripts/ui");
var application = models.application;
var	playerImage = new views.Player();	

$(function() {	
	tabs();	
	application.observe(models.EVENT.ARGUMENTSCHANGED, tabs);
    
    if (window.localStorage.getItem("name")) {
        $('#twitter-query').val(window.localStorage.getItem("twitter-query"));
    }

    $('.stored').keyup(function () {
        window.localStorage.setItem($(this).attr('name'), $(this).val());
    });

    $('#localStorageTest').submit(function() {
        window.localStorage.setItem('timestamp', (new Date()).getTime());
    });
});