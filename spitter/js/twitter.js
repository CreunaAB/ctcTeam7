var numberOfResults = 0;

var Twitter = {
	url: 'http://search.twitter.com/search.json',
	
	getData: function(since, query, callback) {
		var self = this;

		$.ajax({
			url: self.url,
			data: {
				q: query +'  +open.spotify+spoti.fi',
				include_entities: true,
				result_type: 'recent',
				since_id : since
			},
			dataType: 'jsonp'
		}).done(function(data) {
			callback.call(self, data);
			//return data;
		}).fail(function(){
			callback.call(self, 'error');
			//return "error";
		});
	
	}
},

UrlParser = {
	expandUrl: function(tweet, callback) {
		var self = this;
		var parsedUrl = this.parse(tweet);
		if (parsedUrl && !parsedUrl.match(/^http:\/\/open.spotify.com/)) {
			$.ajax({
				url: 'http://api.longurl.org/v2/expand',
				data: {
					url: parsedUrl,
					format: 'json'
				},
				type: 'GET',
				dataType: 'jsonp'
			}).done(function(data) {
				tweet.spotifyurl = data['long-url'];
				tweet.spotifyType = tweet.spotifyurl.split("/").slice(-2)[0];
				tweet.spotifyId = tweet.spotifyurl.split("/").slice(-1)[0];
				tweet.spotifyTrackUri = null;
				callback.call(self, tweet);
			}).fail(function(error) {
				tweet.spotifyurl = null;
				tweet.spotifyType = null;
				tweet.spotifyId = null;
				tweet.spotifyTrackUri = null;
				callback.call(self, tweet);
			});
		} else {
			numberOfResults--;
		}
	},
	parse: function(obj) {
		if(!obj || !obj.entities || !obj.entities.urls || obj.entities.urls.length == 0) {
			console.log(obj);
			console.log("expects an object with urls");
			return "";
		}
		var url = obj.entities.urls[0].expanded_url;
		return url;	
	}
	
},

UrlRetriever = {
	getSpotifyUrlsFromTwitter: function(since, hashtag, callback){
		Twitter.getData(since, hashtag, function(data) {
			if(!data.results){
				console.log('found no resultsobject in data');
			}
			numberOfResults = data.results.length;

			var array = [];
			var index;
			console.log(data.results.length+' from twitter');
			console.log(data.results);
			for(index = 0; index < data.results.length; index++){
				UrlParser.expandUrl(data.results[index], function(tweet){ 
					array.push(tweet);
					if(array.length === numberOfResults){
						callback.call(this, array);
					}
				});
			}
		});
	}
};

/*
*@param id should be the id of the last song in the playlist, will be the since_id param in twitter API, use id_str on the twitter object, empty string for all
*@param hashtag should be the hashtag to search, example ctcTeam7, do not use other hashtags for now, we do not handle errors well
*@param a callback function that will get an array of tweets, we have added the variable spotifyurl to the twitter object
*/ 
/*Example call based on there exists a div with id wrapper 
UrlRetriever.getSpotifyUrlsFromTwitter('', 'ctcTeam7', function(items){
			var wrapper = document.getElementById('wrapper');
			for(var a in items){
				var p = document.createElement("p");
				p.innerHTML = items[a].spotifyurl;		
				console.log(items[a].spotifyType, items[a].spotifyId)
				wrapper.appendChild(p);
			}

			setItemTrackUris(items);	

		});
		*/