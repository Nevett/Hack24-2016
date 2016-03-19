function initMap() {
	window.map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 52.953350, lng: -1.150350},
		zoom: 19,
		styles: [{
			featureType: 'poi',
			stylers: [{ visibility: 'off' }]  // Turn off points of interest.
		}, {
			featureType: 'transit.station',
			stylers: [{ visibility: 'off' }]  // Turn off bus stations, train stations, etc.
		}, {
			featureType: 'all',
			stylers: [{ invert_lightness: true},
						{saturation: 50},
						{lightness: -8},
						{weight: 3 }] 
		}],
		disableDoubleClickZoom: true
	});

	var pusher = new Pusher('90328f0186c7537be223', {
			cluster: 'eu',
			encrypted: true,
			authTransport: 'jsonp',
			authEndpoint: 'http://dump.nevett.me/hack24/auth.php'
		});

	var channel = pusher.subscribe('private-bite');

	var markers = {};
	var zones = {};

	var human = { 
		url: 'human.png', 
		size: new google.maps.Size(128, 128),
		scaledSize: new google.maps.Size(64, 64),
		anchor: new google.maps.Point(32, 32)
	};
	var zombie = { 
		url: 'zombie.png', 
		size: new google.maps.Size(128, 128),
		scaledSize: new google.maps.Size(64, 64),
		anchor: new google.maps.Point(32, 32)
	};

	channel.bind('game-update', function(data) {	
		data.players.forEach(function (player){
			var lat = player.location.lat;
			var lng  = player.location.lng;
			var marker = markers[player.id];
			console.log(player);
			if (!marker) {
				marker = markers[player.id] = new google.maps.Marker({
					map: map,
					icon: human
				});
			}
			marker.setPosition( new google.maps.LatLng( lat, lng ) );
		});

		data.zones.forEach(function (zoneData){
			var zone = zones[zoneData.id];
			if (!zone){	
				var colour = zoneData.type === "safe" ? "#00ff00" : "#0000cd";
			 	zones[zoneData.id] = new google.maps.Circle({
			      	strokeColor: colour,
			      	strokeOpacity: 0.8,
			      	strokeWeight: 2,
			      	fillColor: colour,
			      	fillOpacity: 0.15,
			      	map: map,
			      	center: zoneData.center,
			      	radius: zoneData.zoneSize
    			});
			}
		});
	});
}