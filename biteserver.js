 /*
 app_id = 189137
key = "90328f0186c7537be223"
secret = "d1010efe67eb17475db6"
*/
 
var Pusher = require('pusher');
var PusherClient = require('pusher-client');

var pusherClient = new PusherClient('90328f0186c7537be223', {
	cluster: 'eu',
	encrypted: true,
	authEndpoint: 'http://dump.nevett.me/hack24/auth.php'
});

var pusher = new Pusher({
	appId: '189137',
	key: '90328f0186c7537be223',
	secret: 'd1010efe67eb17475db6',
	cluster: 'eu'
});

var PlayerState = { Human: 1, Zombie: 2 };

var players = [];
var playersById = {};
var zones = [];

var safeZones = [
	{
		center: {lat: 52.954187, lng: -1.149632},
		zoneSize: 50
	},
	{
		center: {lat: 52.953449, lng: -1.148950},
		zoneSize: 100
	},
	{
		center: {lat: 52.953118, lng: -1.150597},
		zoneSize: 50
	}
];

var dangerZones = [
	{
		center: {lat: 52.953412, lng: -1.149951},
		zoneSize: 500
	},
	{
		center: {lat: 52.953600, lng: -1.151644},
		zoneSize: 280
	},
	{
		center: {lat: 52.953792, lng: -1.148353},
		zoneSize: 150
	}
];

safeZones.forEach(function(zone){
	zone.type = 'safe';
	zones.push(zone);
});
dangerZones.forEach(function(zone){
	zone.type = 'danger';
	zones.push(zone);
});

var sendGameState = function(){
	pusher.trigger('private-bite', 'game-update', {
		players: players.map(function(p){ return p.getStateData(); }),
		zones: zones
	});
}
setInterval(sendGameState,10000);

var channel = pusherClient.subscribe('private-bite');
channel.bind('client-player-moved', function(player){
	if (!playersById[player.playerId]) return;
	
	playersById[player.playerId].updateLocation(player.lng, player.lat);
});

channel.bind('client-player-joined', function(playerData){
	var player = new Player(playerData.id, playerData.name);
	playersById[player.id] = player;
	players.push(player);
	console.log(player.name + ' joined.')
});

function Player(id, name)
{
	this.state = PlayerState.Human;
	this.location = { lng: 0, lat: 0 };
	this.name = name;
	this.id = id;
	var me = this;
	this.updateLocation = function(lng, lat)
	{
		this.location.lng = lng;
		this.location.lat = lat;
	};
	this.getStateData = function() {
		return { 
			id: this.id,
			name: this.name,
			state: this.state,
			location: this.location
		};
	};
}
