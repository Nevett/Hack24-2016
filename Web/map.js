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
}

var pusher = new Pusher('90328f0186c7537be223', {
      cluster: 'eu',
      encrypted: true,
	  authTransport: 'jsonp',
	  authEndpoint: 'http://dump.nevett.me/hack24/auth.php'
    });

var channel = pusher.subscribe('private-bite');

var markers = {};

var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';

channel.bind('player-moved', function(data) {
	var lat = data.lat;
	var lng  = data.lng;
	var marker = markers[data.playerId];
	console.log(data);
	if (!marker) {
		marker = markers[data.playerId] = new google.maps.Marker({
			map: map,
			icon: image
		});
	}
	
	marker.setPosition( new google.maps.LatLng( lat, lng ) );
});


  