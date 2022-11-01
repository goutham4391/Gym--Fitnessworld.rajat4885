(function($) {
    "use strict";
    function doStats(timer, content, target, duration) {
        if (duration) {
            var count = 0;
            var speed = parseInt(duration / timer);
            var interval = setInterval(function() {
                if (count - 1 < timer) {
                    target.html(count);
                }
                else {
                    target.html(content);
                    clearInterval(interval);
                }
                count++;
            }, speed);
        } else {
            target.html(content);
        }
    }
	$(document).ready(function() {
        /* Stats */
        $('.jws_theme_stats .num').each(function() {
			var container = $(this);
			var timer = container.attr('data-timer');
			var number = container.attr('data-number');
			doStats(timer, number, container, 300);
        });
        /* End Stats */
	})
})(jQuery);