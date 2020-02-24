// click "Run" to replay

var $body = $('body');
var $pro = $('#progress');

var loading = [
  { elements: $pro, properties: { width: '20%' } },
  { elements: $pro, properties: { width: '30%' } },
  { elements: $pro, properties: { width: '50%' } },
  { elements: $pro, properties: { width: '100%' } },
  { elements: $pro, properties: {  height: '100%' }, options: { 
    complete: function () { 
      $('#main').velocity( 'transition.slideUpIn' );
      $('#main').addClass('index');
    }
  }
  }
]; 

$.Velocity.RunSequence(loading);