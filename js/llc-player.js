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
tosAgreed
tosDecline
init
*/

// Set viewport for ipad fix
$('meta[name=viewport]').remove();
$('head').append('<meta name="viewport" content="width=device-width; initial-scale=1; minimum-scale=1; maximum-scale=1; user-scalable=0;">');

// Main Object
var llc = {
	log: [],
	status: function (obj) {
		/* Status updates */
		
		if (llc.status.verbose == undefined) {
			llc.status.verbose =  urlParse('verbose')=='y' ? 'y' : 'n' ; 
		}
		
		if (obj.media) {
		
			llc.status.media = obj.media;
			llc.log.unshift(obj.media);
		
		} else if (obj.data) {
		
			llc.status.data = obj.data;
			llc.log.unshift(obj.data);
			
		} else {
		
			llc.log.unshift(obj);
			
		}
		
		if (llc.status.verbose == 'y') {
		
			if (!$("#llc-log").is('div')) {
				
				$("body").append('<div id="llc-log">\
									<a href="#" class="show">show log</a>\
									<a href="#" class="hide" style="display:none">hide log</a>\
									<div id="status"></div>\
									<ol id="log" style="display:none"></ol>\
								  </div>');
								  
				$("#llc-log a.hide").click(function(){
					$("#llc-log #log").hide();
					$(this).hide();
					$("#llc-log a.show").show();
				});
				
				$("#llc-log a.show").click(function(){
					$("#llc-log #log").show();
					$(this).hide();
					$("#llc-log a.hide").show();
				});
			}
			
			$("#llc-log #status").html('status: <span>'+llc.log[0]+'</span>');
			$("#llc-log #log").prepend("<li>"+llc.log[0]+"</li>")
			
		}
	},
	setupItems: function (slides, bookmarks, blurbs, notes) { /* Create slides --> set video or audio slides --> set markup & link */
		//console.log('setSlides');

		/* ##########################################
		  ################# Create Slides
		 ########################################## */
		 
		$(slides).each(function(i){
		  	
		  	var t=this;

		  	if ( typeof(t.files)=='object' ) {
		  		
			  	// Add thumbnail to TOC			
			  	if (t.inTOC=="True") llc.createThumbPanel((t.poster || t.files.file.text || t.files.file[1].text),t.id,t.startPoint, t.title, '#toc', '');
			  	
			  	// 2nd file in files is slide t.files.file[1]
				if ((t.files.file.fileType || t.files.file[1].fileType) == "jpg"){ 		
				  		  		
			  		/* ######## JPG SLIDE #################### */
			  		
			  		// Append Slide
					var linkAction  = (t.link.length > 0) ? 'href="'+t.link+'" target="_blank"' : 'onclick="return false"';
			  		$('<a id="'+t.id+'" class="slide" '+linkAction+'><span class="switchView"></span><img src="'+(t.files.file.text || t.files.file[1].text)+'" /></a>').appendTo("#slides");
			  		
			  		// Set Slide Load Interation
			  		$("#"+t.id+" img").load(function(){
			  			llc.pres.imgsLoaded++;
			  		});	llc.pres.imgsCount++;
			  	
			  			  
			  	} else if ((t.files.file.fileType || t.files.file[1].fileType) == "flv") { // Need standard video flag in xml?
			  		
			  		/* ######## VIDEO SLIDE ################## */
			  		
			  		// Inject Video Slide Markup
			  		$(llc.createMarkup(t)).appendTo("#slides");
					
					// Video File Types & endpoint
					var videoTypes = llc.fileTypes(t),
						endPoint = t.endPoint = slides[i+1] ? slides[i+1].startPoint/1000: undefined;
					
					// Load Video Jplayer
					$("#jquery_jplayer_"+t.id).jPlayer({  
						
						ready: function () {
							var files = JSON ? JSON.stringify(videoTypes.files) : 'N/A';
							llc.status('video slide ready, files: '+files);
							$(this).jPlayer("setMedia", videoTypes.files);
						},
						play: function (event) { // To avoid both jPlayers playing together
							llc.status({media:'video slide play'});
							$(this).jPlayer("pauseOthers");
							$("#master_jp_container .jp-play").hide();
							$("#master_jp_container .jp-pause").show();
						
						},
						pause: function (event) {
							llc.status({media:'video slide paused'});
							var curSec = t.startPoint/1000 + event.jPlayer.status.currentTime,
								masterTime = $('#master_jplayer').data('jPlayer').status.currentTime;
								//prevEvent = llc.status[1];
								//percent = (curSec / $("#master_jplayer").data("jPlayer").status.duration) * 100;
							
							if ((masterTime<t.startPoint/1000 || masterTime>t.endPoint)) {
								// Seeking beyond video slide
								$("#master_jplayer").jPlayer("play");
								console.log('pause and play master');
							}
							else if (curSec < endPoint && curSec != t.startPoint/1000 ) {
								//console.log('normal pause');
								// Normal pause
								$("#master_jp_container .jp-play").show();
								$("#master_jp_container .jp-pause").hide();
								llc.pres.curEl = llc.pres.curEl || undefined;
							
							} else {
								//console.log('resume master play pause');
								// Resume master play 
								var quePercent = ((t.endPoint+.3) / $("#master_jplayer").data("jPlayer").status.duration) * 100;
								
								if ($.jPlayer.platform.tablet || $.jPlayer.platform.mobile) {
									
									//console.log('tablet resumePlay ',endPoint+.3);
									
									llc.pres.curEl = llc.pres.curEl || undefined;
									
									//$("#master_jplayer").data('jPlayer').status.currentTime = endPoint+.3;
									$("#master_jplayer").jPlayer("playHead", quePercent);
																		
									clearTimeout('resumePlay');
									var resumePlay = setTimeout(function(){
										$("#master_jplayer").jPlayer("play",t.endPoint+.3)
										$("#master_jp_container .jp-pause span, #master_jp_container .jp-play span").unbind('click');
									},700);
									
								} else {
									//console.log('normal resumePlay');
									$("#master_jplayer").jPlayer("play",t.endPoint+.3);
								}
								
							}
						
						},
						timeupdate: function (event) { // Set/Show Current time/Slide function
							
							var curSec = t.startPoint/1000 + event.jPlayer.status.currentTime,
								time = secondsToTime(curSec),
								percent = (curSec / $("#master_jplayer").data("jPlayer").status.duration) * 100;
							
							//$("#master_jplayer").jPlayer("playHead",percent);
							if (!event.jPlayer.status.paused) {
								$("#master_jp_container .jp-play-bar").width(percent+'%');
								$("#master_jp_container .jp-current-time").text(time.h+':'+time.m+':'+time.s);
								llc.seatTime('update');
							}
							
							if (endPoint && curSec >= endPoint && !event.jPlayer.status.paused) {
								
								$(this).jPlayer("pause");
								
								//$("#master_jplayer").jPlayer("play",endPoint-.3);
								//alert(endPoint+.3);
								
								//$("#master_jplayer").jPlayer("play");
																
								//alert(t.endPoint,event.jPlayer.status.paused);
								
							}							
							
						},
						ended: function() { // If short clip, trigger master player to start again
							llc.status('video slide ended');
							//console.log('video slide ended');
//							if (endPoint) $("#master_jplayer").jPlayer("play",endPoint+.3);
//							else {
//								$("#master_jp_container .jp-play").show();
//								$("#master_jp_container .jp-pause").hide();
//							}

						},
						swfPath: "flash",
						supplied: videoTypes.supplied, 
						cssSelectorAncestor: "#"+t.id,
						loop: false,
						size: {
							width: "100%",
							height: "100%",
							cssClass: "full"
						}, 
						//errorAlerts: true,
						//fullScreen : true,
						//autohide: {full:false},
						solution:"html, flash",
						wmode:'transparent'
					});
			  	}
			}
		});
		
		/* ##########################################
		  ################# Create Bookmarks
		 ########################################## */

		$(bookmarks.bookmark).each(function(index){

			var t=this;
			var bmStart = parseInt(t.startPoint);
			var slideStart = 0;
			var i = 0;
			var xml = llc.pres.media.items.item;
			if(xml.length==undefined){var xmllen = 1;}else{var xmllen = xml.length;}
			if(xmllen==1){
			var filename = (xml.files.file.constructor.toString().indexOf('Array') != -1) ? xml.files.file[0] : xml.files.file;
			var title = xml.title;
			}else{
			var maxloops = xmllen-1;
			while(slideStart <= bmStart && i <= maxloops){
			var slideStart = llc.pres.media.items.item[i].startPoint;
			i = i+1;
			}
			i = (i<1) ? 1 : i-1;
			var filename = (xml[i-1].files.file.constructor.toString().indexOf('Array') != -1) ? xml[i-1].files.file[0] : xml[i-1].files.file;
			var title = xml[i-1].title;
			}
			llc.createThumbPanel(filename, t.id, bmStart, title, '#tabs_bookmarks', '');
		});
		
		
		
		/* ##########################################
		  ################# Create Blurbs
		 ########################################## */
		 
		var bct = $(blurbs).length;
		if(bct > 0){
		$(blurbs).each(function(i){
			$('<p class="transcript" id="s'+this.startPoint+'">'+this.text.toString()+'</p>').appendTo("#tabs_transcripts")
		});
		}else{
		$('<div id="noTranscript"><p>Transcript is unavailable or does not exist.</p></div>').appendTo("#tabs_transcripts")
		}
		
		/* ##########################################
		  ################# Create Notes
		 ########################################## */
		 
		$("#note_pad").prepend(notes.replace('<br />', '\n'));
		
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
				
		 
		 
		/* ##########################################
		  ################# Setup tool tips
		 ########################################## */
		 
	},
	createMarkup: function(obj) {
	
		if (this.pres.media.master.item === obj) {
			
			/* ##########################################
			  ################# Master Markup
			 ########################################## */
			
			markup = '<div id="llc_playerFrame" class="playerFrame inline">\
			    <div id="media">\
			      <div id="slides"></div>\
				  <div id="master_jplayer" class="jp-jplayer"></div>\
				</div>\
				<div id="master_jp_container" class="jp-audio">\
					<div class="jp-type-single">\
						<div class="jp-gui jp-interface">\
							<ul class="jp-controls">\
								<li><a href="javascript:;" class="jp-play" tabindex="1" title="play"><span>play</span></a></li>\
								<li><a href="javascript:;" class="jp-pause" tabindex="2" title="pause"><span>pause</span></a></li>\
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
								<li><div style="right:2px; bottom:41px;" class="response_box">Bookmark Saved!</div><a href="javascript:;" onclick="llc.saveBookmark(this)" class="llc-bookmark" tabindex="5" style="z-index:3344" title="bookmark">bookmark</a></li>\
								<li><a href="javascript:;" class="llc-full" tabindex="6" title="full">full</a></li>\
							</ul>\
							<div class="jp-title"><span id="titleIntroText">Viewing</span>: '+llc.pres.title+'</div>\
						</div>\
						<div class="jp-no-solution">\
							<span>Update Required</span>\
							To play the media you will need to either update your browser to a recent version or update your <a href="http://get.adobe.com/flashplayer/" target="_blank">Flash plugin</a>.\
						</div>\
					</div>\
				</div>\
				<div id="pres_info">\
					<div id="ad_sponsored" style=""><div style="float:left; margin-right:3px;">Sponsored By: </div><div id="ad_sponsored_box"><!--<img src="images/player/sponsor-AD.png" alt="IBM" />--></div></div>\
					<p style="display:block" id="pres_title"><strong>Title:</strong> <span></span></p>\
					<p style="display:block" id="pres_presenter"><strong>Presenter(s):</strong> <span></span></p>\
					<p style="display:block" id="pres_date"><strong>Date:</strong> <span>There is no date in xml</span></p>\
					<div style="left:349px; top:35px; background-color:transparent;" class="response_box">Rating Saved!</div><div id="ratings_box" class="ratingsBox"></div>\
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
							<div class="notesSubmitBox" style="position:relative;"><div style="right:8px; top:-15px; color:#000000; background-color:transparent;" class="response_box">Notes Saved!</div>\
							<table style="width:100%;"><tr><td><p class="">Keep track of the presentation\'s key points here.</p></td>\
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
	createThumbPanel: function(img,id,startPoint, title, pageid, toc_id) {
		//console.log('createThumbPanel');
		var thumbFileType = img.substring(img.lastIndexOf('.')+1);
		if(thumbFileType in {'flv':'', 'webm':'','m4v':''}) {
		var img = 'images/player/video-icon.png';
		}
		/* ##########################################
		  ################# Add thumbnail to document
		 ########################################## */
		var friendlyStartTime = milliConvert(startPoint);
		var title = truncate(title, 40);
		var title = htmlEntities(title);
		var prefix = pageid.substr(1, pageid.length);
		var bmaction = (prefix=='tabs_bookmarks') ? 'remove' : 'add';
		var bmset = (prefix=='tabs_bookmarks') ? ' bookmark-set' : '';
		var thumbRel = (toc_id.length > 0) ? 'rel="'+toc_id+'"' : 'rel=""';
		if(prefix=='tabs_bookmarks'){
		var numBMs = ($('#tabs_bookmarks .toc_thumb').length)+1;
		var bmword = (numBMs == 1) ? 'bookmark' : 'bookmarks';
		$('div#noBookmarks p').html(numBMs + ' '+bmword+' saved');
		}
		$('<div '+thumbRel+' class="toc_thumb" id="'+prefix+'_thumb_'+id+'"><div onclick="slideJump('+((startPoint/1000)+.3)+')" class="playIcon"></div>\
			<a href="javascript:;" onclick="slideJump('+((startPoint/1000)+.3)+')">\
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
		//llc.status('timeUpdate');
		
		/* ##########################################
		  ################# Time Update Functions
		 ########################################## */
		
		var timeNow = event.jPlayer.status.currentTime,
			curEl = llc.pres.curEl || llc.pres.media.items.item[0] || llc.pres.media.items.item,
			curBlurb = llc.pres.transcript.blurb == undefined ? undefined : llc.pres.curBlurb || llc.pres.transcript.blurb[0];
			llc.pres.curEl = llc.pres.curEl || undefined;
			llc.pres.curBlurb = llc.pres.curBlurb || undefined;
		
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
		
		// Is there a Video slide when seeking 
		if ((llc.status.media=='video slide play' || llc.status.media=='video slide paused') && event.jPlayer.status.paused) {

			if ($("#"+curEl.id).is('.active')) {
				// scrubbing within video script
				$("#jquery_jplayer_"+curEl.id).jPlayer("play",timeNow-(curEl.startPoint/1000));
			} else {
				// que master player
				$("#master_jplayer").jPlayer("play");
			}
			
		}
		
		// Should we do anything with slides?
		if (llc.pres.curEl != curEl) {
						
			//console.log('changed slide');
			
			// Set global curEl
			llc.pres.curEl = curEl;
			
			// Show/Hide slides
			$("#"+curEl.id).show().removeClass('active').addClass('active');
			$("#"+curEl.id+".jp-video").width('100%').height('100%')
			$("#slides .jp-video").not("#"+curEl.id).width(0).height(0).removeClass('active'); // 0 out the jPlayer as hiding disables the flash instance
			$("#slides .slide").not("#"+curEl.id+", .jp-video").hide().removeClass('active');
						
			// Play/Pause video slide
			if (curEl.files.file[1].fileType!="jpg" && curEl.files.file.fileType!="jpg") {
			
				// Activate video slide
				$("#master_jplayer").jPlayer("pause");
				$("#jquery_jplayer_"+curEl.id).jPlayer("play",timeNow-(curEl.startPoint/1000));
				$("#master_jp_container .jp-pause span").click(function() {
					$("#jquery_jplayer_"+curEl.id).jPlayer("pause");
					return false;
				});
				$("#master_jp_container .jp-play span").click(function() {
					$("#jquery_jplayer_"+curEl.id).jPlayer("play");
					return false;
				});
				
				llc.pres.curElisVideo = true;
				
			} else { 
				
				// Restart master player 
				if (llc.pres.curElisVideo) {
					
					//console.log('restart master player',timeNow);
					llc.pres.curElisVideo = false;
					
					// Stop active video
					//$("#slides .jp-jplayer").jPlayer("pause");
					$("#master_jp_container .jp-pause span, #master_jp_container .jp-play span").unbind('click');
					
					
					$("#master_jp_container .jp-play").hide();
					$("#master_jp_container .jp-pause").show();
					
				}
				
				
			}
						
			// update TOC, Title and scroll to current thumb
			var introTxt = (llc.pres.previewMode=='False' || llc.pres.previewMode==undefined) ? 'Viewing' : 'Preview Mode',
				slideNum = llc.pres.media.items.item.length ? (llc.pres.media.items.item.findIndex(curEl)+1)+"/"+llc.pres.media.items.item.length : '1/1' ;
				
			$("#master_jp_container div.jp-title").text(introTxt+":  Slide "+slideNum+" - "+curEl.title);
			
			if((llc.pres.embededMode=='False' && llc.pres.previewMode=='False') || (llc.pres.previewMode==undefined)){
			
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
		}
		
		// Should we do anything with Blurbs?
		if (llc.pres.curBlurb != curBlurb && curBlurb != null && !llc.pres.previewMode=='True') {
			
			// Set global curBlurb
			llc.pres.curBlurb = curBlurb;
			
			// update Transcript to current blurb
			$("#tabs_transcripts p").removeClass('active').filter('#s'+curBlurb.startPoint).addClass('active');
			var pos = document.getElementById('s'+curBlurb.startPoint).offsetTop;
				pos -= 140;
			$("#tabs_transcripts").animate({scrollTop: pos}, 300);
			
		}
		
		// Normal or Preview mode	
		if ((llc.pres.embededMode=='False' && llc.pres.previewMode=='False') || (llc.pres.previewMode==undefined)){
		
			// Update seatTime
			if(!event.jPlayer.status.paused) llc.seatTime('update');
		
		} else {
			
			//is preview or embed mode
			if(llc.pres.previewMode=='True'){
				
				//var htmltest = '<div>'+event.jPlayer.status.currentTime+'</div><div>'+llc.pres.demoLength+'</div><div>'+llc.pres.demoStartPoint+'</div>';
				var timeNow = event.jPlayer.status.currentTime,
					demoStop = parseInt(llc.pres.demoStartPoint) + parseInt(llc.pres.demoLength),
					demoStart = parseInt(llc.pres.demoStartPoint),
					msg = '<div class="previewNotification">YOUR PREVIEW SESSION HAS EXPIRED<BR><BR><TABLE style="width:390px; margin-left:auto; margin-right:auto;"><TR><TD><img src="images/player/previewmode-lock.png" /></TD><td style="width:15px;"></td><TD style="text-align:left;"> Please acquire to unlock<br />remaining content.</TD></TR></TABLE></div>';
				
				if(timeNow > demoStop){
					$("#master_jplayer").jPlayer("pause", demoStart);
					$('div#media').prepend(msg);
					
					$('div#media').find('div.previewNotification').delay(4000).fadeOut('slow', function(){
						$('div#slides').find('div.previewNotification').remove();
					});
				}
				
				if(timeNow < demoStart){
					$("#master_jplayer").jPlayer("play", demoStart);	
				
				}
				
			}
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
				
		if ((event && curMode == "Full Window") || mode == "Dual Screen") { // Do Dual Screen
			llc.status('dual screen view');
			//console.log('dual view fired');
			m.addClass("dual").removeClass("single");
			s.addClass("dual").removeClass("single");
			// if full screen
			if ($("#llc_playerFrame").is(".Full")) {
				// Do for full screen for above 8x3 (2 wide 4x3) ratio, probably not any screens that are longer than 8x3 ratio 
				var mar = ((h-50)-((w*0.49)*0.75))/2;
				s.css({marginTop:mar, marginBottom:mar, marginLeft:0, marginRight:0, height:'auto'}); 
				m.css({marginTop:mar, marginBottom:mar, marginLeft:0, marginRight:0, height:s.height()});
			}
			llc.switchView.curMode = "Dual Screen"; // End with	
		} else if ((event && curMode == "Dual Screen") || mode == "Full Window") { // Do Single Screen
			llc.status('single screen view');
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
					$("#llc_playerFrame").find(".single").css({marginLeft:mar, marginRight:mar});
				}
				if (s.is(".single")) m.height(0), s.height("auto");
				else s.height(0), m.height("auto");
			} else {
			}
			
			llc.switchView.curMode = "Full Window"; // End with
		
		}
		
	},
	seatTime: function(method) { /* Seat time tracking = llc.seatTime('update') and llc.saving seatTime('save') */
		//console.log('seatTime');
		if (method=='update'){
			
			llc.seatTime.time = llc.seatTime.time != undefined ? llc.seatTime.time + 250 : 0 ;
			
			if (llc.seatTime.time != 0 && llc.seatTime.time % 60000 == 0) llc.seatTime('save');   
			
		} else if (method=='save') {
			llc.status('saved seat time');
			var netSessionID = $('input#session_id').val(), 
				presentationID = llc.pres.id, 
				userID = $('input#user_id').val(),
				siteID = $('input#site_id').val(),
				timeID = llc.seatTime.time,
				ID = llc.seatTime.ID ? llc.seatTime.ID : -1,
				params = 'timeID=' + ID + '&netSessionID=' + netSessionID + '&userID=' + userID + '&siteID=' + siteID + '&presentationID=' + presentationID;
			
			$.ajax({
				url: 'saveSeatTime.aspx',
				data: params,
				success: function(data) {
					if(!llc.seatTime.ID && data) {
						llc.seatTime.ID = data.split('&')[0].substr(3);
					}
				}
			});	
			
		}
		
	
	},
	saveBookmark: function(item) {
	/* Setup bookmarks for TOC and control bar - is either attached to toc-bookmark (no param) or can be called onclick for control bar (param = this) */
		//console.log('saveBookmark');
		if (typeof item === "undefined"){
				//has been called on init and is attaching to the toc-bookmark links
				$('a.toc-bookmark').live('click', function(){
				var timePoint = $(this).attr('rel');
				var title = $(this).attr('title');
				var netSessionID = $('input#session_id').val(), 
				presentationID = llc.pres.id, 
				userID = $('input#user_id').val(),
				siteID = $('input#site_id').val();
				if($(this).hasClass('bookmark-set')){
						//remove bookmark
						var thumbtype = $(this).parents('div.toc_thumb').attr('id');
						if(thumbtype.indexOf('tabs_bookmarks')==0){
						//this click came from the bookmarks section
						var slideID = $(this).parents('div.toc_thumb').attr('rel');
						}else{
						//this click came from the overview section
						var slideID = $(this).parents('div.toc_thumb').attr('id').substr($(this).parents('div.toc_thumb').attr('id').lastIndexOf('_')+1, $(this).parents('div.toc_thumb').attr('id').length);
						}
							if(slideID.length > 0){
							var slideCellElm = 'div#toc_thumb_'+slideID;
							var curImgSrc = $(slideCellElm).find('img.toc_thumb_img').attr('src');
							$(slideCellElm).find('div.bmThumbFlag').fadeOut('slow', function(){
							$(slideCellElm).find('div.bmThumbFlag').remove();
							});
							var currentIconSrc = $(slideCellElm).find('a.toc-bookmark').find('img').attr('src');
							$(slideCellElm).find('a.toc-bookmark').find('img').attr('src', currentIconSrc.replace('_remove', '_add'));
							$(slideCellElm).find('a.toc-bookmark').removeClass('bookmark-set');
							}
							
							
						var elmsel = 'a.toc-bookmark[rel^='+timePoint+']';
						var elm = $('div#tabs_bookmarks').find('div.toc_thumb').find(elmsel);
						var parent_id = $(elm).parents('div.toc_thumb').attr('id');
						bmid = parent_id.substr((parent_id.lastIndexOf('_')+1), parent_id.length);
						$('div#'+parent_id).remove();
						var numBMs = ($('#tabs_bookmarks .toc_thumb').length);
						if(numBMs==0){
						$('div#noBookmarks p').html('Your bookmarks folder is currently empty.');
						}else{
						var bmword = (numBMs == 1) ? 'bookmark' : 'bookmarks';
						$('div#noBookmarks p').html(numBMs + ' '+bmword+' saved');
						}
						
				var params = 'title='+title+'&netSessionID='+netSessionID+'&timePoint='+timePoint+'&userID='+userID+'&siteID='+siteID+'&presentationID='+presentationID+'&bookmarkID='+bmid;
				var script_url = 'delBookmark.aspx';
				/* start ajax */
				$.ajax({
		  		url: script_url,
				data: params,
		  		success: function(data) {
		var debugCheck = urlParse('debug');
		if(debugCheck=='y'){
			alert(data);
		}
				}
				});	
				/* end ajax */
				}else{
						//add new bookmark
						var slideID = $(this).parents('div.toc_thumb').attr('id').substr($(this).parents('div.toc_thumb').attr('id').lastIndexOf('_')+1, $(this).parents('div.toc_thumb').attr('id').length);
						var slideCellElm = 'div#toc_thumb_'+slideID;
						var curImgSrc = $(slideCellElm).find('img.toc_thumb_img').attr('src');
						$(slideCellElm).prepend('<div class="bmThumbFlag"></div>');
						var currentIconSrc = $(slideCellElm).find('a.toc-bookmark').find('img').attr('src');
						$(slideCellElm).find('a.toc-bookmark').find('img').attr('src', currentIconSrc.replace('_add', '_remove'));
						$(slideCellElm).find('a.toc-bookmark').addClass('bookmark-set');
						
				var params = 'title='+escape(title)+'&netSessionID='+netSessionID+'&timePoint='+timePoint+'&userID='+userID+'&siteID='+siteID+'&presentationID='+presentationID + '&bookmarkID=-1';
				var script_url = 'addBookmark.aspx';
				/* start ajax */
				$.ajax({
		  		url: script_url,
				data: params,
		  		success: function(data) {
		var debugCheck = urlParse('debug');
		if(debugCheck=='y'){
			alert(data);
		}
				var responseVals = data.split('&');
				var newbmid = responseVals[0].substr(3);
				llc.createThumbPanel(curImgSrc,newbmid,timePoint, title, '#tabs_bookmarks', slideID);
				}
				});	
				/* end ajax */
				}
				});//END TOC CLICK HANDLER
		}else{
		if(llc.pres.previewMode === 'True' || llc.pres.embededMode === 'True'){return false;}
		
				//add new bookmark - called by media player onclick
				var timePoint = ($("#master_jplayer").data("jPlayer").status.currentTime)*1000;
				var curEl = llc.pres.curEl || llc.pres.media.items.item;
				
				var title = llc.pres.curEl.title;
				var slideID = llc.pres.curEl.id;
				var slideCellElm = 'div#toc_thumb_'+slideID;
				var curImgSrc = $(slideCellElm).find('img.toc_thumb_img').attr('src');

				var script_url = 'addBookmark.aspx', 
				netSessionID = $('input#session_id').val(), 
				presentationID = llc.pres.id, 
				userID = $('input#user_id').val(), 
				siteID = $('input#site_id').val();
				var params = 'title='+escape(title)+'&netSessionID='+netSessionID+'&timePoint='+timePoint+'&userID='+userID+'&siteID='+siteID+'&presentationID='+presentationID+'&bookmarkID=-1';
				//alert(params);
				$(item).siblings('div.response_box').animate({top: '-=11px', opacity: '1'}, {duration:500, complete:function(){
					$(this).delay(1200).animate({opacity:0});
					}
				});
			
				/* start ajax */
				$.ajax({
		  		url: script_url,
				data: params,
		  		success: function(data) {
		var debugCheck = urlParse('debug');
		if(debugCheck=='y'){
			alert(data);
		}
				var responseVals = data.split('&');
				var newbmid = responseVals[0].substr(3);
				llc.createThumbPanel(curImgSrc,newbmid,timePoint, title, '#tabs_bookmarks', '');
				
				}
				});	
				/* end ajax */
		}//end media player onclick
   

	},
	saveRating: function(num) { /* Postback rating to server */
		//console.log('saveRating');
		/* ##########################################
		  ################# Post rating to server, locks stars, notify user
		 ########################################## */
        var curSessionID = $('input#cur_session_id').val();
        var hasRated = llc.getCookie('llc-' + curSessionID + '|rated');
		var curRating = (llc.pres.ratingAverage) ? llc.pres.ratingAverage : 0;
        if (!hasRated) {
            $('#ratings_box').ratings(5, curRating).bind('ratingchanged', function(event, data) {
                var newRating = data.rating,
                      netSessionID = $('input#session_id').val(),
                      userID = $('input#user_id').val(),
                      siteID = $('input#site_id').val();
                var params = 'value=' + newRating + '&netSessionID=' + netSessionID + '&userID=' + userID + '&siteID=' + siteID + '&sessionID=' + curSessionID + '&id=-1';
                $.ajax({
                    url: 'saveRating.aspx',
                    data: params,
                    success: function(data) {
                        var debugCheck = urlParse('debug');
                        if (debugCheck == 'y') {
                            alert(data);
                        }
                        llc.setCookie('llc-' + curSessionID + '|rated', newRating);
                    }
                });

		
				$('#ratings_box').siblings('div.response_box').animate({top: '-=5px', opacity: '1'}, {duration:500, complete:function(){
					$(this).delay(1200).animate({opacity:0});
					}
				});
				
			});
		
			
		 }else{
		$('#ratings_box').ratings(5, curRating);
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
		var params = 'note='+escape(note)+'&netSessionID='+netSessionID+'&userID='+userID+'&siteID='+siteID+'&presentationID='+presentationID+'&id=-1';
		/* start ajax */
		$.ajax({
  		url: 'saveNotes.aspx',
		data: params,
  		success: function(data) {
		var debugCheck = urlParse('debug');
		if(debugCheck=='y'){
			alert(data);
		}
		
		}
		});	
		/* end ajax */
		
				$(this).parents('div.notesSubmitBox').find('div.response_box').animate({top: '-=7px', opacity: '1'}, {duration:500, complete:function(){
					$(this).delay(1200).animate({opacity:0});
					}
				});
		});
		
		
		// postback to server 
	},
	previewEmbedSetup: function(){
	
		 var embedCheck = llc.pres.embededMode, previewCheck = llc.pres.previewMode;
				if(previewCheck){
				$('span#titleIntroText').html('Preview Mode');
				$('#master_jp_container .llc-next').addClass('llc-next-disabled');
				$('#master_jp_container .llc-prev').addClass('llc-prev-disabled');
				$('#master_jp_container .llc-prev, #master_jp_container .llc-next, #master_jp_container .llc-bookmark').unbind('click');
				$('#master_jp_container .llc-prev, #master_jp_container .llc-next').attr('title', 'disabled');
				}
				
				$("#master_jp_container .llc-bookmark").addClass('llc-bookmark-disabled');
				$('div#info_tabs').remove();
				$('"ul.jp-controls li a.llc-bookmark"').attr('title', 'disabled');
				$('"ul.jp-controls li a.llc-bookmark"').unbind('click');
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
	position: function() { /* Position the player */
		var con = llc.position.con = llc.position.con ? llc.position.con : $("#llc_container"),
		frm = llc.position.frm = llc.position.frm ? llc.position.frm : $("#llc_playerFrame"),
		left = con.offset().left, 
		top = llc.position.top = llc.position.top ? llc.position.top : con.offset().top;  
		
		frm.css({
			'top':(top+5+'px'),
			'left':(left+8+'px')
		});
	},
	tosAgreed: function() {
	$('div.lightbox_overlay').fadeOut();
	$('div.lightbox_content').fadeOut();
	var agreeLink = llc.pres.agreements.agreement.acceptLink;
		if(agreeLink.length > 0){
		var winame = Math.floor(Math.random()*1001);
		var newind = window.open(agreeLink,winame);
		}
	},
	tosDecline: function() {
	var declineLink = llc.pres.agreements.agreement.declineLink;
	window.location = declineLink;
	},
	switchFull: function(val) { /* Get playback cookie */
		//console.log('trigger full screen');
		
		var val = val; 
		
		if (val==true) { 
			llc.status('full screen');
		/* ##########################################
		  ################# Go Full
		 ########################################## */
		 		 	
		 	// Resize Progress bar and disable scrolling
			$(window).unbind('resize').resize(function() {
				
				var w = $("#llc_playerFrame").width();

				$("#master_jp_container .jp-progress").width(w-222);
				
				llc.switchView(false,llc.switchView.curMode);
				
				scroll(0,0);
				
				//alert("RESIZED");
				
			}).scroll(function (event) { 

				if ($(this).scrollTop()>0 || $(this).scrollLeft()>0) {
					scroll(0,0); // Prevent scrolling in full screen
				}

			});
				
		 	// on orientation change update
		 	window.onorientationchange = function() {
		 		$(window).trigger('resize');
		 	}	
		 	
		 	// Update elements
		 	$("#pres_info, #info_tabs").hide();
		 	$("body, div.playerFrame").addClass("Full").removeClass("inline");
		 	$(window).trigger('resize');
		 		
			$("#master_jp_container a.llc-full").addClass('active')
			
			if(!$.jPlayer.platform.tablet && !$.jPlayer.platform.mobile) {
				$("#master_jp_container a.llc-full").tipTip({content: "normal", maxWidth: "auto", edgeOffset: 2, defaultPosition:'top'});
			}
			
			// $("#master_jplayer").jPlayer("option", {"fullScreen": true}); // not needed with 100% size option
						
		
		} else if (val==false) {
		
			llc.status('normal screen');
		/* ##########################################
		  ################# Back to Normal
		 ########################################## */
			
			$("body, div.playerFrame").removeClass("Full").addClass("inline");
			$("#master_jp_container div.jp-progress, #master_jplayer, #slides").attr('style','');
			$("#pres_info, #info_tabs").show();
			
			$(window).unbind('resize').unbind('scroll').resize(function() { llc.position() });
						
			$("#master_jp_container a.llc-full").removeClass('active')
			
			if(!$.jPlayer.platform.tablet && !$.jPlayer.platform.mobile) {
				$("#master_jp_container a.llc-full").tipTip({content: "full", maxWidth: "auto", edgeOffset: 2, defaultPosition:'top'});
			}
			
			// ("#master_jplayer").jPlayer("option", {"fullScreen": false});
		}
		 
	},
	fileTypes: function(item) {
		var f = item,
			fileTypes = { files: { poster:f.poster } };
		if (f.files.file.fileType == 'mp3') {
			fileTypes.supplied = f.files.file.fileType;
			fileTypes.files[f.files.file.fileType] = f.files.file.text;
		} else {
			if (f.files.file.fileType) {
				fileTypes.supplied = f.files.file.fileType ;
				fileTypes.files[f.files.file.fileType] = f.files.file.text;
			} else {	
				for (i in f.files.file) { 
					if (f.files.file[i].fileType) fileTypes.supplied = fileTypes.supplied ? fileTypes.supplied+','+f.files.file[i].fileType : f.files.file[i].fileType , 
					fileTypes.files[f.files.file[i].fileType] = f.files.file[i].text;
				}						
			}					
		}
		return fileTypes
	},
	init: function() { /* serialize xml and call functions, assumes llc-player.js is called after markup */
	
		 
        if (document.domain.indexOf('dropbox') != -1 || document.domain.indexOf('localhost')!=-1 || document.domain.indexOf('frntnd')!=-1) {

            // Use test data
            var url = 'sample-3.xml';

        } else {

            // Use live data
            var presentationID = $('input#pres_id').val(),
			curSessionID = $('input#cur_session_id').val(),
			userID = $('input#user_id').val(),
			siteID = $('input#site_id').val();
            var url = 'playerPresentationDatasource.aspx?PID=' + presentationID + '&SID=' + curSessionID + '&UID=' + userID;
			
		}
				
		var showPathCheck = urlParse('showpath');
		if(showPathCheck=='y'){
			alert(url);
		}
		var manualSourceCheck = urlParse('source');
		if(manualSourceCheck.length > 1){
			var url = manualSourceCheck;
		}
		// Set loading
		$('<div id="loading"></div>').appendTo("#llc_container");
		
		
		// Serialize XML and set llc.pres object
		$.get(url, function(xml){ 
		 
			llc.pres = $.xml2json(xml); 
			
			//TOS Agreement verification			
			if(llc.pres.agreements != undefined && llc.pres.agreements.agreement != undefined ){
			var tosHTML = '<div class="lightbox_overlay"></div>\
							<div class="lightbox_content">\
							<h1>'+llc.pres.agreements.agreement.name+'</h1>\
							<div class="inner">'+llc.pres.agreements.agreement.text+'</div>\
							<div class="toc_controls"><button onclick="llc.tosAgreed()">'+llc.pres.agreements.agreement.acceptText+'</button><button onclick="llc.tosDecline()">'+llc.pres.agreements.agreement.declineText+'</button></div>\
							</div>';
							
			$("body").prepend(tosHTML);
			$('div.lightbox_overlay, div.lightbox_content').fadeIn();
			}


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
			
			/*if (llc.pres.legacy) { // LEGACY
				
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
			*/ 
			
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

					llc.position();

					llc.position.con.height(llc.position.frm.height());
					 
				}).trigger('resize');
				
				// Link playerframe resize on window resize
				$(window).resize(function(){llc.position()});
					
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
					
					if (!llc.loaded) {
					
						window.clearInterval(window.loader);
						window.clearTimeout(window.loaderFail);
						$("#loading").remove();
						$("#llc_playerFrame").css('height','auto');
						$("#llc_playerFrame").trigger('resize');
						
						/* Set up ad */
						if (!document.phpAds_used) document.phpAds_used = ',';
						phpAds_random = new String (Math.random()); phpAds_random = phpAds_random.substring(2,11);
						
						adjs = "//content.multiview.com/adjs.php?n=" + phpAds_random;
						adjs += "&what=zone:"+llc.pres.sponsorZoneId+"&target=_blank&block=1";
						adjs += "&exclude=" + document.phpAds_used;
					if ($.jPlayer.platform.tablet || $.jPlayer.platform.mobile) {
						var randomString = Math.round(Math.random() * 555955);
						var manualUrl = "<a href='http://content.multiview.com/adclick.php?n="+randomString+"' target='_blank'>";
						manualUrl = manualUrl + "<img src='http://content.multiview.com/adview.php?what=zone:"+llc.pres.sponsorZoneId+"&n="+randomString+"' border='0' alt='' /></a>";
						var defaultAd = '<a href="http://multiview.com/multiview_media.html" target="_blank" style="display:block; height:60px;"></a>';
						   $("#ad_sponsored_box").html(manualUrl || defaultAd);
					}else{	
						$.getScript(adjs, function(){
							var defaultAd = '<a href="http://multiview.com/multiview_media.html" target="_blank" style="display:block; height:60px;"></a>';
						   $("#ad_sponsored_box").html(phpadsbanner || defaultAd);
						});
								
								}
						
						llc.loaded = true;
					}
					
				}
				window.loader = window.setInterval(loading, 100);
				window.loaderFail = window.setTimeout(clearLoading, 20000); // loader fail safe 20 sec


				/* ######## Initialize Master jPlayer */
				
				var f = llc.fileTypes(llc.pres.media.master.item);
				
				$("#master_jplayer").jPlayer({
					ready: function (event) {
						var files = JSON ? JSON.stringify(f.files) : 'N/A';
						llc.status('master ready, files: '+files);
				    	$.jPlayer.timeFormat.showHour = true; // set show hours
	
				    	$(this).jPlayer("setMedia", f.files);
				    	
				    	/* Set playback if cookied */
				    	//var playhead = llc.getCookie((llc.pres.viewer.id || Math.floor(Math.random()*1000))+llc.pres.id+'playhead') ||  0;
				    	//$(this).jPlayer("pause", Math.abs(playhead));
				    	
				    	/* Set volume if cookied */
				    	//var volCookie = llc.getCookie((llc.pres.viewer.id || Math.floor(Math.random()*1000))+llc.pres.id+'volume');
				    	//llc.perVolume =  volCookie ? parseFloat(volCookie) : 0.8;
				    	//$(this).jPlayer("volume", llc.perVolume);
				    	
				    	/* Disable volume button if noVolume object hides volume bar (iPad) */
				    	if($("#master_jp_container .jp-volume-bar").is(':hidden')) {
				    		$("#master_jp_container .jp-volume").unbind('click').unbind('hover').addClass('inactive');
				    	}
				    	$(this).jPlayer("pause",0);
				    },
				    play: function() { // To avoid both jPlayers playing together.
				    	llc.status({media:'master playing'});
				    	$(this).jPlayer("pauseOthers");
				    },
				    pause: function() { 
				    	llc.status({media:'master paused'});
				    },
				    timeupdate: function (event) { // Set/Show Current time/Slide function
				    	llc.timeUpdate(event);   	
				    },
				    seeking: function (event) {
				    	llc.status('master seeking');
				    	//$(this).jPlayer("pauseOthers");
				    	llc.pres.curEl = undefined;
				    	//console.log(event.jPlayer.status.currentTime);
				    },
				    ended: function() {
				    	llc.status('master ended');
				    	llc.seatTime('save');
				    },
				    volumechange: function(event) { // make sure volume dragable moves on click
				    	llc.status('volume changed');
				    	var t = $("#master_jp_container div.jp-volume-bar-value"),
				    		bottom = t.height(),
				    		height = t.parent().height(),
				    		top = height-bottom;
				    	t.prev().css("top",top);	
				    	llc.perVolume = t.attr('style').slice(8,-3) / 100;
				    	if (llc.perVolume == 0) t.parents('div.jp-volume').addClass('mute');
				    	else t.parents('div.jp-volume').removeClass('mute');
				    },
				    // noVolume: { chrome: /chrome/ },
				    verticalVolume: true,
				    preload: "auto",
				    swfPath: "flash",
				    supplied: f.supplied, // Assumes mp3 or native jPlayer video format
				    cssSelectorAncestor: "#master_jp_container",
				    loop: false,
				    size: {
				    	width: "100%",
				    	height: "100%",
				    	cssClass: "full"
				    }, 
				    fullScreen : true,
				    autohide: {full:false},
				    //errorAlerts: true,
				    solution:"flash, html",
				    wmode: (llc.pres.media.master.item.fileType != 'mp3' ? 'transparent' : 'window') // use window for audio and transparent for video
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
				
				
				// Switch view event handler 
				$("<span class='switchView'></span>").appendTo("#master_jplayer");
				$("span.switchView").click(function(event){
					llc.switchView(event,false);
				});
				
				
				/* ######## MISC */
				
				// Set presentation info
				$("#pres_title span").text(llc.pres.title);
				
				// Set speakers
				$("#pres_presenter span").text((function(){
					var spks
					for (i in llc.pres.speakers.speaker) {
						var s = llc.pres.speakers.speaker[i];
						if (s.firstName) spks = llc.pres.speakers.speaker.length > 1 && s != llc.pres.speakers.speaker[0] ? spks + ', '+ s.firstName + " " + s.lastName :  s.firstName + " " + s.lastName ;
					} 
					spks = spks ? spks : 'N/A' ;
					return spks
				})());
				
				// Set Date
				$("#pres_date span").text((llc.pres.date || 'N/A'));
				
				// Set playback value in Cookie on quit
				$(window).bind('beforeunload', function() {
					llc.setCookie((llc.pres.viewer.id || Math.floor(Math.random()*1000))+llc.pres.id+'playhead', $("#master_jplayer").data("jPlayer").status.currentTime);
					llc.setCookie((llc.pres.viewer.id || Math.floor(Math.random()*1000))+llc.pres.id+'volume', llc.perVolume);
				});
				
				// Set defualt view
				llc.switchView(false,llc.pres.defaultInterface.text);

				//check preivew mode - setup helper functions
				if((llc.pres.embededMode=='False' && llc.pres.previewMode=='False') || (llc.pres.previewMode==undefined)){
				llc.saveRating();
				llc.saveNote();
				llc.saveBookmark();
				llc.setupSlideMagnify();
				}else{
				llc.previewEmbedSetup();
				}
				
				// Add tool tips if non-mobile or tablet 
				if(!$.jPlayer.platform.tablet && !$.jPlayer.platform.mobile) {
					$("ul.jp-controls li a").not('a.llc-bookmark').tipTip({maxWidth: "auto", edgeOffset: 2, defaultPosition:'top'});
					$("ul.jp-controls li a.llc-bookmark").tipTip({maxWidth: "auto", edgeOffset: 2, defaultPosition:'bottom'});
				}
				
				llc.disableRightClick();
				
				
			/* commented else on legacy	
			}
			*/
		}); // end ajax XML call
	}
} 

/* MISC FUNCTIONS - MOVE OUT OR DELETE LATER ************/

 /******************* PRINT_R IS NEAT ***********/
 // You can access the js object in your browser console so you don't really need this ...
 // Isn't this a PHP function name ? ;) 
 // Yes, and in PHP land print_r is your best buddy...
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

function secondsToTime(secs) {

    var hours = Math.floor(secs / (60 * 60)),
    	divisor_for_minutes = secs % (60 * 60),
    	minutes = Math.floor(divisor_for_minutes / 60),
    	divisor_for_seconds = divisor_for_minutes % 60,
    	seconds = Math.ceil(divisor_for_seconds);
   
   minutes = minutes > 9 ? minutes : '0'+minutes;
   seconds = seconds > 9 ? seconds : '0'+seconds;
   
    var obj = {
        "h": hours,
        "m": minutes,
        "s": seconds
    };
    
    return obj;
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

 /******************* PARSE URL ***********/

function urlParse(parameter) {
  var loc = location.search.substring(1, location.search.length);
  var param_value = false;

  var params = loc.split("&");
  for (i=0; i<params.length;i++) {
      param_name = params[i].substring(0,params[i].indexOf('='));
      if (param_name == parameter) {
          param_value = params[i].substring(params[i].indexOf('=')+1)
      }
  }
  if (param_value) {
      return param_value;
  } else {
      return false;
  }
}



