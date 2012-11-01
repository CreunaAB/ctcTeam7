//var items = [{ type: "album", id: "3YKXudPJBFnXasdKKWG7CR", trackUri: null }, { type: "track", id: "4OIpjzeBmVHK0wWYqR8b5a", trackUri: null }];

var albumCallbackCounter = 0;

function setItemTrackUris(items) {	
	var albumCounter = 0;

	for (var i = 0; i < items.length; ++i) {
		var item = items[i];
		if (item.spotifyType == "track") {
			items[i].spotifyTrackUri = "spotify:track:" + item.spotifyId;
		} else {
			albumCounter++;
		}
	}

	if (albumCounter == 0) {
		updateUI(items);
	}

	for (var i = 0; i < items.length; ++i) {
		var item = items[i];
		if (item.spotifyType == "album") {
			models.Album.fromURI('spotify:album:' + item.spotifyId, function (album) {
				var itemIndex = findItemIndex(album.uri, items);
				items[itemIndex].spotifyTrackUri = album.get(0).uri;
				albumCounter--;
				if (albumCounter == 0) {
					updateUI(items);
				}
			});
		}
	}					
}

function findItemIndex(albumUri, items) {
	for (var i = 0; i < items.length; i++) {
		if (items[i].spotifyTrackUri == null) {
			if ('spotify:album:' + items[i].spotifyId == albumUri) {
				return i;
			}
		}
	}

	return 0;
}

var playlist = new models.Playlist();

function updateUI(items) {
	$("#search-results").html('');
		
	for (var i = 0; i < items.length; ++i) {
		playlist.add(items[i].spotifyTrackUri);
	}

	/*var list = new views.List(playlist, function (track) {
		return new views.Track(track, views.Track.FIELD.STAR | views.Track.FIELD.POPULARTIY | 
			views.Track.FIELD.ARTIST | views.Track.FIELD.NAME | views.Track.FIELD.DURATION);
	});*/

	var player = null;
	player = new views.Player();
	player.track = playlist.get(0);
	player.context = playlist;
	$("#search-results").append(player.node);				
	
	var saveButton = "<button id='savePlaylist' class='add-playlist button icon'>Save As Playlist</button>";
	$("#search-results .sp-player").append(saveButton);

	var playlistList = new views.List(playlist);
	playlistList.node.classList.add("temporary");
	$("#search-results").append(playlistList.node);		
}