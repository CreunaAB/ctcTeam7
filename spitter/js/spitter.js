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
var twitterQuery;
var player = models.player;
var	playerImage = new views.Player();
var since = '';
var tweetList;

var addLoader = function() {
        var loaderHtml = '<div class="throbber"><div class="wheel"></div></div>';
        $('#search-results').before(loaderHtml);
};
addLoader();

var fetchTweets = function() {
	UrlRetriever.getSpotifyUrlsFromTwitter(since, twitterQuery, function(items) { 
        // Remove loading indicator
        var loader = dom.queryOne('.throbber');
        dom.destroy(loader);        
		setItemTrackUris(items);
		since = items[0].id_str;
	});
};

var showTweet = function(tweet) {
    return '<img src="' + tweet.profile_image_url + '"/> ' + 
                tweet.text + 
                '<br/>&mdash; ' + tweet.from_user_name + ' (@' + tweet.from_user + ')';
}

function init() {
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

    $("#savePlaylist").live('click',function(e){
        var myAwesomePlaylist = new models.Playlist("Spitter Tracks");
        $.each(playlist.data.all(),function(i,track){
            myAwesomePlaylist.add(track);
        });
        e.preventDefault();

    }); 

    $('#title').html('Following ' + twitterQuery + ' on Twitter');    
    
    models.player.observe(models.EVENT.CHANGE, function (e) {	
		if(e.data.curtrack == true) {
			fetchTweets();
            var track = player.track;
            $.each(tweetList, function(key, tweet) {
                if (tweet.spotifyTrackUri === track.uri) {
                    $('.twitter-tweet').html(showTweet(tweet));
                }   
            });
		}
	});

    fetchTweets();
}