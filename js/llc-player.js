/*

NICK WAS HERE

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
	setupItems: function(slides, bookmarks, blurbs, notes) { /* Create slides --> set video or audio slides --> set markup & link */
		console.log('setSlides');
		
		/* ##########################################
		  ################# Create Slides
		 ########################################## */
		$(slides).each(function(i){ 
		  	
		  	var t=this;
		  	
		  	// Add thumbnail to TOC			
		  	if (t.inTOC=="True") llc.addToTOC((t.poster || t.file.text),t.id,t.startPoint);
		  	
			if (t.fileType == "jpg"){ 		
			  		  		
		  		/* ######## JPG SLIDE #################### */
		  		
		  		// Append Slide
		  		$('<a id="'+t.id+'" class="slide" href="'+t.link+'"><img src="'+t.file.text+'" /></a>').appendTo("#slides");
		  		
		  		// Set Slide Load Interation
		  		$("#"+t.id+" img").load(function(){
		  			llc.pres.imgsLoaded++;
		  		});	llc.pres.imgsCount++;
		  	
		  			  
		  	} else if (t.fileType != "jpg") { // Need standard video flag in xml?
		  		
		  		/* ######## VIDEO SLIDE ################## */
		  		
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
		  		
				/* ####### Initialize video instance ##### */
				
				// Video File Types
				var videoTypes = { files: { poster:t.poster } }
				for (i in t.file) { 
					videoTypes.supplied = videoTypes.supplied ? videoTypes.supplied+','+t.file[i].type : t.file[i].type ;
					videoTypes.files[t.file[i].type] = t.file[i].text;
					console.log(t.file[i]);
				}
				console.log(videoTypes); 
				
				// Load Video Jplayer
				$("#jquery_jplayer_"+t.id).jPlayer({  
					ready: function () {
						$(this).jPlayer("setMedia", videoTypes.files);
					},
					play: function() { // To avoid both jPlayers playing together
						$(this).jPlayer("pauseOthers");
					},
					ended: function() { // Trigger master player to start again
					    var timeNow = (t.startPoint/1000)+$(this).data("jPlayer").status.duration;
					    $("#master_jp_container").slideDown(300, function(){
					    	$("#master_jplayer").jPlayer("play",timeNow-.3); // Slightly pad playhead or Safari goes bonkers?
					    });   
					},
					swfPath: "js",
					supplied: videoTypes.supplied, 
					cssSelectorAncestor: "#"+t.id,
					loop: false,
					size: {							// Need variable size~!
						width: "640px",
						height: "360px",
						cssClass: "jp-video-360p"
					}
				}); 
		  	}
		});
		
		/* ##########################################
		  ################# Create Bookmarks
		 ########################################## */
		 
		$(bookmarks).each(function(i){ 
			var t=this;
		});
		
		/* ##########################################
		  ################# Create Blurbs
		 ########################################## */
		 
		$(blurbs).each(function(i){ 
			$('<p id="s'+this.startPoint+'">'+this.text.toString()+'</p>').appendTo("#tabs_transcripts")
		});
		
		/* ##########################################
		  ################# Create Notes
		 ########################################## */
		 
		$("#tab_notes").text(notes);
	},
	addToTOC: function(img,id,startPoint) { /* Add to Table of contents (needs to work for slide and bookmark) */
		console.log('addToTOC');
			
		/* ##########################################
		  ################# Add thumbnail to TOC
		 ########################################## */
		 
		$('<td class="thumb" id="thumb_'+id+'">\
			<a href="#" onclick="javascript:$(\'#master_jplayer\').jPlayer(\'pauseOthers\').jPlayer(\'play\','+((startPoint/1000)+.3)+');">\
			  <img src="'+img+'" />\
			</a>\
		</td>').appendTo("#toc table tr");
	},
	timeUpdate: function(event) { /* Mapped to the Timeupdate function of jPlayer (sets current slide) */
		console.log('timeUpdate');
		
		/* ##########################################
		  ################# Time Update Functions
		 ########################################## */
		
		var timeNow = event.jPlayer.status.currentTime,
			curEl = llc.pres.curEl || llc.pres.media.items.item[0],
			curBlurb = llc.pres.curBlurb || llc.pres.transcript.blurb[0];
			llc.pres.curEl = llc.pres.curEl || null;
			llc.pres.curBlurb = llc.pres.curBlurb || null;
		
		// Determine Slide closest to play head	but not before current Time
		for (i in llc.pres.media.items.item) {
			var startPoint = llc.pres.media.items.item[i].startPoint/1000;
			curEl = startPoint-timeNow <= 0 ? llc.pres.media.items.item[i] : curEl ;
		}
		
		// Determine Blurb closest to play head	but not before current Time
		for (i in llc.pres.transcript.blurb) {
			var startPoint = llc.pres.transcript.blurb[i].startPoint/1000;
			curBlurb = startPoint-timeNow <= 0 ? llc.pres.transcript.blurb[i] : curBlurb ;
		}
		
		// Should we do anything with slides?
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
				$("#master_jp_container").slideUp(300);
				$("#jquery_jplayer_"+curEl.id).jPlayer("play",timeNow-(curEl.startPoint/1000));
			} else if (curEl.fileType=="jpg") { 
				$("#master_jp_container div.jp-title").text(curEl.title);
				$("#master_jp_container").slideDown(0);
			}
			
			// update TOC and scroll to current thumb
			$("#toc td.thumb a.active").removeClass('active');
			$("#thumb_"+curEl.id+" a").addClass('active');			
			var pos = document.getElementById("thumb_"+curEl.id).offsetLeft;
				pos += ($("#toc td.thumb").eq(0).width()/2) - ($("#toc").width()/2);
			$("#toc").animate({scrollLeft: pos}, 300);
			
		}
		
		// Should we do anything with Blurbs?
		if (llc.pres.curBlurb != curBlurb ) {
			
			// Set global curBlurb
			llc.pres.curBlurb = curBlurb;
			
			// update Transcript to current blurb
			$("#tabs_transcripts p").removeClass('active').filter('#s'+curBlurb.startPoint).addClass('active');
			var pos = document.getElementById('s'+curBlurb.startPoint).offsetTop;
				pos -= 32;
			$("#tabs_transcripts").animate({scrollTop: pos}, 300);
		}
		
	},
	switchView: function(view) { /* Change view (single, dual, full) for player presentation (mobile will include [notes, transcript, slides, video]) */
		console.log('switchView');
		// Use Switch case for differnt views for desktop and mobile
	},
	saveBookmark: function(item) { /* Set bookmark in TOC and postback to server */
		console.log('saveBookmark');
		$('a.llc-bookmark').click(function(){
		var title = llc.pres.curEl.title, 
		netSessionID = $('input#session_id').val(), 
		timePoint = $("#master_jplayer").data("jPlayer").status.currentTime, 
		userID = $('input#user_id').val(), 
		siteID = $('input#site_id').val(), 
		presentationID = llc.pres.id, 
		slideID = llc.pres.curEl.id;
		var params = 'title='+title+'&netSessionID='+netSessionID+'&timePoint='+timePoint+'&userID='+userID+'&siteID='+siteID+'&presentationID='+presentationID;
		/* start ajax */
		$.ajax({
  		url: 'ajax/addBookmark.php',
		data: params,
  		success: function(data) {
		alert(data);
		var slideCellElm = 'td#thumb_'+slideID;
		$(slideCellElm).find('a').find('img').addClass('bookmarkedSlide');
		}
		});	
		/* end ajax */
		});
	},
	saveRating: function(num) { /* Set bookmark in TOC and postback to server */
		console.log('saveRating');
		/* ##########################################
		  ################# Post rating to server, locks stars, notify user
		 ########################################## */
		 var hasRated = llc.getCookie('rated');
		 if(!hasRated){
		$('#ratings_box').ratings(5, 0).bind('ratingchanged', function(event, data) {
			var newRating = data.rating, 
			netSessionID = $('input#session_id').val(), 
			userID = $('input#user_id').val(), 
			siteID = $('input#site_id').val(), 
			presentationID = llc.pres.id;
			var params = 'rating='+newRating+'&netSessionID='+netSessionID+'&userID='+userID+'&siteID='+siteID+'&presentationID='+presentationID;		
			$.ajax({
			url: 'ajax/addRating.php',
			data: params,
			success: function(data) {
			var confirmMessage = data + ' - rating this presentation: ' + newRating;
			alert(confirmMessage);
			llc.setCookie('rated', newRating);
			}
			});	
			
			});
		 }else{
		$('#ratings_box').ratings(5, hasRated);
		$('div.jquery-ratings-star').unbind('click');
		$('div.jquery-ratings-star').unbind('mouseenter');
		$('div.jquery-ratings-star').unbind('mouseleave');
		 
		 }
	},
	saveNote: function() { 
		console.log('setNote'); 
		/* ##########################################
		  ################# Retrieve note - post it to server
		 ########################################## */
		$('a#save_note_btn').click(function(){
		var note = $('textarea#note_pad').val(), 
		netSessionID = $('input#session_id').val(), 
		userID = $('input#user_id').val(), 
		siteID = $('input#site_id').val(), 
		presentationID = llc.pres.id;
		var params = 'note='+note+'&netSessionID='+netSessionID+'&userID='+userID+'&siteID='+siteID+'&presentationID='+presentationID;
		/* start ajax */
		$.ajax({
  		url: 'ajax/saveNotes.php',
		data: params,
  		success: function(data) {
		alert(data);
		}
		});	
		/* end ajax */
		});
		
		
		// postback to server
	},
	setCookie: function(name,value) { /* Set playback cookie (old player = 1 min interval)  ?Do we need to extend for other info besides playback? */
		console.log('setCookie');
		
		/* ##########################################
		  ################# Set a Cookie
		 ########################################## */
		 
		if (('localStorage' in window) && window.localStorage !== null) {
			localStorage[name] = value;
		} else {
			var date = new Date();
			date.setTime(date.getTime()+(365*24*60*60*1000));
			var expires = date.toGMTString();
			var cookiestr = name+'='+value+';'+' expires='+expires+'; path=/';
			document.cookie = cookiestr;
		}
	},
	getCookie: function(name) { /* Get playback cookie */
		console.log('getCookie');
		
		/* ##########################################
		  ################# Retrieve a Cookie
		 ########################################## */
		 
		var value;
		if (('localStorage' in window) && window.localStorage !== null) {
			value = localStorage[name];
		} else {
			value = document.cookie.split(name+'=')[1];
			value = value == undefined ? value : value.split(';')[0];				
		} return value
	},
	init: function() { /* serialize xml and call functions, assumes llc-player.js is called after markup */
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
			
			if (llc.pres.legacy) { // LEGACY
				
				/* ##########################################
				  ################# load legacy player
				 ########################################## */
				
			} else { 
			
				/* ##########################################
				  ################# Load HTML5 Media
				 ########################################## */	
				
				// slide loading progress vars
				llc.pres.imgsLoaded=0;
				llc.pres.imgsCount=0;
				
				// Setup slides (slides, bookmarks, blurbs, notes)
				llc.setupItems(llc.pres.media.items.item, llc.pres.bookmarks, llc.pres.transcript.blurb, llc.pres.viewer.notes);
				
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
				    	// Set playback if cookied
				    	var playhead = llc.getCookie('playhead') ? llc.getCookie('playhead') : 0;
				    	$(this).jPlayer("pause", Math.abs(playhead));
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
				    loop: false,
				    wmode: "window"
				}); // end jPlayer intialize
				
				// INFO tabs nav
				$("#info_tabs #tabs a").each(function() {
					$(this).click(function() {
						var ref = this.href.split('#')[1];
						$("#info_tabs .info").removeClass('active').filter("#tabs_"+ref).addClass('active');
						$("#info_tabs #tabs a").removeClass('active').filter(this).addClass('active');
						return false
					});
				});
				
				// Set playback value in Cookie on quit
				$(window).bind('beforeunload', function() {
					llc.setCookie('playhead',$("#master_jplayer").data("jPlayer").status.currentTime);
				});
			}
		}); // end ajax XML call
/************************************* ATTACH CLICK HANDLERS */
		
		// BEN WAS HERE
		
		llc.saveRating();
		
		llc.saveNote();
		
		llc.saveBookmark();
		
	}
} 

/* MISC FUNCTIONS - MOVE OUT OR DELETE LATER ************/

 /******************* PRINT_R IS NEAT ***********/
function print_r(theObj){
  if(theObj.constructor == Array ||
     theObj.constructor == Object){
    document.write("<ul>")
    for(var p in theObj){
      if(theObj[p].constructor == Array||
         theObj[p].constructor == Object){
document.write("<li>["+p+"] => "+typeof(theObj)+"</li>");
        document.write("<ul>")
        print_r(theObj[p]);
        document.write("</ul>")
      } else {
document.write("<li>["+p+"] => "+theObj[p]+"</li>");
      }
    }
    document.write("</ul>")
  }
}