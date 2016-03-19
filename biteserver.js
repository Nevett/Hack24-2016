 /*
 app_id = 189137
key = "90328f0186c7537be223"
secret = "d1010efe67eb17475db6"
*/
 
var Pusher = require('pusher');

var pusher = new Pusher({
  appId: '189137',
  key: '90328f0186c7537be223',
  secret: 'd1010efe67eb17475db6',
  cluster: 'eu'
});

setInterval(function(){
	var maxJitter = 0.002;
	var lat = 52.953350;
	var lng = -1.150350;
	lat = lat + maxJitter * (Math.random() * 2 - 1);
	lng = lng + maxJitter * (Math.random() * 2 - 1);
	pusher.trigger('bite', 'player-moved', {playerId: 1, lat: lat, lng: lng});
	console.log({playerId: 1, lat: lat, lng: lng});
}, 1000);