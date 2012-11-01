/*  
 *  Declare standard objects for the API (model/view)
 */
var sp = getSpotifyApi(1);
var m = sp.require('sp://import/scripts/api/models');
var v = sp.require('sp://import/scripts/api/views');
var dom = sp.require('sp://import/scripts/dom');

var API_KEY = "change_me"; // Personal key obtained from Last.FM
var API_REQ = "http://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&format=json&api_key=" + API_KEY;

var application = (function() {	
	/* Initialize app on body.onload */
	init = function() {
		addLoader();
		fetchLastFMData();

		
	},
	addLoader = function() {
		var loaderHtml = '<div class="throbber"><div class="wheel"></div></div>';
		$('.app').before(loaderHtml);
	}
})();



function searchTwitter(query) {
    $.ajax({
        url: 'http://search.twitter.com/search.json?' + jQuery.param(query),
        dataType: 'jsonp',
        success: function(data) {
            var tweets = $('#tweets');
            tweets.html('');
            for (res in data['results']) {
                tweets.append('<div>' + data['results'][res]['from_user'] + ' wrote: <p>' + data['results'][res]['text'] + '</p></div><br />');
            }

            setItemTrackUris(tweets);
        }
    });
}

var items = [{ type: "album", id: "3YKXudPJBFnXasdKKWG7CR", trackUri: null }, { type: "track", id: "4OIpjzeBmVHK0wWYqR8b5a", trackUri: null }];

var albumCallbackCounter = 0;

function setItemTrackUris(tweets) {
	
	var albumCounter = 0;

	for (var i = 0; i < items.length; ++i) {
		var item = items[i];
		if (item.type == "track") {
			items[i].trackUri = "spotify:track:" + item.id;
		} else {
			albumCounter++;
		}
	}

	for (var i = 0; i < items.length; ++i) {
		var item = items[i];
		if (item.type == "album") {
			m.Album.fromURI('spotify:album:' + item.id, function (album) {
				var itemIndex = findItemIndex(album.uri);
				items[itemIndex].trackUri = album.get(0).uri;
				albumCounter--;
				if (albumCounter == 0) {
					updateUI();
				}
			});
		}
	}
}

function findItemIndex(albumUri) {
	for (var i = 0; i < items.length; i++) {
		if (items[i].trackUri == null) {
			if ('spotify:album:' + items[i].id == albumUri) {
				return i;
			}
		}
	}

	return 0;
}

function updateUI() {
	$('.app').html('');

	var player = null;
	var playlist = null;
	
	var playerHolder = $(document.createElement('div'));
	playerHolder.addClass('player');

	playlist = new m.Playlist();
	player = new v.Player();

	for (var i = 0; i < items.length; ++i) {
		playlist.add(items[i].trackUri);
	}

	var list = new v.List(playlist, function (track) {
		return new v.Track(track, v.Track.FIELD.STAR | v.Track.FIELD.POPULARTIY | v.Track.FIELD.ARTIST | v.Track.FIELD.NAME | v.Track.FIELD.DURATION);
	});

	player.context = playlist;

	$('.app').append(playerHolder);

	playerHolder.append(player.node);

	playerHolder.append(list.node);
}

function getFirstTrackFromAlbum(albumId) {
	m.Album.fromURI('spotify:album:' + albumId, function (album) {
		return album.get(0);
	});
}

function getTrack(trackId) {
	m.Album.fromURI('spotify:track:' + trackId, function (album) {
		return album.get(0);
	});
}

$(document).ready(function() {
    $('#submit').click(function() {
        var params = {
            q: $('#query').val(),
            rpp: 5
        };
        // alert(jQuery.param(params));
        searchTwitter(params);
    });
});