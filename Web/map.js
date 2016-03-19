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

	channel.bind('client-player-moved', function(data) {
		var lat = data.lat;
		var lng  = data.lng;
		var marker = markers[data.playerId];
		console.log(data);
		if (!marker) {
			marker = markers[data.playerId] = new google.maps.Marker({
				map: map,
				icon: human
			});
		}
		
		marker.setPosition( new google.maps.LatLng( lat, lng ) );
	});

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
    // Add the circle for this city to the map.
    var cityCircle = new google.maps.Circle({
      strokeColor: '#00ff00',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#00ff00',
      fillOpacity: 0.15,
      map: map,
      center: zone.center,
      radius: Math.sqrt(zone.zoneSize) 
    });
  });

dangerZones.forEach(function(zone){
    // Add the circle for this city to the map.
    var cityCircle = new google.maps.Circle({
      strokeColor: '#ff0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#ff0000',
      fillOpacity: 0.15,
      map: map,
      center: zone.center,
      radius: Math.sqrt(zone.zoneSize) 
    });
  }); 

}