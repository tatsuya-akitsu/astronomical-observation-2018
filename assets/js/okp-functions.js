jQuery("#close").click(function(){
	jQuery("#modal").fadeOut(500,function(){ set_session(); });
	//jQuery("#modal").fadeOut(500);
	return false;
});
function setWidthAndHeight(){
	jQuery("#modal").fadeIn("900", function(){ jQuery(this).css({width: jQuery(window).width(), height: jQuery(window).height()}) });
	if(jQuery(window).width()<=1200){
		if(_ua.Mobile && (jQuery(window).width()<jQuery(window).height()) ){
			var imgW = jQuery(window).width() * 0.95;
		}else{
			var imgW = jQuery(window).width() * 0.8;
		}
		
	}else{
		var imgW = 1000;
	}
	var imgH = imgW * 0.6;
	var top = (jQuery(window).height() - imgH) / 2;
	var left = (jQuery(window).width() - imgW) / 2;
	jQuery("#modal #imgArea").css({width: imgW, height: imgH, top: top, left: left});
}
function set_session(){
	var search_val="no_more_show";
    $.post("../set_session.php", {search_term : search_val}, function(data){ 
	    if (data.length>0){
	        console.log(data);
        }
    });
}
var _ua = (function(u){
  return {
    Tablet:(u.indexOf("windows") != -1 && u.indexOf("touch") != -1 && u.indexOf("tablet pc") == -1) 
      || u.indexOf("ipad") != -1
      || (u.indexOf("android") != -1 && u.indexOf("mobile") == -1)
      || (u.indexOf("firefox") != -1 && u.indexOf("tablet") != -1)
      || u.indexOf("kindle") != -1
      || u.indexOf("silk") != -1
      || u.indexOf("playbook") != -1,
    Mobile:(u.indexOf("windows") != -1 && u.indexOf("phone") != -1)
      || u.indexOf("iphone") != -1
      || u.indexOf("ipod") != -1
      || (u.indexOf("android") != -1 && u.indexOf("mobile") != -1)
      || (u.indexOf("firefox") != -1 && u.indexOf("mobile") != -1)
      || u.indexOf("blackberry") != -1
  }
})(window.navigator.userAgent.toLowerCase());
