(function($){
	$(function(){
		var _duration_animate = _duration_animate || '1000',
			_repeat = false;

		var waypoints = $('.el-animated').waypoint({
			offset: function() {
			  return Waypoint.viewportHeight()- 50;
			},
			handler: function(direction) {
				if( direction === 'up') return;

				$(this.element).find('.animated').each(function(){
					if( ! _repeat && $(this).data('set-animated') ) return;
					var _this = $(this),
						_animated = _this.data('animated');
					if( ! _repeat ){
						_this.data('set-animated', true);
					}

					if( _animated ){
						_this.addClass(_animated);
						if( _repeat ){
							setTimeout(function(){
								_this.removeClass( _animated );
							}, _duration_animate)
						}
					}
				})
			}
		});
	})

})(window.jQuery)