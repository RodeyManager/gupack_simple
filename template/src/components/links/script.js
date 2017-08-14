
export default function(){
    let $links = $('.links'),
        $case = $links.find('#case'),
        $box = $links.find('.case');
    $case.click(e => {
        if($box.css('display') !== 'block'){
            $box.fadeIn();
        }else{
            $box.fadeOut();
        }
    });
    $('body').click(evt => {
        let target = evt.target;
        if(target.id !== 'case'){
            $box.hide();
        }
    });
};