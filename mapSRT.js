(function($) {

    window.mapSRT = function(map, videoURLs, srtFile, options) {
        options = options || {};
        var defaults = {
            'muted': false
        };
        var opts = $.extend(defaults, options);
        map.on('style.load', function () {
            window.videoSource = new mapboxgl.VideoSource({
                'urls': videoURLs,
                'coordinates': [
                   [-75.54335737228394, 38.18579907229748],
                   [-75.52803659439087, 38.1838364847587],
                   [-75.5295386314392, 38.17683392507606],
                   [-75.54520273208618, 38.17876344106642]
                ]
            });
            map.addSource('video', videoSource);
            map.addLayer({
                "id": "videoLayer",
                "type": "raster",
                "source": "video"
            });
            videoSource.on('change', function() {
                // $('#subtitles').srt({
                //     video: videoSource.video,
                //     showSubtitle: function(subtitle, elem) {
                //         updateLayerCoords(map, videoSource, subtitle.t);
                //     }
                // });
                var video = videoSource.video;
                video.pause();
                $.get(srtFile, {}, function(srtContents) {
                    var $srtElem = $('<div />')
                        .hide()
                        .text(srtContents)
                        .appendTo('body');
                    $srtElem.srt({
                        'interval': 100,
                        'video': video,
                        'showSubtitle': function(subtitleObj, elem) {
                            var bboxString = subtitleObj.t;
                            updateLayerCoords(map, videoSource, bboxString);
                        }
                    });
                    video.play();
                    if (opts.muted) {
                        video.muted = true;
                    }
                });
            });
        });
    };

    function updateLayerCoords(map, layer, bboxString) {
        var bbox = bboxString.split(',').map(function(s) {
            return parseFloat(s);
        });
        var polygon = turf.bboxPolygon(bbox);
        var center = turf.centroid(polygon);
        var coords = polygon.geometry.coordinates;
        var newCoords = [coords[0][2], coords[0][3], coords[0][0], coords[0][1]];
        videoSource.coordinates = newCoords;
        videoSource.createTile();
        map.setCenter(center.geometry.coordinates);
        // map.easeTo({'center': center.geometry.coordinates});
        return;
    }

})(jQuery);