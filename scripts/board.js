(function(){
    "use strict";

    var items;
    var currentIndex = 0;
    var typeNums = {
        "1": '结体讲解',
        "2": '笔法讲解',
        "3": '笔顺讲解',
        "4": '书体对比',
        "5": '范字知识',
        "6": '知识拓展',
        "7": '组词造句',
        "8": '知识讲解'
    };

    var itemTemplate = '\
        <div class="z-item-h">\
            <img class="hz-picture" class="n-img" src="source/xiao/001.png" />\
            <div class="heng-shu-line"></div>\
            <div>\
                <div class="left-h-line"></div>\
                <div class="center-yuan"></div>\
                <div class="right-h-line"></div>\
            </div>\
            <div class="hz-text">\
            </div>\
            <div class="h-menu">\
            </div>\
        </div>'

    $('.t-btn-c').click(function(evt){
        $('.t-btn-c').removeClass('active');
        $(this).addClass('active');
        $('.b-pop').hide();
        $(this).find('.b-pop').show();
        if(!($(this).hasClass('btn-zhou'))){
            $('.sjz-heng').hide();
            $('.sjz-zong').hide();
        } 
        evt.stopPropagation();
    });

    $('html').click(function(){
        $('.b-pop').hide();
        $('.h-menu').hide();
    });

    $('.close-video').click(function(){
        $('.video-container video').attr('src', '');
        $('.video-container').hide();
        $('.modal').hide();
    });

    $('.video-item').click(function(){
        $('.video-container').show();
        $('.modal').show();
    });

    $('.btn-zhou').click(function(){
        $('.sjz-heng').show();
        $('.sjz-zong').hide();
    });

    $('.skb-tab').click(function(){
        var target = $(this).attr('target');
        $(this).addClass('active').siblings().removeClass('active');
        $('.' + target).addClass('active').siblings().removeClass('active');
    });

     function load(){
        items = parseData(data.items);
        console.log('items: ', items);
        renderItems();
    };

    load();

    function renderItems(){
        items.forEach(function(item){
            var $item = $(itemTemplate);
            $item.find('.hz-picture').attr('src', ('source/' + item.img));
            $item.find('.hz-text').text(item.name);
            var $menu = $item.find('.h-menu');
            for(var t in item.types){
                var $m = $('<span></span>');
                $m.text(typeNums[t]);
                $m.data('type', t);

                $m.click(function(){
                    $('.sjz-heng').hide();
                    var scop = this;
                    setTimeout(function(){
                        var pType = $(scop).data('type');
                        var points = items[currentIndex]['types'][pType];
                        renderPoins(points);
                        $('.sjz-zong').show();
                    }, 100);
                });
                $menu.append($m);
            }

            $item.find('.hz-picture').click(function(evt){
                $('.h-menu').hide();
                $menu.show();
                evt.stopPropagation();
                evt.preventDefault();
                return false;
            });
            
            $item.click(function(){
                currentIndex = $(this).index();
            });
            $('.z-h-items').append($item);
        });
    };

    function renderPoins(points){
        $('.zong-items').html('');
        points.forEach(function(point){
            var $row = $('<div class="row"></div>');
            point.forEach(function(pt){
                var $img = $('<img />');
                $img.attr('src', pt.img ? ('source/' + pt.img ) : 'images/text.png');
                $img.data('source_type', pt.source_type || 'text');
                if(pt.url){
                   $img.data('url', ('source/' + pt.url)); 
                }
                else{
                    $img.data('content', pt.content);
                }
                $img.click(function(){
                    var url = $(this).data('url');
                    var content = $(this).data('content');
                    var type = $(this).data('source_type');
                    console.log(type);
                    if(type == 'video'){
                        $('.video-container').show();
                        $('.video-container title span').text('视频');
                        $('.video-container video').attr('src', url);
                    }
                    else{
                        console.log(url, content, type);
                        var $canvas = Canvas(url, content, type);
                        $('.container').append($canvas);
                    }
                });
                $row.append($img);
            });
            $('.zong-items').append($row);
        });
        
    };

    function parseData(data){
        var items = [];
        data.forEach(function(item){
            var types = parsePoints(item.points);
            item.types = types;
            delete item.points;
            items.push(item);
        });
        return items;
    };

    function parsePoints(points){
        points.sort(compare('row_no', 'col_no'));
        var _data = {
            "1": [],
            "2": [],
            "3": [],
            "4": [],
            "5": [],
            "6": [],
            "7": [],
            "8": []
        }
        points.forEach(function(point){
            var type = point.type || '8';
            var row_no = parseInt(point.row_no);
            if(!_data[type][row_no]){
                _data[type].push([]);
            }
            _data[type][row_no].push(point);
        });
        for(var t in _data){
            if(_data[t].length == 0){
                delete _data[t];
            }
        }
        return _data;
    };

    function compare(property1, property2) { 
        return function (object1, object2) { 
            var value1 = object1[property1]; 
            var value2 = object2[property1]; 
            if (value2 < value1) { 
                return 1; 
            } 
            else if (value2 > value1) { 
                return -1; 
            } 
            else { 
                value1 = object1[property2]; 
                value2 = object2[property2]; 
                if (value2 < value1) { 
                    return 1; 
                } 
                else if (value2 > value1) { 
                    return -1; 
                } 
                else{
                    return 0;
                }
            } 
        } 
    };

    $('.btn-heng-left').click(function(){
        var $items = $('.z-h-items');
        $items.scrollLeft($items.scrollLeft() - 240);
    });

    $('.btn-heng-right').click(function(){
        var $items = $('.z-h-items');
        $items.scrollLeft($items.scrollLeft() + 240);
    });

    $('.btn-zong-left').click(function(){
        console.log('left');
        var $items = $('.zong-items');
        $items.scrollLeft($items.scrollLeft() - 100);
    });

    $('.btn-zong-right').click(function(){
        console.log('right');
        var $items = $('.zong-items');
        $items.scrollLeft($items.scrollLeft() + 100);
    });

    $('.btn-top').click(function(){
        console.log('top');
        var $items = $('.zong-items');
        $items.scrollTop($items.scrollTop() - 90);
    });

     $('.btn-bottom').click(function(){
        console.log('bottom');
        var $items = $('.zong-items');
        $items.scrollTop($items.scrollTop() + 90);
    });
})();