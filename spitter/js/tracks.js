function searchInput(args) {	
	// args[0] = page,  args[1] = command, args[2] = value 
	// e.g. spotify:app:kitchensink:search:play:the+cure+close+to+me
	var query = unescape(args[2].replace(/\+/g, " ")); //clean up the search query
	console.log(query);
	$("#search-term").val(query);
	$("#search-"+args[1]).trigger('click');
}

var asyncCalls = [],  // Initiate for later
	tempPlaylist = new models.Playlist();

$(function(){
	$("#spitter button").click(function(e){
		UrlRetriever.getSpotifyUrlsFromTwitter('', 'ctcTeam7', function(items){			
			setItemTrackUris(items);
		});

/*
		var query = $("#search-term").val();
		var type = $(this).attr("id");
		if(query!="") {
			switch(type){
				case "search-basic":
					$("#search-results").empty();
					var search = new models.Search(query);					
					search.observe(models.EVENT.CHANGE, function() {						
						$("#search-results").append("<h2>Tracks</h2>");
						if(search.tracks.length) {
							tempPlaylist = new models.Playlist();
							$.each(search.tracks,function(index,track){
								tempPlaylist.add(models.Track.fromURI(track.uri));				// Note: artwork is compiled from first few tracks. if any are local it will fail to generate....
							});				
							var playlistArt = new views.Player();
								playlistArt.track = tempPlaylist.get(0);
								playlistArt.context = tempPlaylist;
								$("#search-results").append(playlistArt.node);
							var saveButton = "<button id='savePlaylist' class='add-playlist button icon'>Save As Playlist</button>";
								$("#search-results .sp-player").append(saveButton);
							var playlistList = new views.List(tempPlaylist);
								playlistList.node.classList.add("temporary");
								$("#search-results").append(playlistList.node);
						} else {
							$("#search-results").append('<div>No tracks in results</div>');
						}
					});
					search.appendNext();
					break;				
			}
		}*/
	});	
	$("#savePlaylist").live('click',function(e){
		var myAwesomePlaylist = new models.Playlist($("#search-term").val()+" Tracks");
		$.each(tempPlaylist.data.all(),function(i,track){
			myAwesomePlaylist.add(track);
		});
		e.preventDefault();
	});
	
});

function asyncComplete(key) {
	asyncCalls.splice(asyncCalls.indexOf(key), 1);
	if(asyncCalls.length==0) {
		console.log('All async calls home safely'); // <insert action that requires all async calls>
	} else {
		console.log(asyncCalls.length+" aysnc calls remaining");
	}
	// Obviously in production you would want a more robust solution that can handle calls that fail!
}