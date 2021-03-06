/**
 * @authors 沈煦
 * @date    2014-08-07 14:23:06
 * @explain jQuery实现的onSize事件
 */
(function($){
	$.fn.wresize = function(f) {
        version = '1.1';
        wresize = {
            fired: false,
            width: 0
        };

        function resizeOnce() {
            if ($.browser.msie) {
                if (!wresize.fired) {
                    wresize.fired = true;
                } else {
                    var version = parseInt($.browser.version, 10);
                    wresize.fired = false;
                    if (version < 7) {
                    } else if (version == 7) {
                        //a vertical resize is fired once, an horizontal resize twice
                        var width = $(window).width();
                        if (width != wresize.width) {
                            wresize.width = width;
                            return false;
                        }
                    }
                }
            }

            return true;
        }

        function handleWResize(e) {
            if (resizeOnce()) {
                return f.apply(this, [e]);
            }
        }

        this.each(function() {
            if (this == window) {
                $(this).resize(handleWResize);
            } else {
                $(this).resize(f);
            }
        });

        return this;
    };
})(jQuery)