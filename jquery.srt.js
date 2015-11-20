/*
 * jQuery srt
 *
 * version 0.1 (November 28, 2008)
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */
/*
  usage:
    html:
    <video src="example.ogg" id="examplevideo" />
    <div class="srt" data-video="examplevideo" data-srt="example.srt"></div>

    js:
    $(document).ready(function() { $('.srt').srt(); });


  in the above example, jquery.srt.js will try to load subtitles in all elements with 'srt' class.
  'data-video' atribute is used to link to the related video,
  if no data-srt is provided, the contents of the div is parsed as srt.
*/

(function($) {
  function toSeconds(t) {
    var s = 0.0
    if(t) {
      var p = t.split(':');
      for(i=0;i<p.length;i++)
        s = s * 60 + parseFloat(p[i].replace(',', '.'))
    }
    return s;
  }

  function strip(s) {
    return s.replace(/^\s+|\s+$/g,"");
  }

  function playSubtitles(subtitleElement, opts) {
    var n,i,o,t;
    var videoElem = opts.video;
    // var videoId = opts.id;
    var srt = subtitleElement.text();
    subtitleElement.html('');
    srt = srt.replace('\r\n|\r|\n', '\n');
    
    var subtitles = {};
    srt = strip(srt);
    var srt_ = srt.split('\n\n');
    for(var s in srt_) {
      if (srt_.hasOwnProperty(s)) {
        st = srt_[s].split('\n');
        if(st.length >=2) {
          n = st[0];
          i = strip(st[1].split(' --> ')[0]);
          o = strip(st[1].split(' --> ')[1]);
          t = st[2];
          if(st.length > 2) {
            for(j=3; j<st.length;j++)
              t += '\n'+st[j];
          }
          is = toSeconds(i) === 0 ? 0.1 : toSeconds(i);
          os = toSeconds(o);
          subtitles[is] = {i:i, o: o, t: t};
        }
      }
    }
    opts.subtitlesLoaded(subtitles);
    var currentSubtitle = -1;

    var ival = setInterval(function() {
      var currentTime = videoElem.currentTime;
      var subtitle = -1;
      for(var s in subtitles) {
        if (subtitles.hasOwnProperty(s)) {
          if(s > currentTime)
            break;
          subtitle = s;
        }
      }
      if(subtitle > 0) {
        if(subtitle != currentSubtitle) {
          opts.showSubtitle(subtitles[subtitle], subtitleElement);
          currentSubtitle=subtitle;
        } else if(subtitles[subtitle].o < currentTime) {
          opts.hideSubtitle(subtitleElement);
        }
      }
    }, opts.interval);
  }

//default function to show subtitle
  function showSubtitle(sub, elem) {
    elem.html(sub.t);
  }

//default function to hide subtitle
  function hideSubtitle(elem) {
    elem.html('');
  }

  jQuery.fn.srt = function(o) {
    var that = this;
    var opts = $.extend({
      'interval': 100,
      'video': null,
      // 'id': that.attr('data-video'),
      'url': that.attr('data-srt'),
      'showSubtitle': showSubtitle,
      'hideSubtitle': hideSubtitle,
      'subtitlesLoaded': $.noop
      }, o);
    this.each(function() {
      var subtitleElement = $(this);
      var videoElem = opts.video;
      // if(!videoId) return;
      var srtUrl = opts.url;
      if(srtUrl) {
        $(this).load(srtUrl, function (responseText, textStatus, req) { playSubtitles(subtitleElement, opts); });
      } else {
        playSubtitles(subtitleElement, opts);
      }
    });
  };
})(jQuery);

