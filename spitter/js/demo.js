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
        }
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