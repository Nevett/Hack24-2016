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
		zoneSize: 30
	},
	{
		center: {lat: 52.953449, lng: -1.148950},
		zoneSize: 50
	},
	{
		center: {lat: 52.953118, lng: -1.150597},
		zoneSize: 30
	}
];

var powerUpZones = [
	{
		center: {lat: 52.953412, lng: -1.149951},
		zoneSize: 30
	},
	{
		center: {lat: 52.953600, lng: -1.151644},
		zoneSize: 50
	},
	{
		center: {lat: 52.953792, lng: -1.148353},
		zoneSize: 30
	}
];
var zoneId = 0;
safeZones.forEach(function(zone){
	zone.type = 'safe';
	zone.id = zoneId++;
	zones.push(zone);
});
powerUpZones.forEach(function(zone){
	zone.type = 'powerup';
	zone.id = zoneId++;
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

channel.bind('client-used-powerup', function(data){
	if (!playersById[data.playerId]) return;
	
	playersById[player.playerId].usePowerup();
});

channel.bind('client-infected', function(data){
	if (!playersById[player.playerId]) return;
	if (!playersById[player.zombieId]) return;
	
	playersById[player.playerId].state = PlayerState.Zombie;
	playersById[player.playerId].infections++;
});

function isPointWithin(checkPoint, centerPoint, m) {
	var ky = 40000 / 360;
	var kx = Math.cos(Math.PI * centerPoint.lat / 180.0) * ky;
	var dx = Math.abs(centerPoint.lng - checkPoint.lng) * kx;
	var dy = Math.abs(centerPoint.lat - checkPoint.lat) * ky;
	return Math.sqrt(dx * dx + dy * dy) <= m * 1000;
}

function getPlayersInRadius(lat, lng, radius)
{
	var matches = [];
	players.forEach(function(player){
		if (isPointWithin(player.location, { lat: lat, lng: lng }, radius))
			matches.push(player);
	});
	return matches;
}

function getZonesPlayerIn(player)
{
	var matches = [];
	zones.forEach(function(zone){
		if (isPointWithin(zone.center, player.location, zone.radius))
			matches.push(zone);
	});
	return matches;
}

function Player(id, name)
{
	this.state = PlayerState.Human;
	this.location = { lng: 0, lat: 0 };
	this.name = name;
	this.id = id;
	var me = this;
	this.infections = 0;
	this.updateLocation = function(lng, lat)
	{
		var me = this;
		this.location.lng = lng;
		this.location.lat = lat;
		
		var inZones = getZonesPlayerIn(this);
		this.safe = false;
		if (inZones.length) {
			inZones.forEach(function(zone) {
				if (zone.type == 'safe')
					me.safe = true;
				else if (zone.type == 'powerup') {
					if (me.state == PlayerState.Human) {
						me.powerUp = 'shield';
					} else {
						me.powerUp = 'bomb';
					}
				}
			});
		}
	};
	this.getStateData = function() {
		return { 
			id: this.id,
			name: this.name,
			state: this.state,
			location: this.location,
			infections: this.infections
		};
	};
}

function Zone(id, type){
	
}
