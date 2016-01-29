(function() {
    'use strict';
    mapboxgl.accessToken = 'pk.eyJ1Ijoic2FuamF5YiIsImEiOiJjaWcwcHc1dGIwZXBudHJrd2t5YjI3Z3VyIn0.j_6dWw8HvH5RtZrMBqbP1Q';
    window.map = new mapboxgl.Map({
        container: 'map', // container id
        style: 'mapbox://styles/mapbox/streets-v8', //stylesheet location
        center: [77.61776, 12.99873],
        zoom: 18 // starting zoom
    });

    mapSRT(map, ['https://video500.pad.ma/HWD/240p1.webm'], 'test.srt', {
        'muted': true
    });

})();


