### SRT + Video + Mapbox-GL

Move a video on the map by specifying bounding boxes per time-code in an SRT file.

### Usage

`index.html` and `index.js` contain simple examples of usage. If you wish to use this with your own video and SRT files:

  - Include `jquery.srt.js` and `mapSRT.js` in your HTML
  - Instantiate a Mapbox GL Map and then call `mapSRT(map, videoURLs, srtURL);` where videoURLs is an array of videos (to be able to specify multiple formats for maximum browser compatibility)

### Disclaimer

This is the result of a very quick one day hack to see if this was actually possible to do. If anyone thinks this might actually be useful / interesting, please do get in touch. There are several improvements that can probably be made.

### Demo

See it in action: http://batpad.github.io/maps-gl-srt/
