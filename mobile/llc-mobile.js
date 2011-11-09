
$(document).ready(function() {
initPromoSlideShow();
initSubNavs();
initPageData();
});
  
function initPromoSlideShow(){
  if($('#promo_slideshow').length > 0){
				g_imagesContainer = $('#promo_slideshow').asketicSwipe({
                        cycle           : true,          //Cycle the gallery
                        scale           : 1,              //To streach out low-res images on mobile web (for example same size x2 smaller images)
                        tolerance       : 0.25,           //% of width for next image
                        time            : 300,            //Transition time
                        touchSensitivity: 10,            //Vertical sensitivity,
                        fitContainer    : true,          //scale images to fit container
                        fitContainerMargin: 0,          //px margin if images fitted to container
                        fitContainerUpscale: false       //if upscaled when fitContainer is true
				});
                  $('#next').click(function(){
                        g_imagesContainer.asketicSwipe.next();    
                    });
                
                $('#prev').click(function(){
                        g_imagesContainer.asketicSwipe.prev();    
                    });
  }
}

function initSubNavs(){

	$('.subnav_btn').live('click', function(){
		var thisid = $(this).attr('id');
		var viewSection = '#'+thisid.replace('link', 'section');
		$(this).parents('div.page').find('.tab_section').fadeOut();
		$(this).parents('div.page').find(viewSection).fadeIn();
	});
}

/*****************************************************************/
function initPageData(){
$(":jqmData(role='page')").live('pagebeforecreate', function(){
var pageID = $(this).attr('id');
var url = $(this).jqmData("url");

switch(pageID){
case 'home':
alert('home');
break;
/*************************************/
case 'list_view':
//buildListView();
alert('list_view');
break;
/*************************************/
case 'item_view':
itemid = urlParse(url, 'pid');
$('div.two_third_column').find('h1').append(' - id:'+itemid);
break;
/*************************************/
case 'media_player':
alert('media_player');
break;
/*************************************/
case 'cart':
alert('cart');
break;
/*************************************/
case 'checkout':
alert('checkout');
break;
/*************************************/
case 'cpanel':
alert('cpanel');
break;
/*************************************/
}

})
}
function buildListView(){

$.ajax({
  url: 'ajax/test.php',
  success: function(data) {
  
var json = jQuery.parseJSON( data );
var i = 0;
var innerHTML = '';
if(json.length < 1){
innerHTML = '<li">Sorry, no results found.</li>';
}

for(var i=0; i < json.length; i++) {
var itemid = json[i][0], 
    thumbSrc = json[i][1],
    itemTitle = json[i][2],
    conferenceTitle = json[i][3],
    itemDate = json[i][4],
    speakers = json[i][5];
    
innerHTML = innerHTML + '<li><a href="#item_view?pid='+itemid+'">';
innerHTML = innerHTML + '<img class="list_thumb" src="'+thumbSrc+'" />';
innerHTML = innerHTML + '<div class="list_title list_info">'+itemTitle+'</div>';
innerHTML = innerHTML + '<div class="list_location list_info"><b>Conference:</b> <span id="">'+conferenceTitle+'</span></div>';
innerHTML = innerHTML + '<div class="list_date list_info"><b>Date:</b> <span id="">'+itemDate+'</span></div>';
innerHTML = innerHTML + '<div class="list_presenter list_info"><b>Speakers:</b> <span id="">'+speakers+'</span></div>';
innerHTML = innerHTML + '<div class="list_rating list_info"><b>Rating:</b> <span id="" style="">*****</span></div>';
innerHTML = innerHTML + '</a></li>';
  }
  /**/
  }
  });
  
$(this).find('ul#item_list').html(innerHTML);

}

function urlParse(url, parameter) {
  var param_value = false;
  var params = url.split("&");
  for (i=0; i<params.length;i++) {
      param_name = params[i].substring((params[i].indexOf('?')+1),params[i].indexOf('='));
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
