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
	setSlides: function(slides) { /* Create slides --> set video or audio slides --> set markup & link */
		console.log('setSlides');
		// Add Slide to slideshow markup
		// If Video
			// Set Video Markup
			// Initialize Video jPlayer Instance
	},
	addToTOC: function(el) { /* Add to Table of contents (needs to work for slide and bookmark) */
		console.log('addToTOC');
		// Add Slide thumb to TOC markup
		// if Bookmark
			// Set Bookmark CSS Class to Markup
	},
	setMaster: function(item) { /* Configure master jPlayer instance --> use pres.media.master.item.fileType to do different stuff for audio vs video */
		console.log('setMaster');
		// Initialize Master jPlayer
		// Map timeUpdate to jPlayer method
	},
	timeUpdate: function() { /* Mapped to the Timeupdate function of jPlayer (sets current slide) */
		console.log('timeUpdate');
		// update slide
		// updateTOC()
		// updateTranscript()
		// ?switchView()?
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
	setNote: function() { /* Set Note and postback to server ?does the note correspond to the playhead and if so do we treat it like a bookmark? */
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
	loadLegacy: function() { /* Inject flash HTML for legacy content */
		console.log('loadLegacy');
		// remove jPlayer <div>
		// inject Flash HTML
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
				  pres.media.items.item.{poster} // link for default or fallback image of video
				  
				*/
				
			/* Set int functions here */
			// if legacy 
				// loadLegacy 
			// else
				// setSlides() for item in llc.pres.media.items.item
				// addToTOC() for item in llc.pres.media.items.item
				// addToTOC() for item in llc.pres.bookmarks
				// setMaster() for llc.pres.media.master.item
				// Set Notes from llc.pres.viewer.notes
				// Set Transcript from llc.pres.transcript
				// Set rating from llc.pres.[?]
				// getCookie() & set playhead
				// if Agreement ?Do we need to show agreement if cookie is found?
					// Setup Agreement and trigger auto-play on confirm
				// else
					// Set default window mode
					// Auto-play (works for desktop)
		});
	})()
} 