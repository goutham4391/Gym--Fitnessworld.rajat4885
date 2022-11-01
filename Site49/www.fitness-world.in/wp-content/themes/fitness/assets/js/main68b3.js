(function($) {
	"use strict";
	var RaymondObj = {
		jws_theme_lightbox: function(){
			$('.tb-close-lightbox').on('click', function(e){
				e.preventDefault();
				var _parent = $($(this).attr('href'));
				if( _parent.length ){
					_parent.fadeOut();
				}
			});
			$('.tb-open-lightbox').on('click', function(e){
				e.preventDefault();
				var _parent = $($(this).attr('href'));
				if( _parent.length ){
					_parent.fadeIn();
					if( _parent.hasClass('tb-send-mail-wrap') ){
						if( typeof $.cookie == 'function' && $.cookie('ckie_popup')==='true'){
							_parent.find('#tb-hide-popup').prop('checked',true);
						}
					}
				}
			});
			$('#tb-send_mail').on('click', function(e){
				e.stopPropagation();
				$(this).fadeOut();
			}).on('click','.tb-mail-inner', function(e){
				e.stopPropagation();
			});
		},		
		jws_theme_match_height: function(){
			if( $(window).width() < 768 ) return;
			RaymondObj._same_height = [$('.match-height'),$('.match-height-2')];
			$.each(RaymondObj._same_height, function(index, _element){
				if( ! _element || _element.length === 0 ){
					RaymondObj._same_height.splice(index, 1);
					return;
				}
				_element.matchHeight();
			});
			$(window).on('resize', function(){
				if( $(window).width() > 768 && RaymondObj._same_height && RaymondObj._same_height.length ){
					$.each(RaymondObj._same_height, function(index, _element){
						_element.matchHeight();
					});
				}
			});
		},
		jws_theme_same_height: function(){
			if( $(window).width() < 768 ) return;
			var _same_height = $('.same-height');
			if( _same_height.length === 0 ) return;
			_same_height.children().matchHeight();
		},
		jws_theme_show_product_cat: function(){
			var _parent_cat = $('.product-categories').find('.cat-parent');
			if( _parent_cat.length === 0 ) return;
			_parent_cat.on('click','> a', function(e){
				e.preventDefault();
				$(this).nextAll('.children').removeClass('fadeOutRight').addClass('animated fadeInLeft').parent().toggleClass('open').siblings('.open').removeClass('open');
			});
		},
		jws_theme_single_vertical:function(){
			var _slideshow = $('#tb-single-vertical');
			if( _slideshow.length === 0 ) return;
			_slideshow.cycle();
			_slideshow.find('.cycle-carousel-wrap').on('click', 'img', function(e){
				$('.yith_magnifier_gallery').children('li').eq($(this).data('id')).children('a').trigger('click');
			});
			$(window).on('resize', function(){
				_slideshow.height( _slideshow.closest('.images').find('a').height() - 60 );
			})
			_slideshow.one('cycle-update-view', function(e){
				_slideshow.hide().closest('.ro-product-wrapper').addClass('vertical-slider');
				$(window).trigger('resize');
				_slideshow.fadeIn();
			})
		},
		// custom single woo slider
		jws_theme_fixheight_slider:function(){
			RaymondObj._yith_carousel = $('.ro-product-wrapper .caroufredsel_wrapper');			
			if( RaymondObj._yith_carousel.length ){
				RaymondObj._yith_carousel.css('max-height', RaymondObj._yith_carousel.find('li').first().height() );
			}
		},
		jws_theme_currence_form: function(){
			var _form = $('form.woocommerce-currency-switcher-form');
			if( _form.length === 0 ) return;
			_form.attr('action',  window.location.href );
		},
		jws_theme_set_stick_bar:function( header_offset ){
			RaymondObj._header_offset = ( header_offset ) ? header_offset : ( ( RaymondObj._header_offset ) ? RaymondObj._header_offset : ( $('.tb-header-wrap .tb-header-menu').length > 0 ) ? $('.tb-header-wrap .tb-header-menu').height() : 0 );
			if( RaymondObj._header_offset ){
				setTimeout(function(){
					if ($(window).scrollTop() > RaymondObj._header_offset/2 || ($(window).scrollTop() + $(window).height()) > ($(document).height() - 5) ) {
						$('body').addClass('tb-stick-active');
					} else {
						$('body').removeClass('tb-stick-active');
					}
				}, 1000)
			}
		},
		jws_theme_dub_tb_menu_bar: function(){
			var _tb_lg_menu_bar = $('#tb-lg-menu-sidebar');
			if( _tb_lg_menu_bar.length === 0 ) return;
			$('.tb-header-menu').find('.tb-menu-sidebar').first().empty().append( _tb_lg_menu_bar.html() );
		},
		jws_theme_load_more:function(){
			var _load_more = $('.tb-view-more-link');
			if( _load_more.length === 0 ) return;
			_load_more.on('click', 'a', function(e){
				e.preventDefault();
				var data = {},
					_this = $(this);
				data.args = _this.data('args'),
				data.atts =_this.data('atts');
				RaymondObj.jws_theme_post( 'load_more_products', data ).done( function(data){
					data = $.parseJSON( data );
					var _parent = _this.closest('.tb-view-more-link');
					if(data.content){
						_parent.prev('.tb-products-grid').append(data.content);
					}
					if( data.page ){
						_parent.next('.pagination').empty().append(data.page);
					}
					if( data.args ){
						_this.data('args', data.args );
						if( data.max ){
							_this.parent().fadeOut();
						}
					}else{
						_this.parent().fadeOut();
					}
				})
			});
		},
		jws_theme_added_viewcart:function( _this ){
			var _next = _this.next('a');
			if( wc_add_to_cart_params.i18n_view_cart.length === 0 || _this.parent().attr('data-original-title') === wc_add_to_cart_params.i18n_view_cart ) return;
			_next.hide();
			_this.parent().attr('data-original-title', wc_add_to_cart_params.i18n_view_cart ).delay(200).tooltip('show');
			_this.attr('href', wc_add_to_cart_params.cart_url );
		},
		jws_theme_added_wishlist:function( _this ){
			var browser_text = _this.parent().next().children('a').text();
			if( RaymondObj.wishlisted && _this.text() == browser_text ) return;
			_this.closest('[data-toggle="tooltip"]').attr('data-original-title', browser_text).delay(200).tooltip('show');
			RaymondObj.wishlisted = true;
		},
		jws_theme_refresh_addtocart:function( _this, callback ){
			var _refresh_viewcart = setInterval( function(){
				RaymondObj[callback](_this);
			}, 450);
			setTimeout( function(){
				clearInterval( _refresh_viewcart );
			},1200);
		},
		jws_theme_custom_scroll_v4: function(){
			var _mobile_nav = $('.mobile-leftbar');
			if( _mobile_nav.length===0 ) return;
			_mobile_nav.mCustomScrollbar();
			$('#mobile-bar-v4,.br-button').on('click', function(){
				_mobile_nav.toggleClass('active');
			});
			_mobile_nav.on('click',function(e){
				e.stopPropagation();
			});
			$('body').on('click', function(e){
				if( ! _mobile_nav.hasClass('active') ) return;
				_mobile_nav.removeClass('active');
			});
		},
		jws_theme_change_layout:function(){
			var _archive = $('.archive-products');
			if( _archive.length === 0 ) return;
			_archive.on('click','.jws_theme_action_layout', function(e){
				var cols = 3;
				if( $(this).hasClass('jws_theme_action_list') ){
					cols = 1;
				}else if( _archive.hasClass('grid-full-width') ){
					cols = 4;
				}
				_archive.find(':hidden[name="columns"]').prop('value', cols).removeAttr('disabled');
				setTimeout( function(){
					_archive.find('form.woocommerce-ordering').submit();
				},100);
				e.preventDefault();
			}).find('.tb-after-shop-loop .woocommerce-result-count').on('click','.jws_theme_action', function(e){
				e.preventDefault();
				var index = $(this).index();
				_archive.find('.jws_theme_action_layout').eq(index-1).trigger('click');
			});
		},
		jws_theme_change_price: function(){
			var _list_price = $('#tb-list-price');
			if( _list_price.length === 0 ) return;
			_list_price.find('option').each( function(){
				var value = $(this).val(),
					detail = value.split('-'),
					symbol = woocommerce_price_slider_params.currency_symbol;
				if( woocommerce_price_slider_params.currency_pos === 'left' ){
					value = [symbol,parseFloat( detail[0] ),' - ', symbol, parseFloat( detail[1] ) ];
					value = value.join('');
				}else{
					value = [parseFloat( detail[0] ), symbol, ' - ', parseFloat( detail[1] ), symbol];
					value = value.join('');
				}
				$(this).text( value );
			});
			_list_price.on('change', function(){
				var _this = $(this),
					value = _this.val(),
					detail = value.split('-');
				_this.next('#min_price').prop('value',parseFloat( detail[0] ) ).next('#max_price').prop('value',parseFloat( detail[1] ) );
				_this.attr('disabled','disabled');
				setTimeout( function(){
					_this.closest('form').submit();
				},100);
			});
		},
		jws_theme_fixed_zindex:function(){
			var _full_search = $('.full_search');
			if( _full_search.length === 0 ) return;
			$('.icon_search_wrap').on('click', function(){
				$(this).parent().find('input:text').focus();
				$('body').addClass('tb-fixed-zindex'); //
				//////////////////////////////////////////
			});
		},
		jws_theme_time_popup: function(){
			var _send_mail = $('#tb-send_mail');
			if( _send_mail.length === 0 || typeof $.cookie === undefined) return;
			var _ckie_popup = $.cookie('ckie_popup');
			if( the_ajax_script.show_popup_mail && $.cookie('ckie_popup')!=='true'  ){
				_send_mail.fadeIn();
			}
			_send_mail.find('#tb-hide-popup').on('change', function(){
				if( $(this).is(':checked') ){
					$.cookie('ckie_popup', true, { expires: 30, path: '/' });
				}else{
					$.cookie('ckie_popup', false, { expires: -50, path: '/' });
				}
			})
		},
		jws_theme_porfolio:function(){
			var _porfolio = $('#tb-list-porfolio');
			if( _porfolio.length === 0 ) return;
			if( _porfolio.find('#porfolio-container').length > 0 ){
				_porfolio.find('#porfolio-container').mixItUp();
			};
			if( _porfolio.hasClass('tpl') || _porfolio.hasClass('tpl2') ){
				var _template = '<div class="tb-overlay-bg"><div class="tb-overlay-container"><div class="tb-overlay-content content-lightbox"><div class="portfolio-lightbox"><img class="img-responsive" src="IMGURL"><button title="Close (Esc)" type="button" class="tb-close"><i class="fa fa-times"></i></button></div></div></div></div>';
				if( _porfolio.hasClass('tpl') ){
					_porfolio.on('click', 'a.thumb-hover-effect', function(e){
						e.preventDefault();
						var img = $(this).data('src');
						if(  img.length > 0 ){
							$('body').append(_template.replace( 'IMGURL', img )).find('.tb-overlay-bg').fadeIn(200);
						}
					})
				}else{
					_porfolio.on('click', '.tb-open-lighth-box', function(e){
						e.preventDefault();
						var img = $(this).data('src');
						if(  img.length > 0 ){
							$('body').append(_template.replace( 'IMGURL', img )).find('.tb-overlay-bg').fadeIn(200);
						}
					})
				}
				RaymondObj.jws_theme_close_overlay();
				$('body').on('click','button.tb-close', function(e){
					e.preventDefault();
					$('body').find('.tb-overlay-bg').fadeOut( function(){
						$(this).remove();
					})
				})
			}
		},
        	jws_theme_light_box: function(){
			var _template = '<div class="tb-overlay-bg"><div class="tb-overlay-container"><div class="tb-overlay-content content-lightbox"><div class="portfolio-lightbox"><img class="img-responsive" src="IMGURL"><button title="Close (Esc)" type="button" class="tb-close"><i class="fa fa-times"></i></button></div></div></div></div>';
			$('body .tb-open-lighth-box').on('click', function(e){
				e.preventDefault();
				var img = $(this).data('src');
				if(  img.length > 0 ){
					$('body').append(_template.replace( 'IMGURL', img )).find('.tb-overlay-bg').fadeIn(200);
				}
			});
			$('body').on('click','button.tb-close', function(e){
				e.preventDefault();
				$('body').find('.tb-overlay-bg').fadeOut( function(){
					if( $(this).attr('id') == 'appointment-popup'){
						$(this).fadeOut();
					}else{
						$(this).remove();
					}
				})
			});
		},
		jws_theme_back_to_top:function(){
			// Back to top btn
			var _jws_theme_back_to_top = $('#jws_theme_back_to_top');
			// _jws_theme_back_to_top.smoothScroll({offset: -100});
			var _wHei = $(window).height();
			$(document).on('scroll',function () {
				/* back to top */
				var scroll_top = $(window).scrollTop();
				if ( scroll_top < _wHei ) {
					_jws_theme_back_to_top.addClass('no-active').removeClass('active');
				} else {
					_jws_theme_back_to_top.removeClass('no-active').addClass('active');
				}
			});
			_jws_theme_back_to_top.click(function () {
				if( typeof $.smoothScroll == 'function'){
					$.smoothScroll();
				}else{
					$("html, body").animate({
						scrollTop: 0
					}, 1500);
				}
			});
		},
		jws_theme_viewmore: function(){
			var _view_more = $('#tb-btn-viewmore');
			if( _view_more.lenght === 0 ) return;
			_view_more.on('click', function(e){
				e.preventDefault();
				var _this = $(this),
					_page = _this.attr('href'),
					data = {
						'link': _page,
						'args': _this.data('args'),
						'options': _this.data('options')
					};
				data.args.paged = _page.replace(/\D/g,'');
				RaymondObj.jws_theme_post( 'update_porfolio', data ).done( function(data){
					data = $.parseJSON( data );
					if( data.content.length > 0 ){
						var _porfolio = _this.closest('#tb-list-porfolio');
						_porfolio.find('#porfolio-container').append( data.content );
						if( _porfolio.find('.controls-filter').length ){
							var filter = _porfolio.find('.controls-filter').find('.active').data('filter');
							_porfolio.find('#porfolio-container').mixItUp( 'filter', filter );
						}
						// change viewmore
						if( data.paged ){
							_this.attr('href', '#page/'+data.paged );
						}else{
							_this.parent().fadeOut();
						}
						// change pagination
						if(  _porfolio.find('.pagination ').length ){
							if( data.pagination.length ){
								_porfolio.find('.pagination ').empty().append( data.pagination );
							}else{
								_porfolio.find('.pagination').fadeOUt();
							}
						}
					}
				});
			})
		},
		jws_theme_wrap_carousel: function( _element ){
			if( _element.length === 0 ) return;
			_element.parent().addClass('tb-wrap-carousel');
		},
		jws_theme_post: function( action, data ){
			data = {
				'action': 'jws_theme_'+action,
				'data': data
			};
			return $.post( the_ajax_script.ajaxurl, data );
		},
		jws_theme_carousel: function( items, element, assiged ){
			var _element = $(element+items);
			if( _element.length === 0 && assiged ){
				_element = $(element);
				RaymondObj.assiged = true;
			}
			if( _element.length === 0 ) return;
			var _carousel_ops = {
				loop:true,
				margin:30,
				navText:['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
				dots:true,
				responsiveClass:true,
				responsive:{
					0:{
						items:1,
					},
					768:{
						items: ( items > 2 ) ? ( items - 2 ) : ( items > 1 ) ? ( items - 1) : items,
					},
					992:{
						items: ( items > 1 ) ? ( items - 1 ) : items,
					},
					1200:{
						items:items,
						nav:true,
					}
				}
			};
			var owl = _element.find('.owl-carousel').owlCarousel( _carousel_ops );
			owl.on('mouseenter translated.owl.carousel', function(event) {
			   RaymondObj.jws_theme_add_end_class( $(this) );
			});
			// setTimeout(function(){
			// 	RaymondObj.jws_theme_add_end_class( _element.find('.owl-carousel') );
			// },1000);
			RaymondObj.jws_theme_set_pos_owlnav( _element );
			RaymondObj.jws_theme_wrap_carousel( _element );
		},
		jws_theme_add_end_class: function( _element ){
			_element.find('.owl-item.active').last().addClass('end').siblings('.active').removeClass('end');
		},	
		jws_theme_set_pos_owlnav: function( _element ){
			if( _element.length === 0 ) return;
			_element.on('mouseenter', function(){
				if( ! RaymondObj.set_pos ){
					var top = _element.find('.tb-image,.tb-thumb').first().height()/2;
					if( top ){
						_element.find('.owl-prev').css('top', top).next('.owl-next').css('top', top);
					}
					RaymondObj.set_pos = true;
				}
			})
		},
		jws_theme_slider: function( _element, options ){
			// var _collection_slider = $('#colection_slider');
			options = $.extend( {
		        pagination: '.swiper-pagination',
		        paginationClickable: true
		    }, options );
			var swiper = new Swiper(_element, options);
		},
		jws_product_cats_carousel: function(){
			var _cats_carousel = $('.tb-product-cats-carousel'),
				_cats_carousel_large = $('.tb-product-cats-carousel-large');
			if( _cats_carousel.length == 0 && _cats_carousel_large.length==0 ) return;
			var _carousel_ops = {
				loop:true,
				margin:0,
				navText:['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
				dots:false,
				responsiveClass:true,
				responsive:{
					0:{
						items:1,
					},
					768:{
						items: 2,
					},
					992:{
						items: 3,
					},
					1200:{
						items:3,
						nav:true,
					}
				}
			};
			_cats_carousel.find('.tb-product-items').owlCarousel( _carousel_ops );
			_carousel_ops = $.extend({}, _carousel_ops, {
				responsive:{
					0:{
						items:1,
					},
					768:{
						items: 2,
					},
					992:{
						items: 2,
					},
					1200:{
						items:2,
						nav:true,
					}
				}
			});
			_cats_carousel_large.find('.tb-product-items').owlCarousel( _carousel_ops );
		},
		jws_theme_owl_carousel: function(){
			// setTimeout(function(){
				$('.vc_images_carousel').each(function(){
					var _this = $(this),
						items = _this.data('per-view'),
						show_nav = ! _this.data('hide-nav');
					_this.find('.vc_carousel-slideline-inner').owlCarousel({
						items:items,
						loop:true,
						margin:30,
						navText:['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
						dots:false,
						responsiveClass:true,
						responsive:{
							0:{
								items:(2 < items) ? 2 : items,
							},
							768:{
								items:(3 < items) ? 3 : items,
							},
							992:{
								items:( 4 < items) ? 4 : items,
								nav:show_nav
							},
							1200:{
								items:items,
								nav:show_nav,
							}
						}
					});
				});
			// }, 1000);
		},
		jws_theme_incremental: function(){
			var _increment = $('.tb-counter');
			if( _increment.length === 0 ) return;
			_increment.each( function(){
				$(this).find('.counter').counterUp({
					delay: 10,
					time: 1000
				});
			})
		},
		//jws_theme_incremental: function(){
		//	var _increment = $('.tb-incremental');
		//	if( _increment.length === 0 ) return;
		//	_increment.each( function(){
		//		$(this).find('.incremental-counter').incrementalCounter();
		//	})
		//},
		jws_theme_disabled_on_mobile: function(){
			if( ! window.jws_theme_is_mobile_tablet ) return;
			$('.product').on('click', '.tb-image', function(e){
				e.preventDefault();
			})
		},
		jws_theme_mega_nav: function( ){
			var _ct_nav = $('.ct-inc-megamenu'),
				_main_nav = $('#menu-primary-menu');
			if( _ct_nav.length === 0 || _main_nav.length === 0 ) return;
			RaymondObj.nav_maxwid = _ct_nav.next().width();
			RaymondObj.nav_maxwid = RaymondObj.nav_maxwid > 992 ? 992 : RaymondObj.nav_maxwid;
			_main_nav.find('.drop_full_width').attr('style','width:'+ RaymondObj.nav_maxwid +'!important' );
		},
		jws_theme_mega_search: function(){
			var _mega_search = $('#tb-mega-searchform');
			if( _mega_search.length === 0 ) return;
			_mega_search.on('change', 'select', function(){
				var cat = $(this).val();
				if( cat.length == 0 ){
					_mega_search.find('input[name="cat"]').attr('disabled', true);
				}else{
					_mega_search.find('input[name="cat"]').removeAttr('disabled').prop('value', cat );
				}
			});
		},
		jws_theme_featured_video:function(){
			var _product_video = $('.product-video-popup');
			if( _product_video.length === 0 ) return;
			 $('[data-toggle="tooltip"]').tooltip({
			 	trigger: 'manual'
			 });
			var _template = '<div class="tb-overlay-bg"><div class="tb-overlay-container"><div class="tb-overlay-content"><div class="tb-iframe-scaler"><iframe class=" mfp-iframe" =""="" src="//www.youtube.com/embed/VIDEOID?autoplay=1" frameborder="0" allowfullscreen=""></iframe></div></div></div></div>';
			_product_video.on('click', function(e){
				e.preventDefault();
				var id = RaymondObj.get_video_id( $(this).attr('href') );
				if(  id.length > 0 ){
					_template = _template.replace( 'VIDEOID', id );
					$('body').append(_template).find('.tb-overlay-bg').fadeIn(200);
				}
			});
			RaymondObj.jws_theme_close_overlay();
		},
		jws_theme_close_overlay: function(){
			$('body').on('click','.tb-overlay-content', function(e){
				e.stopPropagation();
			}).on('click','.tb-overlay-container', function(){
				$(this).parent().fadeOut( function(){
					$(this).remove();
				});
			})
		},
		get_video_id:function(url){
			var id = url.match( /^.*?(?:player.|www.)?(?:vimeo\.com|youtu(?:be\.com|\.be))\/(?:video\/|embed\/|watch\?v=)?([A-Za-z0-9._%-]*)(?:\&\S+)?/ );
			return id[1];
		},
		jws_theme_detect_ie: function(){
		    var ua = window.navigator.userAgent;
		    var msie = ua.indexOf('MSIE ');
		    if (msie > 0) {
		        // IE 10 or older => return version number
		        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
		    }
		    var trident = ua.indexOf('Trident/');
		    if (trident > 0) {
		        // IE 11 => return version number
		        var rv = ua.indexOf('rv:');
		        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
		    }
		    var edge = ua.indexOf('Edge/');
		    if (edge > 0) {
		       // Edge (IE 12+) => return version number
		       return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
		    }
		    // other browser
		    return false;
		},
		jws_theme_fixed_currence_form: function(){
			var _form = $('form.woocommerce-currency-switcher-form');
			if( _form.length === 0 ) return;
			_form.attr('action',  window.location.href );
		},
        	// comment 
            	jws_theme_sloved_comment:function(){
        $('.comment-tabs').click(function (){
            $('.comment-list').toggle();
            $('.comment-respond').hide();
        })
        $('.comment-tabss').click(function (){
            $('.comment-respond').toggle();
            $('.comment-list').hide();
        })
         },
		jws_theme_sloved_testimonial:function(){
			var _testimonial_top = $('.tb-testimonial-1.tpl');
			if( _testimonial_top.length === 0 ) return;
			_testimonial_top.parent().parent().addClass('ct-testimonial');
		},
		jws_theme_run_ready:function(){
			// lightbox
            RaymondObj.jws_theme_light_box();
  	         RaymondObj.jws_theme_sloved_comment();
			RaymondObj.jws_theme_currence_form();
			RaymondObj.jws_theme_lightbox();
			RaymondObj.jws_theme_dub_tb_menu_bar();
			RaymondObj.jws_theme_change_layout();
			RaymondObj.jws_theme_show_product_cat();
			RaymondObj.jws_theme_single_vertical();
			RaymondObj.jws_theme_load_more();
			RaymondObj.jws_theme_change_price();
			RaymondObj.jws_product_cats_carousel();
			RaymondObj.jws_theme_porfolio();
			RaymondObj.jws_theme_viewmore();
			RaymondObj.jws_theme_carousel( 4,'.tb-product-carousel' );
			RaymondObj.jws_theme_carousel( 3, '.tb-product-carousel' );
			RaymondObj.jws_theme_carousel( 3, '.tb-porfolio-carousel' );
			RaymondObj.jws_theme_carousel( 2, '.tb-product-carousel' );
			RaymondObj.jws_theme_carousel( 1, '.tb-product-carousel', true );
			RaymondObj.jws_theme_incremental();
			RaymondObj.jws_theme_back_to_top();
			RaymondObj.jws_theme_disabled_on_mobile();
			RaymondObj.jws_theme_custom_scroll_v4();
			RaymondObj.jws_theme_mega_search();
			RaymondObj.jws_theme_fixed_zindex();
			RaymondObj.jws_theme_featured_video();
			RaymondObj.jws_theme_sloved_testimonial();
			RaymondObj.jws_theme_match_height();
			RaymondObj.jws_theme_same_height();
			RaymondObj.jws_theme_time_popup();
			 RaymondObj.jws_theme_mega_nav();
			RaymondObj.jws_theme_owl_carousel();
			if( RaymondObj.jws_theme_detect_ie() ){
				$('html').addClass('ie');
			}
			RaymondObj.jws_theme_fixed_currence_form();
			// RaymondObj.jws_theme_slider( '#colection_slider .swiper-container' );
		}
	};
	$(document).ready(function() {
		// tooltip
		RaymondObj.jws_theme_run_ready();
		$('[data-toggle="tooltip"]').tooltip();
		$('.tb-btn-prod').on('click','.btn-add-to-cart', function(e){
			// if( ! $(this).hasClass('product_type_variable') ){
				e.preventDefault();
				var _this = $(this);
				if( _this.hasClass('added') ){
					location.href=_this.next('a').attr('href');
				}else{
					RaymondObj.jws_theme_refresh_addtocart( _this, 'jws_theme_added_viewcart' );
				}
			// }
		}).on('click','.yith-wcwl-add-button a', function(e){
			e.preventDefault();
			var _this = $(this);
			RaymondObj.jws_theme_refresh_addtocart( _this, 'jws_theme_added_wishlist' );
		});
		// fix header v4
		$('.tb-blog-carousel .owl-carousel').owlCarousel({
			loop:true,
			margin:30,
			navText:['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
			dots:false,
			responsiveClass:true,
			responsive:{
				0:{
					items:1,
				},
				768:{
					items:2,
				},
				992:{
					items:3,
				},
				1200:{
					items:3,
					nav:true,
				}
			}
		});
		RaymondObj.jws_theme_set_pos_owlnav( $('.tb-blog-carousel') );
		$('.tb-category-slider .tb-product-items').owlCarousel({
			loop:true,
			margin:30,
			navText:['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
			dots:false,
			responsiveClass:true,
			responsive:{
				0:{
					items:1,
				},
				768:{
					items:2,
				},
				992:{
					items:3,
				},
				1200:{
					items:4,
					nav:true,
				}
			}
		});
		RaymondObj.jws_theme_wrap_carousel( $('.tb-blog-carousel' ) );
		function ROtesttimonialSlider($elem) {
			if ($elem.length) {
				$elem.each( function() {
					$(this).flexslider({
						animation: "slide",
						animationLoop: true,
						controlNav: true,
						slideshow: true,
						directionNav: false
					});
				});
			}
		}
		ROtesttimonialSlider($('.tb-testimonial-1'));
		ROtesttimonialSlider($('#colection_slider'));
		$('.tb-portfolio-flexslider').flexslider({
			animation: "slide",
			animationLoop: true,
			controlNav: false,
			slideshow: true,
			directionNav: true,
			prevText:'<i class="fa fa-angle-left"></i>',
			nextText:'<i class="fa fa-angle-right"></i>'
		});
		function ROzoomImage() {
			var $window = $(window);
			$("#Ro_zoom_image > img").elevateZoom({
				zoomType: "lens",
				responsive: true,
				containLensZoom: true,
				cursor: 'pointer',
				gallery:'Ro_gallery_0',
				borderSize: 3,
				borderColour: "#84C340",
				galleryActiveClass: "ro-active",
				loadingIcon: 'http://www.elevateweb.co.uk/spinner.gif'
			});
			$("#Ro_zoom_image > img").on("click", function(e) {
				var ez =   $('#Ro_zoom_image > img').data('elevateZoom');
					$.fancybox(ez.getGalleryList());
				return false;
			});
		}
		// ROzoomImage();
		function ROheadervideo() {
			$("#ro-play-button").on("click", function(e){
				e.preventDefault();
					$.fancybox({
					'padding' : 0,
					'autoScale': false,
					'transitionIn': 'none',
					'transitionOut': 'none',
					'title': this.title,
					'width': 720,
					'height': 405,
					'href': this.href.replace(new RegExp("watch\\?v=", "i"), 'v/'),
					'type': 'swf',
					'swf': {
					'wmode': 'transparent',
					'allowfullscreen': 'true'
					}
				});
			});
		}
		ROheadervideo();
		/**
         * Add Product Quantity Up Down icon
         */
        $('form.cart .quantity').each(function() {
            $(this).prepend('<span class="qty-minus"><i class="fa fa-minus"></i></span>');
            $(this).append('<span class="qty-plus"><i class="fa fa-plus"></i></span>');
        });
        /* Plus Qty */
        $(document).on('click', '.qty-plus', function() {
            var parent = $(this).parent();
            $('input.qty', parent).val( parseInt($('input.qty', parent).val()) + 1);
        })
        /* Minus Qty */
        $(document).on('click', '.qty-minus', function() {
            var parent = $(this).parent();
            if( parseInt($('input.qty', parent).val()) > 1) {
                $('input.qty', parent).val( parseInt($('input.qty', parent).val()) - 1);
            }
        })
		/* On Page Cart */ 
		$('#tb-tab-container').easytabs();
		/* Click btn search & cart on header */	
		var _jws_theme_mini_cart = $('.wrap-mini-cart');
		if( _jws_theme_mini_cart.length ){
			_jws_theme_mini_cart.find(".shopping_cart_dropdown,.widget_searchform_content,.user_icon,.tb-menu-account").click(function(e){
				e.stopPropagation();
			});
			if($('.widget_searchform_content').length > 0){
				$('a.icon_search_wrap').click(function (e) {
					e.stopPropagation();
					_jws_theme_mini_cart.find(".active").removeClass('active');
					$(this).next('.widget_searchform_content').toggleClass('active');
					$(this).next('.widget_searchform_content').find('input:text').focus();
				});
				$('.tb-close-fullsearch').on('click', function(e){
					e.preventDefault();
					_jws_theme_mini_cart.find('.full_search').removeClass('active');
					$('body').removeClass('tb-fixed-zindex');
				});
				$('.tb-close-fixedsearch').on('click', function(e){
					e.preventDefault();
					_jws_theme_mini_cart.find('.widget_searchform_content').fadeOut( function(){
						$(this).removeClass('active');
					});
				})
			}
			if($('.user_icon').length){
				$('.user_icon').on('click', function(e){
					// if( $(window).width() > 767 ){
						e.preventDefault();
					// }
					_jws_theme_mini_cart.find(".active").removeClass('active');
					$(this).closest('.tb-menu-canvas-wrap').children('.tb-menu-account').toggleClass('active');
				});
			}
			if($('.shopping_cart_dropdown').length > 0){
				$('.tb-header-wrap').off('click').on('click','a.icon_cart_wrap', function (e) {
					if( $(window).width() > 767 ){
						e.preventDefault();
					}
					e.stopPropagation();
					_jws_theme_mini_cart.find(".active").removeClass('active');
					$(this).parent().next('.shopping_cart_dropdown').toggleClass('active');
				});
			}
			$('body').click(function(e){
				_jws_theme_mini_cart.find(".active").removeClass('active');
				$('body').removeClass('tb-fixed-zindex');
			});
		}
		if($('.tb-menu-canvas').length > 0){
			$('.header-menu-item-icon > a').click(function () {
					$('.tb-menu-canvas').toggleClass('active');
			});
		}
		/* Btn menu click - maya*/
		$('.tb-menu-control-mobi a').click(function(){
			$('.tb-menu-list').toggleClass('active');
            $(".menu-item-has-children > a").removeAttr("href");
		});
        
		/*Header stick*/
		function ROHeaderStick() {
			if( $('.tb-header-menu').length > 0 ){
				if($( '.tb-header-wrap' ).hasClass( 'tb-header-stick' )) {
					RaymondObj.jws_theme_set_stick_bar();
					$(window).on('scroll load', function() {
						RaymondObj.jws_theme_set_stick_bar();
					});
				}
			}
		}
		ROHeaderStick();
		// Same Height
		// $('.row').each(function() {
		// 	if ($(this).hasClass('same-height')) {
		// 		var height = $(this).children().height();
		// 		$(this).children().each(function() {
		// 			$(this).css('min-height', height);
		// 		});
		// 	}
		// });
		/*
		* Mobile Nav Menu Initialization and Event Handling
		*/
		var _mobile_leftbar = $('.mobile-leftbar');
		function initMobileNav() {
			$('.mobile-leftbar .fa-close').on('click', function(e) {
				$('.mobile-leftbar').removeClass('open');
				e.stopPropagation();
			});
			$('.mobile-header .fa-bars').on('click', function(e) {
				$('.mobile-leftbar').addClass('open');
				e.stopPropagation();
			});
		}
		if( _mobile_leftbar.length ){
			initMobileNav();
		}		
		//checkout
		$('.ro-checkout-process .ro-hr-line .ro-tab-1, .ro-customer-info .ro-edit-customer-info').click(function(){
			var process1 = $('.ro-checkout-process .ro-hr-line .ro-tab-1');
			process1.parent().parent().removeClass('ro-process-2');
			process1.parent().parent().addClass('ro-process-1');
			$('.ro-checkout-panel .ro-panel-1').css('display', 'block');
			$('.ro-checkout-panel .ro-panel-2').css('display', 'none');
		});
		$('.ro-checkout-process .ro-hr-line .ro-tab-2, .ro-checkout-panel .ro-btn-2').click(function(){
			var process2 = $('.ro-checkout-process .ro-hr-line .ro-tab-2');
			process2.parent().parent().removeClass('ro-process-1');
			process2.parent().parent().addClass('ro-process-2');
			$('.ro-checkout-panel .ro-panel-1').css('display', 'none');
			$('.ro-checkout-panel .ro-panel-2').css('display', 'block');
		});
	});
	window.addEventListener ? 
	window.addEventListener("load",jws_theme_onload_func,false) : 
	window.attachEvent && window.attachEvent("onload",jws_theme_onload_func);
	function jws_theme_onload_func(){
		// tickbar
		RaymondObj.jws_theme_set_stick_bar();
		// woo slider
		// RaymondObj.jws_theme_fixheight_slider();
		// $('.ro-product-wrapper .thumbnails').find('li').on('click', function(){
		// 	setTimeout( function(){
		// 		RaymondObj.jws_theme_fixheight_slider();	
		// 	}, 800)
		// });
		// func active tabs default
		$('.wpb_tabs').each(function(){
			var wpb_tabs_nav = $(this).find('.wpb_tabs_nav'),
				active_num = wpb_tabs_nav.data('active-tab');
			wpb_tabs_nav.find('li').eq(parseInt(active_num) - 1).trigger('click');
		})
		//setTimeout(function(){
			var $wpb_accordion = $('.wpb_accordion');
			if($wpb_accordion.length > 0 && $.fn.niceScroll !== undefined){
				$wpb_accordion.each(function(){
					$(this).find('.wpb_accordion_section').each(function(){
						$(this).css({display: 'block'});
						var nice = $(this).find('.wpb_accordion_content').niceScroll();
					})
				})
			}
		//}, 10)
		var $nice_scroll_class_js = $('.nice-scroll-class-js');
		if($nice_scroll_class_js.length > 0 && $.fn.niceScroll !== undefined){
			$nice_scroll_class_js.each(function(){
				$(this).niceScroll();
			})
		}
	}
//no _cc
jQuery(document).ready(function(){
  jQuery('#drop_email').on('click', function(){
    var url = window.location.href;
    window.location = url + "/enquiry/";
  });
});
//no _cc
jQuery(document).ready(function(){
  jQuery('#call_experts').on('click', function(){
    var url = window.location.href;
    window.location = url + "/contact/";
  });
});

//search _200px
jQuery(window).load(function(){    
    jQuery('#myModal').modal('show');
}); 

//menu new tab
jQuery("#menu-item-15711 a").attr("target", "_blank"); 

//CALL EXPERTS href
if (window.matchMedia('(max-width: 767px)').matches) {
        jQuery(".callback_m a").attr("href", "tel:+91 9313204632");
    } else {
		jQuery(".callback_m a").attr("href", "https://www.fitness-world.in/v3/contact/");
        
}
//event
jQuery('input[name="event-phone"]').attr('maxlength', '10');


//setup
jQuery('.page-id-18130 .aigpl-img-link:nth-child(1)').attr("href", "https://www.fitness-world.in/v3/gym-installation/?album=17171");

jQuery('.page-id-18130 .aigpl-img-link:nth-child(2)').attr("href", "https://www.fitness-world.in/v3/gym-installation/?album=17165");

jQuery('.page-id-18130 .aigpl-img-link:nth-child(3)').attr("href", "https://www.fitness-world.in/v3/gym-installation/?album=17180");

//catalogue submenu new tab
jQuery("#menu-item-18466 a").attr("target", "_blank");
jQuery("#menu-item-18467 a").attr("target", "_blank");

//event links
jQuery('.page-id-17988 .ff_e .aigpl-img-link').attr("href", "https://www.fitness-world.in/v3/event-gallery/?album=17082");
jQuery('.page-id-17988 .ss_e .aigpl-img-link').attr("href", "https://www.fitness-world.in/v3/event-gallery/?album=17081");
jQuery('.page-id-17988 .tt_e .aigpl-img-link').attr("href", "https://www.fitness-world.in/v3/event-gallery/?album=17067");

})(window.jQuery)