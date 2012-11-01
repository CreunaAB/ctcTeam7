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
var twitterQuery;

$(function() {	
	tabs();	
	application.observe(models.EVENT.ARGUMENTSCHANGED, tabs);
    
    twitterQuery = window.localStorage.getItem('twitter-query');
    if (twitterQuery) {
        $('#twitter-query').val(twitterQuery);
    } else {
        twitterQuery = 'ctcTeam7';        
    }

    $('#localStorageTest').submit(function() {
        twitterQuery = $('#twitter-query').val();
        window.localStorage.setItem('twitter-query', twitterQuery);
    });

    $("#spitter button").click(function(e){
        UrlRetriever.getSpotifyUrlsFromTwitter('', twitterQuery, function(items){         
            setItemTrackUris(items);
        });
    }); 

    $("#savePlaylist").live('click',function(e){
        var myAwesomePlaylist = new models.Playlist("Spitter Tracks");
        $.each(playlist.data.all(),function(i,track){
            myAwesomePlaylist.add(track);
        });
        e.preventDefault();
    }); 

    $('#title').html('Following ' + twitterQuery);
});