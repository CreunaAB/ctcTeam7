var Twitter = {
	url: 'http://search.twitter.com/search.json',
	
	getData: function(since, hashtag, callback) {

		var self = this;

		$.ajax({
			url: self.url,
			data: {
				q: '%23' + hashtag,
				include_entities: true,
				result_type: 'mixed',
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
	expandUrl: function(tweet, callback){
		var self = this;
		$.ajax({
			url: 'http://api.longurl.org/v2/expand',
			data: {
				url: this.parse(tweet),
				format: 'json'
			},
			type: 'GET',
			dataType: 'jsonp'
		}).done(function(data) {
			tweet.spotifyurl = data['long-url'];
			callback.call(self, tweet);
		});
	},
	parse: function(obj) {
		if(!obj || !obj.entities || !obj.entities.urls) {
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
			var array = [];
			var index;
			console.log(data.results.length+' from twitter');
			for(index = 0; index < data.results.length; index++){
				UrlParser.expandUrl(data.results[index], function(tweet){ 
					array.push(tweet);
					if(array.length === data.results.length){
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
UrlRetriever.getSpotifyUrlsFromTwitter('', 'ctcTeam7', function(array){
	var wrapper = document.getElementById('wrapper');
	for(var a in array){
		var p = document.createElement("p");
		p.innerHTML = array[a].spotifyurl;
		console.log(array[a].spotifyurl);
		wrapper.appendChild(p);
	}
});
*/