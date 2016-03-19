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

var PlayerState = { Human: 1, Zombie: 2 };

var players = [];

for (var i = 0; i < 3; i++)
{
	players.push({
		id: i.toString(),
		name: 'Bob',
		location: { lat: 52.953350, lng: lng = -1.150350 },
		state: PlayerState.Human
	});
	pusher.trigger('private-bite', 'client-player-joined', { id: i.toString(), name: 'Bob' });
}

setInterval(function(){
	var maxJitter = 0.0001;

	players.forEach(function(player){
		player.location.lat += maxJitter * (Math.random() * 2 - 1);
		player.location.lng += maxJitter * (Math.random() * 2 - 1);
		pusher.trigger('private-bite', 'client-player-moved', {playerId: player.id, lat: player.location.lat, lng: player.location.lng});
	});
}, 5000);

