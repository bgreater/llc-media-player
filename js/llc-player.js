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
 * Dependancies: jQuery v1.7, jQuery UI 1.8.16, xml2json v1.0(included), jPlayer v2.1.0
 * Authors: MultiView Team + B>
Functions:
setupItems
createThumbPanel
setupSlideMagnify
timeUpdate
switchView
saveBookmark
saveRating
saveNote
setCookie
getCookie
init
*/
var llc = {
	setupItems: function(slides, bookmarks, blurbs, notes) { /* Create slides --> set video or audio slides --> set markup & link */
		//console.log('setSlides');

		/* ##########################################
		  ################# Create Slides
		 ########################################## */
		 
		$(slides).each(function(i){ 
		  	var t=this;
		  	
		  	// Add thumbnail to TOC			
		  	if (t.inTOC=="True") llc.createThumbPanel((t.poster || t.file.text),t.id,t.startPoint, t.title, '#toc');
		  	
			if (t.fileType == "jpg"){ 		
			  		  		
		  		/* ######## JPG SLIDE #################### */
		  		
		  		// Append Slide
				var linkAction  = (t.link.length > 0) ? 'href="'+t.link+'" target="_blank"' : 'onclick="return false"';
		  		$('<a id="'+t.id+'" class="slide" '+linkAction+'><span class="switchView"></span><img src="'+t.file.text+'" /></a>').appendTo("#slides");
		  		
		  		// Set Slide Load Interation
		  		$("#"+t.id+" img").load(function(){
		  			llc.pres.imgsLoaded++;
		  		});	llc.pres.imgsCount++;
		  	
		  			  
		  	} else if (t.fileType != "jpg") { // Need standard video flag in xml?
		  		
		  		/* ######## VIDEO SLIDE ################## */
		  		
		  		// Inject Video Slide Markup
		  		$(llc.createMarkup(t)).appendTo("#slides");
				
				// Video File Types
				var videoTypes = { files: { poster:t.poster } }
				for (i in t.file) { 
					videoTypes.supplied = videoTypes.supplied ? videoTypes.supplied+','+t.file[i].type : t.file[i].type ;
					videoTypes.files[t.file[i].type] = t.file[i].text;
					//console.log(t.file[i]);
				}
				//console.log(videoTypes); 
				
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
					//solution:"flash, html",
					size: {							// Need variable size~!?
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
			var bmStart = parseInt(t.bookmark.startPoint);
			var slideStart = 0;
			var i = 0;
			var xml = llc.pres.media.items.item;
			while(slideStart < bmStart){
			var slideStart = parseInt(xml[i].startPoint);
			i++;
			}
				var slideCellElm = 'div#toc_thumb_'+xml[i-2].id;
				var curImgSrc = $(slideCellElm).find('img.toc_thumb_img').attr('src');
				$(slideCellElm).prepend('<div class="bmThumbFlag"></div>');
				var currentIconSrc = $(slideCellElm).find('a.toc-bookmark').find('img').attr('src');
				$(slideCellElm).find('a.toc-bookmark').find('img').attr('src', currentIconSrc.replace('_add', '_remove'));
				$(slideCellElm).find('a.toc-bookmark').addClass('bookmark-set');
			llc.createThumbPanel(xml[i-2].file, xml[i-2].id, bmStart, xml[i-2].title, '#tabs_bookmarks');
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
		 
		$("#note_pad").prepend(notes);
		
		/* ##########################################
		  ################# Setup overview toggle display
		 ########################################## */
		 
		$('#tabs_control_toggle_btn').click(function(){
			if(!$('div#content_area').is(':animated')){
				$("#content_area").slideToggle(function(){$("#llc_playerFrame").trigger('resize');});
				$(this).toggleClass('hide_features');
				var classChk = $(this).hasClass('hide_features');
				if(classChk){
					var active = $('#content_area div.active');
							var lastScreen = $(active).attr('id');
							var navsel = 'a[rel="'+lastScreen+'"]';
							$(navsel).toggleClass('active');
							
							if(!lastScreen){
							$('a.firstTab').toggleClass('active');
							$('div#tabs_overview').toggleClass('active');
							$('div#tabs_overview').animate({ opacity: 1 }, 1000);
							}
							$('#tabs_control_toggle_btn').html('HIDE PRESENTATION FEATURES');
						
				}else{
				   $('#tabs').find('a.active').toggleClass('active');
					$('#tabs_control_toggle_btn').html('SHOW PRESENTATION FEATURES');
				}
	
			}
		
		return false;
		});
		
		/* ##########################################
		  ################# Setup INFO tabs nav
		 ########################################## */
				$("#info_tabs #tabs a").each(function() {
					$(this).click(function() {
						var ref = this.href.split('#')[1];
						$("#info_tabs .info").removeClass('active').filter("#tabs_"+ref).addClass('active');
						$("#info_tabs #tabs a").removeClass('active').filter(this).addClass('active');
						$("#info_tabs .info").css('opacity', '.3')
						$("#tabs_"+ref).animate({ opacity: 1 }, 1000);
				var curdisplay = $("#content_area").css('display');
				if(curdisplay=='none'){
				$("#content_area").slideToggle(function(){$("#llc_playerFrame").trigger('resize');});
				$('#tabs_control_toggle_btn').toggleClass('hide_features');
				$('#tabs_control_toggle_btn').html('HIDE PRESENTATION FEATURES');
				}else{
				}
				
						return false
					});
				});
		
		/* ##########################################
		  ################# Add nifty play hover
		 ########################################## */
				
				$('div.toc_thumb').live({
				mouseenter:function(){
				if(!$(this).hasClass('active_toc_thumb')){
					$(this).find('.playIcon').css('opacity', '.4');
					$(this).find('.playIcon').fadeIn();
				}

				},
				mouseleave:function(){
					$(this).find('.playIcon').fadeOut();
				}
				});
	},
	createMarkup: function(obj) {
	
		if (this.pres.media.master.item === obj) {
			
			/* ##########################################
			  ################# Master Markup
			 ########################################## */
			
			markup = '<div id="llc_playerFrame" class="playerFrame">\
			  <div id="slides"></div>\
				<div id="master_jplayer" class="jp-jplayer"></div>\
				<div id="master_jp_container" class="jp-audio">\
					<div class="jp-type-single">\
						<div class="jp-gui jp-interface">\
							<ul class="jp-controls">\
								<li><a href="javascript:;" class="jp-play" tabindex="1" title="play">play</a></li>\
								<li><a href="javascript:;" class="jp-pause" tabindex="2" title="pause">pause</a></li>\
								<li><a href="javascript:;" class="llc-prev" tabindex="3" title="prev">prev</a></li>\
								<li><a href="javascript:;" class="llc-next" tabindex="4" title="next">next</a></li>\
								<li>\
									<div class="jp-progress">\
										<div class="jp-seek-bar">\
											<div class="jp-play-bar">\
												<div class="jp-current-time"></div>\
												<div class="jp-duration"></div>\
											</div>\
										</div>\
									</div>\
								</li>\
								<li>\
									<div class="jp-volume">\
										<div class="jp-volume-bar-contain">\
											<div class="jp-volume-bar">\
												<span class="jp-volume-bar-drag"></span>\
												<div class="jp-volume-bar-value"></div>\
											</div>\
										</div>\
									</div>\
								</li>\
								<li><a href="javascript:;" onclick="llc.saveBookmark(this)" class="llc-bookmark" tabindex="5" style="z-index:3344" title="bookmark">bookmark</a></li>\
								<li><a href="javascript:;" class="llc-full" tabindex="6" title="full">full</a></li>\
							</ul>\
							<div class="jp-title"></div>\
						</div>\
						<div class="jp-no-solution">\
							<span>Update Required</span>\
							To play the media you will need to either update your browser to a recent version or update your <a href="http://get.adobe.com/flashplayer/" target="_blank">Flash plugin</a>.\
						</div>\
					</div>\
				</div>\
				<div id="pres_info">\
					<div id="ad_sponsored" style=""><div style="float:left; margin-right:3px;">Sponsored By: </div><img src="images/player/sponsor-AD.png" alt="IBM" /></div>\
					<p id="pres_title"><strong>Title:</strong> <span></span></p>\
					<p id="pres_presenter"><strong>Presenter(s):</strong> <span></span></p>\
					<p id="pres_date"><strong>Date:</strong> <span>There is no date in xml</span></p>\
					<div id="ratings_box" class="ratingsBox"></div>\
				</div>\
				<div id="info_tabs">\
					<div id="tabs">\
						<a href="#overview" rel="tabs_overview" class="firstTab" style=""><table><tr><td><img src="images/player/overview_tab_icon.png" /></td><td> OVERVIEW</td></tr></table></a>\
						<a href="#notes" rel="tabs_notes" class="" style=""><table><tr><td><img src="images/player/notes_tab_icon.png" /></td><td> NOTES</td></tr></table></a>\
						<a href="#bookmarks" rel="tabs_bookmarks" style=""><table><tr><td><img src="images/player/bookmarks_tab_icon.png" /></td><td> BOOKMARKS</td></tr></table></a>\
						<a href="#transcripts" rel="tabs_transcripts" class="lastTab" style=""><table><tr><td><img src="images/player/transcript_tab_icon.png" /></td><td> TRANSCRIPT</td></tr></table></a>\
					</div>\
					<div id="content_area">\
						<div id="tabs_overview" class="info"><div id="toc"></div></div>\
						<div id="tabs_bookmarks" class="info"><div id="noBookmarks"><p>Your bookmarks folder is currently empty.</p></div></div>\
						<div id="tabs_notes" class="info" style="border:1px solid #777777">\
							<TEXTAREA id="note_pad" name="notePad" class="notesInput"></TEXTAREA>\
							<div class="notesSubmitBox">\
							<table style="width:100%"><tr><td><p class="">Keep track of the presentation\'s key points here.</p></td>\
							<td><button class="llc-button-s" id="save_note_btn">SAVE</button></td></tr></table>\
							</div>\
						</div>\
						<div id="tabs_transcripts" class="info"></div>\
					</div>\
					<div id="tabs_control"><div class="show_features" id="tabs_control_toggle_btn">SHOW PRESENTATION FEATURES</div></div>\
				</div>\
			</div>';
			
		} else {
			
			/* ##########################################
			  ################# Video Slide Markup
			 ########################################## */
			 
			markup = '<div id="'+obj.id+'" class="jp-video slide">\
				<span class="switchView"></span>\
				<div class="jp-type-single">\
					<div id="jquery_jplayer_'+obj.id+'" class="jp-jplayer"></div>\
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
							  '+obj.title+'\
							</div>\
						</div>\
					</div>\
					<div class="jp-no-solution">\
						<span>Update Required</span>\
						To play the media you will need to either update your browser to a recent version or update your <a href="http://get.adobe.com/flashplayer/" target="_blank">Flash plugin</a>.\
					</div>\
				</div>\
			</div>';
		}
		
		return markup;
	},
	createThumbPanel: function(img,id,startPoint, title, pageid) {
		//console.log('createThumbPanel');
			
		/* ##########################################
		  ################# Add thumbnail to document
		 ########################################## */
		var friendlyStartTime = milliConvert(startPoint);
		var title = truncate(title, 40);
		var title = htmlEntities(title);
		var prefix = pageid.substr(1, pageid.length);
		var bmaction = (prefix=='tabs_bookmarks') ? 'remove' : 'add';
		var bmset = (prefix=='tabs_bookmarks') ? ' bookmark-set' : '';
		if(prefix=='tabs_bookmarks'){
		var numBMs = ($('#tabs_bookmarks .toc_thumb').length)+1;
		var bmword = (numBMs == 1) ? 'bookmark' : 'bookmarks';
		$('div#noBookmarks p').html(numBMs + ' '+bmword+' saved');
		}
		
		$('<div class="toc_thumb" id="'+prefix+'_thumb_'+id+'"><div onclick="slideJump('+((startPoint/1000)+.3)+')" class="playIcon"></div>\
			<a href="" onclick="slideJump('+((startPoint/1000)+.3)+')">\
			  <img class="toc_thumb_img" src="'+img+'" />\
			</a>\
			<div class="toc_thumb_info"><table CELLPADDING=0 CELLSPACING=0 style="width:100%"><tr><td style="width:95px;"><div class="toc_title">'+title+'</div>\
			</td><td><div class="toc_magnify_img" id=""></div></td></tr><tr><td colspan=2>\
			<div class="toc_time">'+friendlyStartTime+'</div><a onclick="return false" class="toc-bookmark'+bmset+'" title="'+title+'" rel="'+(startPoint)+'">\
			<img src="images/player/toc_'+bmaction+'_bm_icon.png" /> Bookmark</a></td></tr></table></div>\
		</div>').appendTo(pageid);
	},
	setupSlideMagnify: function() {

		//console.log('setupSlideMagnify'); 
		/* ##########################################
		  ################# adds zoom feature to toc slides
		 ########################################## */
		$('div.toc_magnify_img').live('click', function(e){
		var zoomcheck = $(this).hasClass('zoom_selected');

		if($('div.zoom_box').length > 0){
		$('div.zoom_box').remove();
			$('div.toc_magnify_img').each(function(){
			$(this).removeClass('zoom_selected');
			});
		}
		if(!zoomcheck){
		var xpos = e.pageX - 244;
		var ypos = e.pageY - 420;
		//alert(ympos);
		var imgSrc = $(this).parents('div.toc_thumb').find('img.toc_thumb_img').attr('src');
		var zoomTag = '<div style="left:'+xpos+'px; top:'+ypos+'px;" class="zoom_box"><div class="zoom_box_control"><div class="close_button"></div></div><img src="'+imgSrc+'" class="zoom_img" /></div>';
		var zoomTitle = '<div class="zoom_box_title"></div>';
		$(this).parents('body').prepend(zoomTag);
		$('div.zoom_box').bind('contextmenu', function(e){
		return false;
		});
		$
		$(this).addClass('zoom_selected');
		}
		});
		
		$('div.close_button').live('click', function(e){
			$('div.zoom_box').remove();
			$('div.toc_magnify_img').each(function(){
			$(this).removeClass('zoom_selected');
			});
		});
		
		
	},
	timeUpdate: function(event) { /* Mapped to the Timeupdate function of jPlayer (sets current slide) */
		//console.log('timeUpdate');
		
		/* ##########################################
		  ################# Time Update Functions
		 ########################################## */
		
		var timeNow = event.jPlayer.status.currentTime,
			curEl = llc.pres.curEl || llc.pres.media.items.item[0],
			curBlurb = llc.pres.curBlurb || llc.pres.transcript.blurb[0] || null;
			llc.pres.curEl = llc.pres.curEl || null;
			llc.pres.curBlurb = llc.pres.curBlurb || null;
		
		if (window.console) console.log(llc.pres.curEl,llc.pres.curBlurb);
		
		// Determine Slide closest to play head	but not before current Time
		for (i in llc.pres.media.items.item) {
			var startPoint = llc.pres.media.items.item[i].startPoint/1000;
			curEl = startPoint-timeNow <= 0 ? llc.pres.media.items.item[i] : curEl ;
		}
		
		// Determine Blurb closest to play head	but not before current Time
		for (i in llc.pres.transcript.blurb) {
			var startPoint = llc.pres.transcript.blurb[i].startPoint/1000;
			curBlurb = startPoint-timeNow <= 0 && curBlurb != null ? llc.pres.transcript.blurb[i] : curBlurb ;
		}
		
		if (window.console) console.log(curEl,curBlurb);
		
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
				$("#master_jp_container").slideDown(0);
			}
			
			// update TOC, Title and scroll to current thumb
			$("#master_jp_container div.jp-title").text("Now Playing... Slide "+(llc.pres.media.items.item.findIndex(curEl)+1)+"/"+llc.pres.media.items.item.length+": "+curEl.title);
			$("div.toc_thumb").each(function(){
				$(this).removeClass('active_toc_thumb');
			});
			$("div#toc_thumb_"+curEl.id).addClass('active_toc_thumb');
			var pos = document.getElementById("toc_thumb_"+curEl.id).offsetTop;
			if(pos > 800){
				pos -= 120;
				$("#tabs_overview").animate({scrollTop: pos}, 900);
			}
		}
		
		// Should we do anything with Blurbs?
		if (llc.pres.curBlurb != curBlurb && curBlurb != null) {
			
			// Set global curBlurb
			llc.pres.curBlurb = curBlurb;
			
			// update Transcript to current blurb
			$("#tabs_transcripts p").removeClass('active').filter('#s'+curBlurb.startPoint).addClass('active');
			var pos = document.getElementById('s'+curBlurb.startPoint).offsetTop;
				pos -= 140;
			$("#tabs_transcripts").animate({scrollTop: pos}, 300);
		}
		
	},
	switchView: function(event,mode) { /* Change view (single, dual) for player presentation (mobile will include [notes, transcript, slides, video]) */
		
		//console.log('switch view fired');
		
		// ASSUMES 4x3 Aspect Ratio for Media~!!!
		
		var s = $("#slides"),
			m = $("#master_jplayer"),
			w = $("#llc_playerFrame").width(),
			h = $("#llc_playerFrame").height(),
			curMode = llc.switchView.curMode = llc.switchView.curMode ? llc.switchView.curMode : llc.pres.defaultInterface.text;
		
		if ((event && curMode == "Single Screen") || mode == "Dual Screen") { // Do Dual Screen
			
			//console.log('dual view fired');
			m.addClass("dual").removeClass("single");
			s.addClass("dual").removeClass("single");
			
			// if full screen
			if ($("#llc_playerFrame").is(".Full")) {
				
				// Do for full screen for above 8x3 (2 wide 4x3) ratio, probably not any screens that are longer than 8x3 ratio 
				var mar = ((h-50)-((w*0.49)*0.75))/2;
					
				s.css({marginTop:mar, marginBottom:mar, marginLeft:0, marginRight:0}); 
				m.css({height:s.height(), width:s.width(), marginTop:mar, marginBottom:mar, marginLeft:0, marginRight:0});
			}
			
			llc.switchView.curMode = "Dual Screen"; // End with	
			
		} else if ((event && curMode == "Dual Screen") || mode == "Single Screen") { // Do Single Screen
		
			//console.log('single view fired');
			
			if (event) { // Was clicked
								
				var p = $(event.target).parents('div.dual');
				
				p.removeClass("single").addClass("single");

											
			} else {
			
				if (llc.pres.defaultWindow.id == 1 && !s.is(".single")) {
					
					// Show screen 1
					m.removeClass("single").addClass("single");
				
				} else {
					
					// Show Slides (screen 2)
					s.removeClass("single").addClass("single");
				
				}
			}
			
			m.removeClass("dual");
			s.removeClass("dual");
			
			// if full screen
			if ($("#llc_playerFrame").is(".Full")) {
				
				m.css({marginTop:0, marginBottom:0});
				s.css({marginTop:0, marginBottom:0});
				
				// wide aspect ratio
				if (h-50 <= w*0.75) {
					
					var mar = (w-((h-50)/0.75))/2; 
					
					$("#llc_playerFrame").find(".single").css({marginLeft:mar, marginRight:mar})
					
				}
				
				if (s.is(".single")) m.height(0), s.height("auto");
				else s.height(0), m.height("auto");
				
			} else {
				
				
			}
			
			llc.switchView.curMode = "Single Screen"; // End with
		
		}
		
	},
	saveBookmark: function(item) { /* Setup bookmarks for TOC and control bar - is either attached to toc-bookmark (no param) or can be called onclick for control bar (param = this) */
		//console.log('saveBookmark');
		if (typeof item === "undefined"){
				//has been called on init
				$('a.toc-bookmark').live('click', function(){
				var timePoint = $(this).attr('rel');
				var title = $(this).attr('title');
				var slideID = $(this).parents('div.toc_thumb').attr('id').substr($(this).parents('div.toc_thumb').attr('id').lastIndexOf('_')+1, $(this).parents('div.toc_thumb').attr('id').length);
		
				var netSessionID = $('input#session_id').val(), 
				presentationID = llc.pres.id, 
				userID = $('input#user_id').val(), 
				siteID = $('input#site_id').val();
				var params = 'title='+title+'&netSessionID='+netSessionID+'&timePoint='+timePoint+'&userID='+userID+'&siteID='+siteID+'&presentationID='+presentationID;
				
				if($(this).hasClass('bookmark-set')){
						//remove bookmark
						var slideCellElm = 'div#toc_thumb_'+slideID;
						var curImgSrc = $(slideCellElm).find('img.toc_thumb_img').attr('src');
						$(slideCellElm).find('div.bmThumbFlag').fadeOut('slow', function(){
							$(slideCellElm).find('div.bmThumbFlag').remove();
						});
						
						var currentIconSrc = $(slideCellElm).find('a.toc-bookmark').find('img').attr('src');
						$(slideCellElm).find('a.toc-bookmark').find('img').attr('src', currentIconSrc.replace('_remove', '_add'));
						$(slideCellElm).find('a.toc-bookmark').removeClass('bookmark-set');
						$('div#tabs_bookmarks_thumb_'+slideID).remove();
						
						var numBMs = ($('#tabs_bookmarks .toc_thumb').length);
						if(numBMs==0){
						$('div#noBookmarks p').html('Your bookmarks folder is currently empty.');
						}else{
						var bmword = (numBMs == 1) ? 'bookmark' : 'bookmarks';
						$('div#noBookmarks p').html(numBMs + ' '+bmword+' saved');
						}
						
						var script_url = 'ajax/deleteBookmark.php';
				}else{
						//add new bookmark
						var slideCellElm = 'div#toc_thumb_'+slideID;
						var curImgSrc = $(slideCellElm).find('img.toc_thumb_img').attr('src');
						$(slideCellElm).prepend('<div class="bmThumbFlag"></div>');
						var currentIconSrc = $(slideCellElm).find('a.toc-bookmark').find('img').attr('src');
						$(slideCellElm).find('a.toc-bookmark').find('img').attr('src', currentIconSrc.replace('_add', '_remove'));
						$(slideCellElm).find('a.toc-bookmark').addClass('bookmark-set');
						llc.createThumbPanel(curImgSrc,slideID,timePoint, title, '#tabs_bookmarks');
						
						var script_url = 'ajax/addBookmark.php';
				}
				/* start ajax */
				$.ajax({
		  		url: script_url,
				data: params,
		  		success: function(data) {
				//alert(data);
				}
				});	
				/* end ajax */
				});
		}else{
				//has been called by anchor's onclick
		
				var timePoint = ($("#master_jplayer").data("jPlayer").status.currentTime)*1000;
				var title = llc.pres.curEl.title;
				var slideID = llc.pres.curEl.id;
		
				var netSessionID = $('input#session_id').val(), 
				presentationID = llc.pres.id, 
				userID = $('input#user_id').val(), 
				siteID = $('input#site_id').val();
				var params = 'title='+title+'&netSessionID='+netSessionID+'&timePoint='+timePoint+'&userID='+userID+'&siteID='+siteID+'&presentationID='+presentationID;
				
				if($(item).hasClass('llc-bookmark-set')){
						//remove bookmark
						var slideCellElm = 'div#toc_thumb_'+slideID;
						var curImgSrc = $(slideCellElm).find('img.toc_thumb_img').attr('src');
						$(slideCellElm).find('div.bmThumbFlag').fadeOut('slow', function(){
							$(slideCellElm).find('div.bmThumbFlag').remove();
						});
						
						var currentIconSrc = $(slideCellElm).find('a.toc-bookmark').find('img').attr('src');
						$(slideCellElm).find('a.toc-bookmark').find('img').attr('src', currentIconSrc.replace('_remove', '_add'));
						$(slideCellElm).find('a.toc-bookmark').removeClass('bookmark-set');
						$('div#tabs_bookmarks_thumb_'+slideID).remove();
						
						var numBMs = ($('#tabs_bookmarks .toc_thumb').length);
						if(numBMs==0){
						$('div#noBookmarks p').html('Your bookmarks folder is currently empty.');
						}else{
						var bmword = (numBMs == 1) ? 'bookmark' : 'bookmarks';
						$('div#noBookmarks p').html(numBMs + ' '+bmword+' saved');
						}
						$(item).removeClass('llc-bookmark-set');
						var script_url = 'ajax/deleteBookmark.php';
				}else{
						//add new bookmark
						var slideCellElm = 'div#toc_thumb_'+slideID;
						var curImgSrc = $(slideCellElm).find('img.toc_thumb_img').attr('src');
						$(slideCellElm).prepend('<div class="bmThumbFlag"></div>');
						var currentIconSrc = $(slideCellElm).find('a.toc-bookmark').find('img').attr('src');
						$(slideCellElm).find('a.toc-bookmark').find('img').attr('src', currentIconSrc.replace('_add', '_remove'));
						$(slideCellElm).find('a.toc-bookmark').addClass('bookmark-set');
						//$(item).addClass('llc-bookmark-set');
						llc.createThumbPanel(curImgSrc,slideID,timePoint, title, '#tabs_bookmarks');
						
						var script_url = 'ajax/addBookmark.php';
				}
				/* start ajax */
				$.ajax({
		  		url: script_url,
				data: params,
		  		success: function(data) {
				//alert(data);
				}
				});	
				/* end ajax */
		}
   

	},
	saveRating: function(num) { /* Set bookmark in TOC and postback to server */
		//console.log('saveRating');
		/* ##########################################
		  ################# Post rating to server, locks stars, notify user
		 ########################################## */
		 var hasRated = llc.getCookie(llc.pres.id+'rated');
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
			llc.setCookie(llc.pres.id+'rated', newRating);
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
		//console.log('setNote'); 
		/* ##########################################
		  ################# Retrieve note - post it to server
		 ########################################## */
		$('button#save_note_btn').click(function(){
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
		//console.log('setCookie');
		
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
		//console.log('getCookie');
		
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
	disableRightClick: function(){
		$('div#slides, img.toc_thumb_img').bind('contextmenu', function(e){
		return false;
		});
	},
	switchFull: function(val) { /* Get playback cookie */
		//console.log('trigger full screen');
		
		if (val==true) { 
		
		/* ##########################################
		  ################# Go Full
		 ########################################## */
		 
			// Update elements
			$("body, div.playerFrame").addClass("Full");
			$("#pres_info, #info_tabs").hide();
			
			// Resize Progress bar and disable scrolling
			$(window).resize(function() {

				var w = $("#llc_playerFrame").width();

				$("#master_jp_container .jp-progress").width(w-222);
				
				llc.switchView(false,llc.switchView.curMode);
				
			}).scroll(function (event) { 

				if ($(this).scrollTop()>0) {
					scroll(0,0); 
				}

			}).trigger('resize').trigger('scroll');
						
			$("#master_jplayer").next().find('a.llc-full').addClass('active');
						
		
		} else if (val==false) {
		
		/* ##########################################
		  ################# Back to Normal
		 ########################################## */
			
			$("body, div.playerFrame").removeClass("Full");
			$("#master_jp_container div.jp-progress").attr('style','');
			$("#pres_info, #info_tabs").show();
			
			$(window).unbind('resize').unbind('scroll');
						
			$("#master_jplayer").next().find('a.llc-full').removeClass('active');
		}
		 
	},
	init: function() { /* serialize xml and call functions, assumes llc-player.js is called after markup */
	
		 
		if (document.domain.indexOf('dropbox')!=-1) {
			
			// Use test data
			var url = 'presentation.xml';
			
		} else {
			
			// Use live data
			presentationID = $('input#pres_id').val(),
			userID = $('input#user_id').val(),
			siteID = $('input#site_id').val();
			var url = 'playerPresentationDatasource.aspx?PID=' + presentationID + '&SID=' + siteID + '&UID=' + userID;
			
		}
				
		// Set loading
		$('<div id="loading"></div>').appendTo("#llc_container");
		
		// Serialize XML and set llc.pres object
		$.get(url, function(xml){ 
		
			llc.pres = $.xml2json(xml); 

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
				
				$.getScript('js/jquery.swfobject.1-1-1.min.js', function(data, textStatus){
							
						var netSessionID = $('input#session_id').val(), 
						presentationID = llc.pres.id, 
						userID = $('input#user_id').val(), 
						siteID = $('input#site_id').val();
							$('div.player').flash({
								swf: 'flash/FlashPlayer.swf',
						        width: 650,
						        height: 650,
						        wmode: 'transparent',
						        allowFullScreen: 'true',
								flashvars: {
						        SID: siteID,
						        PID: presentationID,
						        UID: userID,
						        netSessionID: netSessionID,
						        ISD: 'F',
						        ISE: 'F'
								}
							}
						);
				});
				
				$("#loading").remove();

				
			} else { 
			
				/* ##########################################
				  ################# Load HTML5 Media
				 ########################################## */	
				
				/* ######## Load Markup and Position */
				
				$(llc.createMarkup(llc.pres.media.master.item)).appendTo("body");
				
				// hide for loading & set initial inline container height
				$("#llc_container").height(0);
				$("#llc_playerFrame").height(695);
				
				// Adjust container height & position player
				$("#llc_playerFrame").resize(function(){

					var con = $("#llc_container"),
						frm = $("#llc_playerFrame"),
						top = con.offset(); // spliting off for ie9 issue
						top = top.top+'px';

					frm.css({
						'top':top,
						'left':'50%',
						'margin-left':'-320px'
					});

					con.height(frm.height());
					
				}).trigger('resize');
				
					
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
						clearLoading();
					}
				}
				
				function clearLoading() {
					window.clearInterval(window.loader);
					window.clearTimeout(window.loaderFail);	
					$("#loading").remove();
					$("#llc_playerFrame").css('height','auto');
					$("#llc_playerFrame").trigger('resize');
				}
				window.loader = window.setInterval(loading, 100);
				window.loaderFail = window.setTimeout(clearLoading, 20000); // loader fail safe 20 sec


				/* ######## Initialize Master jPlayer */
				
				$("#master_jplayer").jPlayer({
					ready: function (event) {
				    	$.jPlayer.timeFormat.showHour = true; // set show hours
				    	var media = new Object();
				    		media[llc.pres.media.master.item.fileType] = llc.pres.media.master.item.file.text;
				    	$(this).jPlayer("setMedia", media);
				    	
				    	// Set playback if cookied
				    	var playhead = llc.getCookie(llc.pres.id+'playhead') ? llc.getCookie(llc.pres.id+'playhead') : 0;
				    	$(this).jPlayer("pause", Math.abs(playhead));
				    	
				    	// Set volume if cookied
				    	llc.perVolume = llc.getCookie(llc.pres.id+'volume') ? llc.getCookie(llc.pres.id+'volume') : 0.8;
				    	$(this).jPlayer("volume", llc.perVolume);
				    	
				    },
				    play: function() { // To avoid both jPlayers playing together.
				    	$(this).jPlayer("pauseOthers");
				    },
				    timeupdate: function (event) { // Set/Show Current time/Slide function
				    	llc.timeUpdate(event);   	
				    },
				    volumechange: function(event) { // make sure volume dragable moves on click
				    	var t = $(this).next().find("div.jp-volume-bar-value"),
				    		bottom = t.height(),
				    		height = t.parent().height(),
				    		top = height-bottom;
				    	t.prev().css("top",top);	
				    	llc.perVolume = t.attr('style').slice(8,-3) / 100;
				    	if (llc.perVolume == 0) t.parents('div.jp-volume').addClass('mute');
				    	else t.parents('div.jp-volume').removeClass('mute');
				    },
				    verticalVolume: true,
				    //preload: "auto",
				    swfPath: "flash",
				    supplied: llc.pres.media.master.item.fileType, // Assumes mp3 or native jPlayer video format
				    cssSelectorAncestor: "#master_jp_container",
				    loop: false,
				    solution:"flash, html",
				    wmode: "window"
				}); // end jPlayer initialize
				
				
				/* ################################# ATTACH CLICK HANDLERS */
				
				/* Assign volume show/hide click handlers */
				$("#master_jp_container div.jp-volume").toggle(function() {
						if(!$(this).is('.hover.active')) $(this).addClass("active");
					}, function() {
						if(!$(this).is('.hover')) $(this).removeClass("active");
				}).hover(function() {
						$(this).addClass("hover");
						$(this).click();
					}, function() {
						$(this).removeClass("hover");
						$(this).click();
				});
				
				// Assign volume dragable
				$("#master_jp_container div.jp-volume span.jp-volume-bar-drag").draggable({
					axis: 'y',
					containment: 'parent',
					drag: function(event, ui) {
						var t = $(this),
							top = t.css("top").replace('px',''),
							height = t.parent().height(),
							per = height-top > 5 ? (height-top)/height : 0;
						t.next().height(per*100+'%');
						llc.perVolume = per;
					},
					stop: function(event, ui) {
						$("#master_jplayer").jPlayer("volume", llc.perVolume);
					}
				});

				// Unbind current time and duration click events so play bar can function
				$("#master_jp_container .jp-current-time, #master_jp_container .jp-duration").unbind('click');
				
				// Assign next click handlers
				$("#master_jp_container .llc-next").click(function() {
					$("#toc .active_toc_thumb").next().find("div.playIcon").click();
				});
				
				// Assign prev click handlers
				$("#master_jp_container .llc-prev").click(function() {
					$("#toc .active_toc_thumb").prev().find("div.playIcon").click();
				});
				
				// Assign volume show/hide click handlers
				$("#master_jp_container div.jp-volume").toggle(function() {
						if(!$(this).is('.hover.active')) $(this).addClass("active");
					}, function() {
						if(!$(this).is('.hover')) $(this).removeClass("active");
				}).hover(function() {
						$(this).addClass("hover");
						$(this).click();
					}, function() {
						$(this).removeClass("hover");
						$(this).click();
				});
				
				// Assign Full screen & normal click handlers
				$("#master_jp_container a.llc-full").toggle(function() {
						llc.switchFull(true);
					}, function() {
						llc.switchFull(false);
				});
				
				llc.saveRating();
				llc.saveNote();
				llc.saveBookmark();
				llc.setupSlideMagnify();
				llc.disableRightClick();
				
				// Switch view event handler 
				$("<span class='switchView'></span>").appendTo("#master_jplayer");
				$("span.switchView").click(function(event){
					llc.switchView(event,false);
				});
				
				
				/* ######## MISC */
				
				// Set presentation info
				$("#pres_title span").text(llc.pres.title);
				$("#pres_presenter span").text((function(){
					var spks
					for (i in llc.pres.speakers.speaker) {
						var s = llc.pres.speakers.speaker[i];
						if (s.firstName) spks = llc.pres.speakers.speaker.length > 1 && s != llc.pres.speakers.speaker[0] ? spks + ', '+ s.firstName + " " + s.lastName :  s.firstName + " " + s.lastName ;
					} return spks
				})());
				// $("#pres_date span").text(llc.pres.date?);
				
				// Set playback value in Cookie on quit
				$(window).bind('beforeunload', function() {
					llc.setCookie(llc.pres.id+'playhead', $("#master_jplayer").data("jPlayer").status.currentTime);
					llc.setCookie(llc.pres.id+'volume', llc.perVolume);
				});
				
				// Set defualt view
				llc.switchView(false,llc.pres.defaultInterface.text);					
				
			}
		}); // end ajax XML call
	}
} 

/* MISC FUNCTIONS - MOVE OUT OR DELETE LATER ************/

 /******************* PRINT_R IS NEAT ***********/
 // You can access the js object in your browser console so you don't really need this ...
 // Isn't this a PHP function name ? ;) 
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

function milliConvert(millis) {
  var seconds = millis / 1000;
  var m = Math.floor(seconds/60);
  var s = Math.round(seconds - (m * 60));

  // Add leading zeros to one-digit numbers.
  if (m < 10) {
    m = "0" + m;
  }
  if (s < 10) {
    s = "0" + s;
  }
  return m + ":" + s;
}
function truncate(text, length, ellipsis) {
if (typeof length == 'undefined') var length = 100;
if (typeof ellipsis == 'undefined') var ellipsis = '...';
if (text.length < length) return text;

	for (var i = length-1; text.charAt(i) != ' '; i--) {
	length--;
	}
	
return text.substr(0, length) + ellipsis;
}
function slideJump(startPoint){
$('#master_jplayer').jPlayer('pauseOthers').jPlayer('play',startPoint);
return false;

}
Array.prototype.findIndex = function(value){
var ctr = "";
for (var i=0; i < this.length; i++) {
// use === to check for Matches. ie., identical (===), ;
if (this[i] == value) {
return i;
}
}
return ctr;
};
function htmlEntities(str) {

    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&quot;');
}





