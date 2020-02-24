;(function(win, doc, $) {

	'use strict';

	win.Rola = win.Rola || {};

	var getAndroidVersion = function(ua) {
		ua = (ua || navigator.userAgent).toLowerCase();
		var match = ua.match(/android\s([0-9\.]*)/);
		return match ? match[1] : false;
	};

	var isReallyNaN = function(x) {
		return x !== x;
	};

	var Loading = function() {

		this.isSupportSvg = Modernizr.svg;
		this.isAndroid = parseFloat(getAndroidVersion());

		if(this.isAndroid) {
			$('body').addClass('android');

			if(this.isAndroid <= 4.4) {
				$('body').addClass('android-under-44');
			}
		}

		if(this.isSupportSvg) {
			this.el   		= doc.getElementById('logo').contentDocument;
			this.$path 		= $(this.el).find('.path');
			this.$smallPath = $(this.el).find('.small-path');
		} else {
			$('#logo').css({display: 'none'});
			$('.home-logo').append('<div id="fallback-logo"></div>');
		}

        this.$overlay 	= $('.loading-overlay');

        this.init();

	};

	Loading.prototype.init = function() {

		if(this.isSupportSvg) {
			this.$path.css({
				stroke      : 'none',
				fill        : 'none',
				strokeWidth : .5

			});
			this.$smallPath.css({
				stroke      : 'none',
				fill        : 'none',
				strokeWidth : 1

			});
		}

		this.startAnimation();
	};

	Loading.prototype.setPathLengthToStyle = function($obj) {
		var len;
		var arr = [];
		Array.prototype.slice.call($obj).forEach(function(path, i) {
			arr.push(path);
			len = arr[i].getTotalLength() + 30 + 1 | 0; // +30は、Firefox対策。+1 | 0 は小数点切り上げ
			arr[i].style.strokeDasharray  = len;
			arr[i].style.strokeDashoffset = len;
		});
	};

	Loading.prototype.startAnimation = function() {

		var self = this;

		if(this.isSupportSvg) {
			this.$overlay.children('.loader').velocity('fadeOut', { duration: 500, complete:function() {
				self.$path.css({
					stroke      : '#000'
				});
				self.setPathLengthToStyle(self.$path);
				self.$path
					 .velocity({ strokeDashoffset : 0 }, 3000 , 'swing')
					 .velocity({ fill: '#000' }, 1000 , 'swing');
				self.$smallPath.velocity({fill: '#000'}, { duration: 1200, delay: 1400, complete: function() {
					self.opening();
				} });
			}});
		} else {
			this.$overlay.children('.loader').velocity('fadeOut', { duration: 500, complete:function() {
				$('#fallback-logo').velocity({opacity: 1}, {duration: 1000, complete: function() {

					self.opening();
				}});
			}});
		}

	};

	Loading.prototype.opening = function() {
		if(!win.location.hash) {
			if(this.isSupportSvg) {
				$.Velocity.hook($('.nav-profile .back'), 'rotateX', '90deg');
				$.Velocity.hook($('.nav-fanclub .back'), 'rotateX', '90deg');
				$.Velocity.hook($('.nav-sns .back'), 'rotateX', '90deg');
				$.Velocity.hook($('.nav-media .back'), 'rotateX', '90deg');
				$.Velocity.hook($('.nav-top'), 'translateY', '-200%');
				$.Velocity.hook($('.nav-right'), 'translateX', '200%');
				$.Velocity.hook($('.nav-bottom'), 'translateY', '200%');
				$.Velocity.hook($('.nav-left'), 'translateX', '-200%');
			} else {
				$.Velocity.hook($('.nav-profile, .nav-top'), 'top', '-200%');
				$.Velocity.hook($('.nav-fanclub, .nav-right'), 'left', '200%');
				$.Velocity.hook($('.nav-sns, .nav-bottom'), 'top', '200%');
				$.Velocity.hook($('.nav-media, .nav-left'), 'left', '-200%');
			}

			this.$overlay.velocity({opacity: 0}, {duration: 800, delay: 3000, complete: function(el) {
				$(el).hide();
				$('.tilt').addClass('loaded');
				$('.nav-profile .back, .nav-sns .back, .nav-fanclub .back, .nav-media .back').velocity({rotateX: 0}, {duration: 400, delay: 500, easing:'ease-out' });
				setTimeout(function(){
					setWidthAndHeight();
				},2000);
			}});
		} else {
			this.$overlay.velocity({opacity: 0}, {duration: 800, delay: 1000, complete: function(el) {
				$(el).hide();
				$('.tilt').addClass('loaded');
			}});
		}
	};

	win.Rola.Loading = Loading;

})(this, this.document, jQuery);
;(function(win, doc, $) {

	'use strict';

	win.Rola = win.Rola || {};

	var NAVI_SPEED 	= 500;
	var SLIDE_SPEED = 1200;
	var EASING 		= 'easeOutExpo';

	$.easing.easeOutExpo = function(x, t, b, c, d) {
		return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
	};

	var PageSlider = function() {
		this.$el 		= $('.pages');
		this.$container = this.$el.children('.page-container');
		this.$pages		= this.$container.children('.page');
		this.$links		= $('.page-link');

		this.$nav_sns 		= $('#nav-sns');
		this.$nav_media		= $('#nav-media');
		this.$nav_profile	= $('#nav-profile');
		this.$nav_fanclub	= $('#nav-fanclub');

		this.$nav_top 		= $('#nav-top');
		this.$nav_left 		= $('#nav-left');
		this.$nav_bottom	= $('#nav-bottom');
		this.$nav_right		= $('#nav-right');

		this.count 		= this.$pages.length;
		this.isOpenModal = false;

		this.init();
	};

	PageSlider.prototype.init = function() {
		this.initListeners();
	};

	PageSlider.prototype.initListeners = function() {
		var self = this;
		$(win).on('resize', $.proxy(this.onResize, this)).trigger('resize');
		this.$links.on('click', $.proxy(this.onClick, this));
	};

	PageSlider.prototype.onClick = function(e) {
		e.preventDefault();
		var self 		= this,
			currTarget 	= e.currentTarget,
			$current 	= $(currTarget),
			$target 	= $($current.attr('href'));

		switch($current.attr('href')) {
			case '#fanclub':
			case '#media':
				this.$links.addClass('white');
				break;
			default:
				this.$links.removeClass('white');
				break;
		};

		var settings = JSON.parse($current[0].getAttribute('data-role') );

		switch(settings['in']) {
			case '.nav-top':
			case '.nav-profile':
				$(settings['out']).velocity({translateY: -200+'%'}, {duration: NAVI_SPEED});
				$(settings['in']).velocity({translateY: 0}, {duration: NAVI_SPEED, delay: NAVI_SPEED});

				//other
				$('.nav-right').velocity({translateX: 200+'%'}, {duration: NAVI_SPEED});
				$('.nav-fanclub').velocity({translateX: 0}, {duration: NAVI_SPEED, delay: NAVI_SPEED});

				$('.nav-bottom').velocity({translateY: 200+'%'}, {duration: NAVI_SPEED});
				$('.nav-sns').velocity({translateY: 0}, {duration: NAVI_SPEED, delay: NAVI_SPEED});

				$('.nav-left').velocity({translateX: -200+'%'}, {duration: NAVI_SPEED});
				$('.nav-media').velocity({translateX: 0}, {duration: NAVI_SPEED, delay: NAVI_SPEED});

				break;
			case '.nav-bottom':
			case '.nav-sns':
				$(settings['out']).velocity({translateY: 200+'%'}, {duration: NAVI_SPEED});
				$(settings['in']).velocity({translateY: 0}, {duration: NAVI_SPEED, delay: NAVI_SPEED});

				//other
				$('.nav-top').velocity({translateY: -200+'%'}, {duration: NAVI_SPEED});
				$('.nav-profile').velocity({translateY: 0}, {duration: NAVI_SPEED, delay: NAVI_SPEED});

				$('.nav-right').velocity({translateX: 200+'%'}, {duration: NAVI_SPEED});
				$('.nav-fanclub').velocity({translateX: 0}, {duration: NAVI_SPEED, delay: NAVI_SPEED});

				$('.nav-left').velocity({translateX: -200+'%'}, {duration: NAVI_SPEED});
				$('.nav-media').velocity({translateX: 0}, {duration: NAVI_SPEED, delay: NAVI_SPEED});

				break;
			case '.nav-right':
			case '.nav-fanclub':
				$(settings['out']).velocity({translateX: 200+'%'}, {duration: NAVI_SPEED});
				$(settings['in']).velocity({translateX: 0}, {duration: NAVI_SPEED, delay: NAVI_SPEED});

				//other
				$('.nav-top').velocity({translateY: -200+'%'}, {duration: NAVI_SPEED});
				$('.nav-profile').velocity({translateY: 0}, {duration: NAVI_SPEED, delay: NAVI_SPEED});

				$('.nav-bottom').velocity({translateY: 200+'%'}, {duration: NAVI_SPEED});
				$('.nav-sns').velocity({translateY: 0}, {duration: NAVI_SPEED, delay: NAVI_SPEED});

				$('.nav-left').velocity({translateX: -200+'%'}, {duration: NAVI_SPEED});
				$('.nav-media').velocity({translateX: 0}, {duration: NAVI_SPEED, delay: NAVI_SPEED});

				break;
			case '.nav-left':
			case '.nav-media':
				$(settings['out']).velocity({translateX: -200+'%'}, {duration: NAVI_SPEED});
				$(settings['in']).velocity({translateX: 0}, {duration: NAVI_SPEED, delay: NAVI_SPEED});

				//other
				$('.nav-top').velocity({translateY: -200+'%'}, {duration: NAVI_SPEED});
				$('.nav-profile').velocity({translateY: 0}, {duration: NAVI_SPEED, delay: NAVI_SPEED});

				$('.nav-right').velocity({translateX: 200+'%'}, {duration: NAVI_SPEED});
				$('.nav-fanclub').velocity({translateX: 0}, {duration: NAVI_SPEED, delay: NAVI_SPEED});

				$('.nav-bottom').velocity({translateY: 200+'%'}, {duration: NAVI_SPEED});
				$('.nav-sns').velocity({translateY: 0}, {duration: NAVI_SPEED, delay: NAVI_SPEED});

				break;
			default:
				break;
		}

		if($('.btn-menu').hasClass('open')) {
			$('.btn-menu').trigger('click');
		}

		this.$el.scrollTo($target, SLIDE_SPEED, { easing: EASING, onAfter: function() {
			self.$pages.removeClass('current');
			$target.addClass('current');

			/*if($current.attr('href') === '#fanclub' && !this.isOpenModal) {
				$('.btn-announce').trigger('click');
				this.isOpenModal = true;
			}*/
		}});

	};

	PageSlider.prototype.onResize = function() {
		var w 	= $(win).width(),
			h 	= $(win).height(),
			cw	= w * this.count;

		this.$pages.css({width: w, height: h});
		this.$container.css({width: cw, height: h});

		this.$el.scrollTo(this.$pages.filter('.current'));
	};

	PageSlider.prototype.onAfter = function() {
	};

	win.Rola.PageSlider = PageSlider;

})(this, this.document, jQuery);
/**
 * tiltfx.js
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2015, Codrops
 * http://www.codrops.com
 */
;(function(window) {

	'use strict';

	/**
	 * **************************************************************************
	 * utils
	 * **************************************************************************
	 */

	// from https://gist.github.com/desandro/1866474
	var lastTime = 0;
	var prefixes = 'webkit moz ms o'.split(' ');
	// get unprefixed rAF and cAF, if present
	var requestAnimationFrame = window.requestAnimationFrame;
	var cancelAnimationFrame = window.cancelAnimationFrame;
	// loop through vendor prefixes and get prefixed rAF and cAF
	var prefix;
	for( var i = 0; i < prefixes.length; i++ ) {
		if ( requestAnimationFrame && cancelAnimationFrame ) {
			break;
		}
		prefix = prefixes[i];
		requestAnimationFrame = requestAnimationFrame || window[ prefix + 'RequestAnimationFrame' ];
		cancelAnimationFrame  = cancelAnimationFrame  || window[ prefix + 'CancelAnimationFrame' ] ||
		window[ prefix + 'CancelRequestAnimationFrame' ];
	}

	// fallback to setTimeout and clearTimeout if either request/cancel is not supported
	if ( !requestAnimationFrame || !cancelAnimationFrame ) {
		requestAnimationFrame = function( callback, element ) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max( 0, 16 - ( currTime - lastTime ) );
			var id = window.setTimeout( function() {
				callback( currTime + timeToCall );
			}, timeToCall );
			lastTime = currTime + timeToCall;
			return id;
		};

		cancelAnimationFrame = function( id ) {
			window.clearTimeout( id );
		};
	}

	function extend( a, b ) {
		for( var key in b ) {
			if( b.hasOwnProperty( key ) ) {
				a[key] = b[key];
			}
		}
		return a;
	}

	// from http://www.quirksmode.org/js/events_properties.html#position
	function getMousePos(e) {
		var posx = 0;
		var posy = 0;
		if (!e) var e = window.event;
		if (e.pageX || e.pageY) 	{
			posx = e.pageX;
			posy = e.pageY;
		}
		else if (e.clientX || e.clientY) 	{
			posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		}

		return {
			x : posx,
			y : posy
		};
	}

	// from http://www.sberry.me/articles/javascript-event-throttling-debouncing
	function throttle(fn, delay) {
		var allowSample = true;

		return function(e) {
			if (allowSample) {
				allowSample = false;
				setTimeout(function() { allowSample = true; }, delay);
				fn(e);
			}
		};
	}

	/***************************************************************************/

	/**
	 * TiltFx fn
	 */
	function TiltFx(el, options) {
		this.el = el;
		this.options = extend( {}, this.options );
		extend( this.options, options );
		this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
		this._init();
		this._initEvents();
	}

	/**
	 * TiltFx options.
	 */
	TiltFx.prototype.options = {
		// number of extra image elements (div with background-image) to add to the DOM - min:1, max:5 (for a higher number, it's recommended to remove the transitions of .tilt__front in the stylesheet.
		extraImgs : 2,
		// the opacity value for all the image elements.
		opacity : 0.7,
		// by default the first layer does not move.
		bgfixed : true,
		// image element's movement configuration
		movement : {
			perspective : 1000, // perspective value
			translateX : -10, // a relative movement of -10px to 10px on the x-axis (setting a negative value reverses the direction)
			translateY : -10, // a relative movement of -10px to 10px on the y-axis
			translateZ : 20, // a relative movement of -20px to 20px on the z-axis (perspective value must be set). Also, this specific translation is done when the mouse moves vertically.
			rotateX : 2, // a relative rotation of -2deg to 2deg on the x-axis (perspective value must be set)
			rotateY : 2, // a relative rotation of -2deg to 2deg on the y-axis (perspective value must be set)
			rotateZ : 0 // z-axis rotation; by default there's no rotation on the z-axis (perspective value must be set)
		}
	}

	/**
	 * Initialize: build the necessary structure for the image elements and replace it with the HTML img element.
	 */
	TiltFx.prototype._init = function() {
		this.tiltWrapper = document.createElement('div');
		this.tiltWrapper.className = 'tilt';

		// main image element.
		this.tiltImgBack = document.createElement('div');
		this.tiltImgBack.className = 'tilt__back';
		this.tiltImgBack.style.backgroundImage = 'url(' + this.el.src + ')';
		this.tiltWrapper.appendChild(this.tiltImgBack);

		// image elements limit.
		if( this.options.extraImgs < 1 ) {
			this.options.extraImgs = 1;
		}
		else if( this.options.extraImgs > 5 ) {
			this.options.extraImgs = 5;
		}

		if( !this.options.movement.perspective ) {
			this.options.movement.perspective = 0;
		}

		// add the extra image elements.
		this.imgElems = [];
		for(var i = 0; i < this.options.extraImgs; ++i) {
			var el = document.createElement('div');
			el.className = 'tilt__front';
			el.style.backgroundImage = 'url(' + this.el.src + ')';
			el.style.opacity = this.options.opacity;
			this.tiltWrapper.appendChild(el);
			this.imgElems.push(el);
		}

		if( !this.options.bgfixed ) {
			this.imgElems.push(this.tiltImgBack);
			++this.options.extraImgs;
		}

		// add it to the DOM and remove original img element.
		this.el.parentNode.insertBefore(this.tiltWrapper, this.el);
		this.el.parentNode.removeChild(this.el);

		// tiltWrapper properties: width/height/left/top
		this.view = { width : this.tiltWrapper.offsetWidth, height : this.tiltWrapper.offsetHeight };
	};

	/**
	 * Initialize the events on the main wrapper.
	 */
	TiltFx.prototype._initEvents = function() {
		var self = this,
			moveOpts = self.options.movement;

		if (!self.isMobile) {
			// mousemove event..
			this.tiltWrapper.addEventListener('mousemove', function(ev) {
				requestAnimationFrame(function() {
						// mouse position relative to the document.
					var mousepos = getMousePos(ev),
						// document scrolls.
						docScrolls = {left : document.body.scrollLeft + document.documentElement.scrollLeft, top : document.body.scrollTop + document.documentElement.scrollTop},
						bounds = self.tiltWrapper.getBoundingClientRect(),
						// mouse position relative to the main element (tiltWrapper).
						relmousepos = {
							x : mousepos.x - bounds.left - docScrolls.left,
							y : mousepos.y - bounds.top - docScrolls.top
						};

					// configure the movement for each image element.
					for(var i = 0, len = self.imgElems.length; i < len; ++i) {
						var el = self.imgElems[i],
							rotX = moveOpts.rotateX ? 2 * ((i+1)*moveOpts.rotateX/self.options.extraImgs) / self.view.height * relmousepos.y - ((i+1)*moveOpts.rotateX/self.options.extraImgs) : 0,
							rotY = moveOpts.rotateY ? 2 * ((i+1)*moveOpts.rotateY/self.options.extraImgs) / self.view.width * relmousepos.x - ((i+1)*moveOpts.rotateY/self.options.extraImgs) : 0,
							rotZ = moveOpts.rotateZ ? 2 * ((i+1)*moveOpts.rotateZ/self.options.extraImgs) / self.view.width * relmousepos.x - ((i+1)*moveOpts.rotateZ/self.options.extraImgs) : 0,
							transX = moveOpts.translateX ? 2 * ((i+1)*moveOpts.translateX/self.options.extraImgs) / self.view.width * relmousepos.x - ((i+1)*moveOpts.translateX/self.options.extraImgs) : 0,
							transY = moveOpts.translateY ? 2 * ((i+1)*moveOpts.translateY/self.options.extraImgs) / self.view.height * relmousepos.y - ((i+1)*moveOpts.translateY/self.options.extraImgs) : 0,
							transZ = moveOpts.translateZ ? 2 * ((i+1)*moveOpts.translateZ/self.options.extraImgs) / self.view.height * relmousepos.y - ((i+1)*moveOpts.translateZ/self.options.extraImgs) : 0;

						el.style.WebkitTransform = 'perspective(' + moveOpts.perspective + 'px) translate3d(' + transX + 'px,' + transY + 'px,' + transZ + 'px) rotate3d(1,0,0,' + rotX + 'deg) rotate3d(0,1,0,' + rotY + 'deg) rotate3d(0,0,1,' + rotZ + 'deg)';
						el.style.transform = 'perspective(' + moveOpts.perspective + 'px) translate3d(' + transX + 'px,' + transY + 'px,' + transZ + 'px) rotate3d(1,0,0,' + rotX + 'deg) rotate3d(0,1,0,' + rotY + 'deg) rotate3d(0,0,1,' + rotZ + 'deg)';
					}
				});
			});


			// reset all when mouse leaves the main wrapper.
			this.tiltWrapper.addEventListener('mouseleave', function(ev) {
				setTimeout(function() {
				for(var i = 0, len = self.imgElems.length; i < len; ++i) {
					var el = self.imgElems[i];
					el.style.WebkitTransform = 'perspective(' + moveOpts.perspective + 'px) translate3d(0,0,0) rotate3d(1,1,1,0deg)';
					el.style.transform = 'perspective(' + moveOpts.perspective + 'px) translate3d(0,0,0) rotate3d(1,1,1,0deg)';
				}
				}, 60);
			});
		}

		var detectOrientation = function() {
			switch(window.orientation) {
				case -90:
				case 90:
						return 'landscape';
					break;
				default:
						return 'portrait';
					break;
			}
		};

		window.addEventListener('orientationchange', detectOrientation);

		if(self.isMobile) {
			window.addEventListener('deviceorientation', function(ev) {

				if(!$('.tilt').hasClass('loaded')) return;

				var x = (detectOrientation() === 'landscape') ? -ev.beta : -ev.gamma;
				var y = (detectOrientation() === 'landscape') ? ev.gamma+40 : ev.beta-40;
				var z = ev.alpha - 180;

				var clip = function(number, min, max) {
					return Math.max(min, Math.min(number, max));
				}

				// configure the movement for each image element.
/*
				for(var i = 0, len = self.imgElems.length; i < len; ++i) {
					var el, rotX, rotY, rotZ, transX, transY, transZ;

					el = self.imgElems[i],
					el.style.opacity = 0.6;
					rotX = clip(x * ((i+.8) / 130 ) * moveOpts.rotateX, -12, 12),
					rotY = clip(y * ( (i+.8) / 130 ) * moveOpts.rotateY, -12, 12),
					rotZ = moveOpts.rotateZ ? 2 * ((i+.8)*moveOpts.rotateZ/self.options.extraImgs) / self.view.width * x - ((i+.8)*moveOpts.rotateZ/self.options.extraImgs) : 0,
					transX = clip(x * ((i+.8) / 130 ) * moveOpts.translateX, -12, 12),
					transY = clip(y * ( (i+.8) / 130 ) * moveOpts.translateY, -12, 12),
					transZ = moveOpts.translateZ ? 2 * ((i+.8)*moveOpts.translateZ/self.options.extraImgs) / self.view.height * y - ((i+.8)*moveOpts.translateZ/self.options.extraImgs) : 0;

					el.style.WebkitTransform = 'perspective(' + moveOpts.perspective + 'px) translate3d(' + transX + 'px,' + transY + 'px,' + transZ + 'px) rotate3d(1,0,0,' + rotX + 'deg) rotate3d(0,1,0,' + rotY + 'deg) rotate3d(0,0,1,' + rotZ + 'deg)';
					el.style.transform = 'perspective(' + moveOpts.perspective + 'px) translate3d(' + transX + 'px,' + transY + 'px,' + transZ + 'px) rotate3d(1,0,0,' + rotX + 'deg) rotate3d(0,1,0,' + rotY + 'deg) rotate3d(0,0,1,' + rotZ + 'deg)';
				}
*/

			});
		}

		// window resize
		window.addEventListener('resize', throttle(function(ev) {
			// recalculate tiltWrapper properties: width/height/left/top
			self.view = { width : self.tiltWrapper.offsetWidth, height : self.tiltWrapper.offsetHeight };
			setWidthAndHeight();
		}, 50));


	};

	function init() {
		// search for imgs with the class "tilt-effect"
		[].slice.call(document.querySelectorAll('img.tilt-effect')).forEach(function(img) {
			new TiltFx(img, JSON.parse(img.getAttribute('data-tilt-options')));
		});
	}

	init();

	window.TiltFx = TiltFx;

})(window);
;(function(win, doc, $) {

	'use strict';

	win.Rola = win.Rola || {};

	var Loading 	= win.Rola.Loading;
	var PageSlider 	= win.Rola.PageSlider;

	window.onerror = function(error) {
		//alert(error);
	};

	var Main = function() {
		var hash = win.location.hash;

		var pageslider 	= new PageSlider();
		var loading 	= new Loading();

		if(hash) {
			if($(hash).length) {
				switch(hash) {
					case '#profile':
						setTimeout(function() {
							$('.nav-profile a').trigger('click');
						}, 500);
						break;
					case '#fanclub':
						setTimeout(function() {
							$('.nav-fanclub a').trigger('click');
						}, 500);
						break;
					case '#media':
						setTimeout(function() {
							$('.nav-media a').trigger('click');
						}, 500);
						break;
					case '#sns':
						setTimeout(function() {
							$('.nav-sns a').trigger('click');
						}, 500);
						break;
				}
			}
		}

	};

	$(win).load(function() {

		new Main();

		$('.modal').colorbox({inline:true, opacity:.9, speed: 800,scrolling:false});

		$(window).on('resize', function() {
			if($(window).width() >=	768) {
				$('.funclub-content').find('.lead').tile();
				$('.funclub-content').find('.thumb-container').tile();
			} else {
				$('.funclub-content').find('.lead').css('height', '');
				$('.funclub-content').find('.thumb-container').css('height', '');
			}
		}).trigger('resize');

		var $menu 			= $('.btn-menu');
		var $menucontainer 	= $('.menu-container');

		$menu.on('click', function() {
			if($menu.hasClass('open')) {
				$menu.removeClass('open');
				$menucontainer.removeClass('open');
			} else {
				$menu.addClass('open');
				$menucontainer.addClass('open');
			}
		});

	});

})(this, this.document, jQuery);