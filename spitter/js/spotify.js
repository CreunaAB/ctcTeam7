var items = [{ type: "album", id: "3YKXudPJBFnXasdKKWG7CR", trackUri: null }, { type: "track", id: "4OIpjzeBmVHK0wWYqR8b5a", trackUri: null }];

var albumCallbackCounter = 0;

function setItemTrackUris() {	
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
			models.Album.fromURI('spotify:album:' + item.id, function (album) {
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

	playlist = new models.Playlist();
	player = new views.Player();

	for (var i = 0; i < items.length; ++i) {
		playlist.add(items[i].trackUri);
	}

	var list = new views.List(playlist, function (track) {
		return new views.Track(track, views.Track.FIELD.STAR | views.Track.FIELD.POPULARTIY | 
			views.Track.FIELD.ARTIST | views.Track.FIELD.NAME | views.Track.FIELD.DURATION);
	});

	player.context = playlist;

	$('.app').append(playerHolder);

	playerHolder.append(player.node);

	playerHolder.append(list.node);
			console.log(playerHolder);
}