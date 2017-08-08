/**
 * Created by Rodey on 2017/7/28.
 */
;(function(){
    'use strict';

    $(function(){
        var $links = $('.links'),
            $case = $links.find('#case'),
            $box = $links.find('.case');
        $case.click(function(){
            if($box.css('display') !== 'block'){
                $box.fadeIn();
            }else{
                $box.fadeOut();
            }
        });
        $('body').click(function(evt){
            var target = evt.target;
            if(target.id !== 'case'){
                $box.hide();
            }
        });
    });

}).call(this || window);