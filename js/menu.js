$(function() {
  $('#aboutclass').click(function() {
    $('#about').animate({
      'top': '0'
    });
    $('.close').animate({
      'opacity': '1'
    });
    $('#gallery').animate({
      'right': '-200vh'
    });
    $('#event').animate({
      'top': '200vh'
    });
  });
  $('.close').click(function() {
    $('#about').animate({
      'top': '-200vh'
    });
  });
});

$(function() {
  $('#galleryclass').click(function() {
    $('#gallery').animate({
      'right': '0'
    });
    $('.close').animate({
      'opacity': '1'
    });
    $('#about').animate({
      'top': '-200vh'
    });
    $('#event').animate({
      'top': '200vh'
    });
  });
  $('.close').click(function() {
    $('#gallery').animate({
      'right': '-200vh'
    });
  });
});

$(function() {
  $('#eventclass').click(function() {
    $('#event').animate({
      'top': '0'
    });
    $('.close').animate({
      'opacity': '1'
    });
    $('#gallery').animate({
      'right': '-200vh'
    });
    $('#about').animate({
      'top': '-200vh'
    });
  });
  $('.close').click(function() {
    $('#event').animate({
      'top': '200vh'
    });
  });
});