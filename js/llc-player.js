/*
 ### jQuery XML to JSON Plugin v1.0 - 2008-07-01 ###
 * minified with google closure compiler 
 * Website: http://www.fyneworks.com/jquery/xml-to-json/
*/
window.jQuery&&function(f){f.extend({xml2json:function(a,j){function g(e,a){if(!e)return null;var c="",b=null;k(e.localName||e.nodeName);e.childNodes&&e.childNodes.length>0&&f.each(e.childNodes,function(e,a){var l=a.nodeType,d=k(a.localName||a.nodeName),f=a.text||a.nodeValue||"";if(l!=8)l==3||l==4||!d?f.match(/^\s+$/)||(c+=f.replace(/^\s+/,"").replace(/\s+$/,"")):(b=b||{},b[d]?(b[d].length||(b[d]=i(b[d])),b[d]=i(b[d]),b[d][b[d].length]=g(a,true),b[d].length=b[d].length):b[d]=g(a))});e.attributes&&
e.attributes.length>0&&(b=b||{},f.each(e.attributes,function(a,e){var c=k(e.name),d=e.value;b[c]?(b[cnn]=i(b[cnn]),b[c][b[c].length]=d,b[c].length=b[c].length):b[c]=d}));if(b){b=f.extend(c!=""?new String(c):{},b||{});if(c=b.text?(typeof b.text=="object"?b.text:[b.text||""]).concat([c]):c)b.text=c;c=""}var h=b||c;if(j){c&&(h={});if(c=h.text||c||"")h.text=c;a||(h=i(h))}return h}if(!a)return{};var k=function(a){return String(a||"").replace(/-/g,"_")},i=function(a){f.isArray(a)||(a=[a]);a.length=a.length;
return a};typeof a=="string"&&(a=f.text2xml(a));if(a.nodeType){if(a.nodeType==3||a.nodeType==4)return a.nodeValue;var m=a.nodeType==9?a.documentElement:a,n=g(m,true),m=a=null;return n}},text2xml:function(a){var j;try{var g=f.browser.msie?new ActiveXObject("Microsoft.XMLDOM"):new DOMParser;g.async=false}catch(k){throw Error("XML Parser could not be instantiated");}try{j=f.browser.msie?g.loadXML(a)?g:false:g.parseFromString(a,"text/xml")}catch(i){throw Error("Error parsing XML string");}return j}})}(jQuery);


/*
 ### LLC Player v1.0
 * Dependancies: jQuery v1.6.4?, xml2json v1.0(included), jPlayer v2.1.0
 * Authors: MultiView Team + B>
*/
var llc = {
	setupSlides: function(slides) { /* Create slides --> set video or audio slides --> set markup & link */
		console.log('setSlides');
		// Add Slide to slideshow markup
		// If Video
			// Set Video Markup
			// Initialize Video jPlayer Instance
		
		// Setup Slides
		$(slides).each(function(i){
		  	
		  	var t=this;
		  	
		  	// Add to TOC			Need to sent event handler, iPad requires 2 clicks... 
		  	if (t.inTOC=="True") $('<td class="thumb">\
							  	     <a id="thumb_'+t.id+'" href="#" onclick="javascript:$(\'#jquery_jplayer_1\').jPlayer(\'pauseOthers\').jPlayer(\'play\','+(t.startPoint/1000)+');">\
							  		   <img src="'+(t.poster || t.file.text)+'" />\
							  	     </a>\
							  	   </td>').appendTo("#toc table tr");
		  	
		  	// Add to Slides
		  	if (t.fileType == "jpg"){ // jpg slide
		  		
		  		// Add image to Slides and loader
		  		$('<a id="'+t.id+'" class="slide" href="'+t.link+'"><img src="'+t.file.text+'" /></a>').appendTo("#slides");
		  		$("#"+t.id+" img").load(function(){
		  			llc.pres.imgsLoaded++;
		  		});
		  		llc.pres.imgsCount++;
		  			  
		  	} else if (t.fileType != "jpg") { // video slide
		  		
		  		// Add video markup to Slides
		  		$('<div id="'+t.id+'" class="jp-video slide">\
		  			<div class="jp-type-single">\
		  				<div id="jquery_jplayer_'+t.id+'" class="jp-jplayer"></div>\
		  				<div class="jp-gui">\
		  					<div class="jp-video-play">\
		  						<a href="javascript:;" class="jp-video-play-icon" tabindex="1">play</a>\
		  					</div>\
		  					<div class="jp-interface">\
		  						<div class="jp-progress">\
		  							<div class="jp-seek-bar">\
		  								<div class="jp-play-bar"></div>\
		  							</div>\
		  						</div>\
		  						<div class="jp-current-time"></div>\
		  						<div class="jp-duration"></div>\
		  						<div class="jp-controls-holder">\
		  							<ul class="jp-controls">\
		  								<li><a href="javascript:;" class="jp-play" tabindex="1">play</a></li>\
		  								<li><a href="javascript:;" class="jp-pause" tabindex="1">pause</a></li>\
		  								<li><a href="javascript:;" class="jp-stop" tabindex="1">stop</a></li>\
		  								<li><a href="javascript:;" class="jp-mute" tabindex="1" title="mute">mute</a></li>\
		  								<li><a href="javascript:;" class="jp-unmute" tabindex="1" title="unmute">unmute</a></li>\
		  								<li><a href="javascript:;" class="jp-volume-max" tabindex="1" title="max volume">max volume</a></li>\
		  							</ul>\
		  							<div class="jp-volume-bar">\
		  								<div class="jp-volume-bar-value"></div>\
		  							</div>\
		  							<ul class="jp-toggles">\
		  								<li><a href="javascript:;" class="jp-full-screen" tabindex="1" title="full screen">full screen</a></li>\
		  								<li><a href="javascript:;" class="jp-restore-screen" tabindex="1" title="restore screen">restore screen</a></li>\
		  								<li><a href="javascript:;" class="jp-repeat" tabindex="1" title="repeat">repeat</a></li>\
		  								<li><a href="javascript:;" class="jp-repeat-off" tabindex="1" title="repeat off">repeat off</a></li>\
		  							</ul>\
		  						</div>\
		  						<div class="jp-title">\
		  						  '+t.title+'\
		  						</div>\
		  					</div>\
		  				</div>\
		  				<div class="jp-no-solution">\
		  					<span>Update Required</span>\
		  					To play the media you will need to either update your browser to a recent version or update your <a href="http://get.adobe.com/flashplayer/" target="_blank">Flash plugin</a>.\
		  				</div>\
		  			</div>\
		  		</div>').appendTo("#slides");
		  		
				// Initialize jPlayer video instance
				$("#jquery_jplayer_"+t.id).jPlayer({  
					ready: function () {
						$(this).jPlayer("setMedia", { // !!!Need to make video formats variable!!!
							m4v: "http://www.jplayer.org/video/m4v/Big_Buck_Bunny_Trailer.m4v",
							ogv: "http://www.jplayer.org/video/ogv/Big_Buck_Bunny_Trailer.ogv",
							webmv: "http://www.jplayer.org/video/webm/Big_Buck_Bunny_Trailer.webm", 
							poster: t.poster
						});
					},
					play: function() { // To avoid both jPlayers playing together
						$(this).jPlayer("pauseOthers");
					},
					ended: function() { // Trigger master player to start again
					    var timeNow = (t.startPoint/1000)+$(this).data("jPlayer").status.duration;
					    $("#jp_container_1").slideDown(300, function(){
					    	$("#jquery_jplayer_1").jPlayer("play",timeNow-.3); // Slightly pad playhead or Safari goes bonkers?
					    });   
					},
					swfPath: "js",
					supplied: "webmv, ogv, m4v", // Here too 
					cssSelectorAncestor: "#"+t.id,
					loop: false,
					size: {
						width: "640px",
						height: "360px",
						cssClass: "jp-video-360p"
					}
				}); 
		  	}
		});
		
	},
	addToTOC: function(el) { /* Add to Table of contents (needs to work for slide and bookmark) */
		console.log('addToTOC');
		// Add Slide thumb to TOC markup
		// if Bookmark
			// Set Bookmark CSS Class to Markup
	},
	timeUpdate: function(event) { /* Mapped to the Timeupdate function of jPlayer (sets current slide) */
		console.log('timeUpdate');
		// update slide
		// updateTOC()
		// updateTranscript()
		// ?switchView()?
		// Slide to show, initially first item
		var timeNow = event.jPlayer.status.currentTime,
			curEl = llc.pres.curEl || llc.pres.media.items.item[0];
			llc.pres.curEl = llc.pres.curEl || null;
		
		// Determine Slide closest to play head	but not before current Time
		for (i in llc.pres.media.items.item) {
			var startPoint = llc.pres.media.items.item[i].startPoint/1000;
			curEl = startPoint-timeNow <= 0 && Math.abs(startPoint-timeNow) >= Math.abs(startPoint-timeNow) ? llc.pres.media.items.item[i] : curEl ;
		}
		
		// Should we do anything?
		if (llc.pres.curEl != curEl ) {
			
			// Set global curEl
			llc.pres.curEl = curEl;
			
			// Show/Hide slides
			$("#"+curEl.id).show();
			$("#"+curEl.id+".jp-video").width('100%').height('100%')
			$("#slides .jp-video").not("#"+curEl.id).width(0).height(0); // 0 out the jPlayer as hiding disables the flash instance
			$("#slides .slide").not("#"+curEl.id+", .jp-video").hide();
			
			// Play/Pause video slide
			if (curEl.fileType=="video") { 
				$("#master_jplayer").jPlayer("pause");
				$("#jp_container_1").slideUp(300);
				$("#jquery_jplayer_"+curEl.id).jPlayer("play",timeNow-(curEl.startPoint/1000));
			} else if (curEl.fileType=="jpg") { 
				$("#jp_container_1 div.jp-title").text(curEl.title);
				$("#jp_container_1").slideDown(0);
			}
			
			// Move TOC cur
			$("#toc td.thumb a.active").removeClass('active');
			$("#thumb_"+curEl.id).addClass('active');
		}
	},
	updateTOC: function() { /* Move to current TOC item  */
		console.log('updateTOC');
		// Highlight
		// Scroll/Move to
	},
	updateTranscript: function() { /* Move to current Transcript blurb */
		console.log('updateTranscript');
		// Highlight
		// Scroll/Move to 
	},
	switchView: function(view) { /* Change view (single, dual, full) for player presentation (mobile will include [notes, transcript, slides, video]) */
		console.log('switchView');
		// Use Switch case for differnt views for desktop and mobile
	},
	addBookmark: function(item) { /* Set bookmark in TOC and postback to server */
		console.log('addBookmark');
		// AddToTOC()
		// updateTOC()
	},
	setRating: function(num) { /* Set bookmark in TOC and postback to server */
		console.log('setRating');
		// Update Markup
		// postback to server
	},
	saveNote: function() { /* Set Note and postback to server ?does the note correspond to the playhead and if so do we treat it like a bookmark? */
		console.log('setNote');
		// postback to server
	},
	setCookie: function(data) { /* Set playback cookie (old player = 1 min interval)  ?Do we need to extend for other info besides playback? */
		console.log('setCookie');
		// if local storage (HTML5)
			// Added Playhead progress
		// else cookie 
			// Added Playhead progress
	},
	getCookie: function() { /* Get playback cookie */
		console.log('getCookie');
		// if local storage
			// return playhead que 
		// else cookie
			// return playhead que 
	},
	int: (function() { /* auto serialize xml and call functions, assumes llc-player.js is called after markup */
		$.get('presentation.xml', function(xml){ // Get XML ?is there always a common file name 'presentation.xml' or should that be a parameter?
			console.log('xml loaded');
			llc.pres = $.xml2json(xml); // Serialize XML and set llc.pres object
			console.log(llc.pres);
				/*
				  CURRENT IMPORTANT VARIABLES:
				  pres.media.master.item.fileType = "mp3, ?video?" // this will determine if video or audio sync 
				  pres.defaultInterface // Default screen mode
				  pres.agreements // should we load the agreement?
				  
				  NEEDED VARIABLES IN XML
				  pres.version // Variable to determine new or old player
				  pres.media.items.item[i].{poster} // link for default or fallback image of video
				  
				*/
				
			/* Set int functions here */
			if (llc.pres.legacy) {
				
				// load legacy
				
			} else {
				
				// images loaded vars
				llc.pres.imgsLoaded=0;
				llc.pres.imgsCount=0;
				
				// Setup slides
				llc.setupSlides(llc.pres.media.items.item);
				
				// Slide Loading Status
				function loading() {
					if (llc.pres.imgsLoaded < llc.pres.imgsCount) {
						$("#loading").text("loading slide "+llc.pres.imgsLoaded+" / "+llc.pres.imgsCount);
					} else {
						window.clearInterval("loader");
						$("#loading").remove();
					}
				}
				
				window.loader = window.setInterval(loading, 100);
				window.setTimeout(function() {window.clearInterval("loader");$("#loading").remove();}, 30000); // loader fail safe 30 sec
				
				// Initialize Master jPlayer
				$("#master_jplayer").jPlayer({
					ready: function (event) {
				    	$.jPlayer.timeFormat.showHour = true; // set show hours
				    	var media = new Object();
				    		media[llc.pres.media.master.item.fileType] = llc.pres.media.master.item.file.text;
				    	$(this).jPlayer("setMedia", media);
				    },
				    play: function() { // To avoid both jPlayers playing together.
				    	$(this).jPlayer("pauseOthers");
				    },
				    timeupdate: function (event) { // Set/Show Current time/Slide function
				    	llc.timeUpdate(event);   	
				    },
				    swfPath: "js",
				    supplied: llc.pres.media.master.item.fileType, // Assumes mp3 or native jPlayer video format
				    cssSelectorAncestor: "#master_jp_container",
				    wmode: "window"
				}); // end jPlayer intialize
			}
		}); // end ajax XML call
	})()
} 