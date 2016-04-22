$(function(){
    var Canvas = function(imageSrc, content, type){
        imageSrc = 'source/course_Fue58hhQuQ4kM1aBbwPQW9TZx86V.jpg';
        var initWidth = 200;
        var initHeight;
        var zoom;
        var deg = 0;

        var $canvasContainer = $('.canvas-container');
        var $canvas = $canvasContainer.find('.canvas');
        var $cImage = $canvasContainer.find('.c-image');
        var $toolbar = $('.toolbar');
        $cImage.attr('src', imageSrc);
        $canvasContainer.find('.c-content').html(content);
        $canvasContainer.attr('type', type);

        $canvasContainer.mousemove(function(evt){
            evt.preventDefault();
        });

        function resize(w, h){
            var canvas = $canvasContainer.find('canvas')[1];
            var context = canvas.getContext("2d");
            $canvasContainer.css({
                width: w + 'px',
                height: h + 'px'
            });

            var img = new Image();
            img.src = canvas.toDataURL();
            var width0 = canvas.width;
            var height0 = canvas.height;

            /*$canvasContainer.find('*').css({
                width: w + 'px',
                height: h + 'px'
            }).attr({
                width: w + 'px',
                height: h + 'px'
            });*/

            if(zoom){
                context.drawImage(img, 0, 0, width0, height0, 0, 0, w, h);
                img = new Image();
                img.src = canvas.toDataURL();
                lc.clear();
                lc.saveShape(LC.createShape('Image', {x: 0, y: 0, image: img}));
            }
            zoom = 1;
        }

        $canvasContainer.find('.drag').mousedown(function(e){
            var offsetX = e.offsetX;
            var offsetY = e.offsetY;
            $(document).mousemove(function(e){
                var x = e.pageX - offsetX;
                var y = e.pageY - offsetY;
                $canvasContainer.css({'top':y, 'left':x})
            });
            $(document).mouseup(function(){
                $(document).unbind('mousemove');
                $(document).unbind('mouseup');
            });
        });

        $cImage[0].onload = function(){
            var width = $cImage[0].width;
            var height = $cImage[0].height;
            initHeight = height * (200 / width);
            //resize(initWidth, initHeight);
        };

        var lc = LC.init($canvas[0]);
        lc.setColor('secondary', 'rgba(0,0,0,0)');

        var tools = [
            {
                name: 'pencil',
                el: $toolbar.find('.pencil')[0],
                tool: new LC.tools.Pencil(lc)
            },
            {
                name: 'eraser',
                el: $toolbar.find('.eraser')[0],
                tool: new LC.tools.Eraser(lc)
            },
            {
                name: 'ellipse',
                el: $toolbar.find('.ellipse')[0],
                tool: new LC.tools.Ellipse(lc)
            },
            {
                name: 'rectangle',
                el: $toolbar.find('.rectangle')[0],
                tool: new LC.tools.Rectangle(lc)
            },
            {
                name: 'polygon',
                el: $toolbar.find('.polygon')[0],
                tool: new LC.tools.Polygon(lc)
            },
            {
                name: 'text',
                el: $toolbar.find('.text')[0],
                tool: new LC.tools.Text(lc)
            },
            {
                name: 'drag',
                el: $toolbar.find('.drag')[0],
                tool: new LC.tools.Pan(lc)
            }
        ];

        var activateTool = function(t) {
            lc.setTool(t.tool);
            /*tools.forEach(function(t2) {
                if (t == t2) {
                    t2.el.style.backgroundColor = 'yellow';
                } else {
                    t2.el.style.backgroundColor = 'transparent';
                }
            });*/
        };

        tools.forEach(function(t) {
            //t.el.style.cursor = "pointer";
            /*t.el.onclick = function(e) {
                e.preventDefault();
                activateTool(t);
            };*/
        });
        activateTool(tools[0]);

        $toolbar.find('.zoom-in').click(function(){
            zoom = zoom * 1.2;
            initWidth = initWidth * 1.2;
            initHeight = initHeight * 1.2;
            resize(initWidth, initHeight);
        });

        $toolbar.find('.zoom-out').click(function(){
            zoom = zoom / 1.2;
            initWidth = initWidth / 1.2;
            initHeight = initHeight / 1.2;
            resize(initWidth, initHeight);
        });

        $toolbar.find('.undo').click(function(){
            alert(111);
            lc.undo();
        });

        $toolbar.find('.redo').click(function(){
            lc.redo();
        });

        $toolbar.find('.clear').click(function(){
            lc.clear();
        });

        $toolbar.find('.set-color').click(function(){
            $('.colors').show();
        });

        $toolbar.find('.transform-left').click(function(){
            if(deg > -180){
                deg = deg - 15;
                $cImage.css('transform', ('rotate(' + deg + 'deg'));
            }
        });

        $toolbar.find('.transform-right').click(function(){
            if(deg < 180){
                deg = deg + 15;
                $cImage.css('transform', ('rotate(' + deg + 'deg'));
            }
        });

        $toolbar.find('.delete-canvas').click(function(){
            if(confirm("确定删除吗？")){
                $canvasContainer.remove();
            }
        });

        $toolbar.find('.btn-select-color').click(function(){
            var opacity1 = $canvasContainer.find('.opacity1').val();
            var color1 = $canvasContainer.find('.color-list1 span.active').attr('value');
            var selectColor1 = 'rgba(' + color1 + ',' + opacity1 + ')';
            console.log(selectColor1);
                lc.setColor('secondary', selectColor1);

            var opacity2 = $canvasContainer.find('.opacity2').val();
            var color2 = $canvasContainer.find('.color-list2 span.active').attr('value');
            var selectColor2 = 'rgba(' + color2 + ',' + opacity2 + ')';
            console.log(selectColor2);
            lc.setColor('primary', selectColor2);
        });

        $('.pencil-box svg').on('click', function() {
            var $circle = $(this).children('circle');
            // 园直径
            var strokeWidth = $circle.attr('r') * 2;
            // 切换画笔大小
            lc.tool.strokeWidth = strokeWidth;
        });
        $('.pencil-box .color-item').on('click', function() {
            // 切换画笔颜色
            lc.setColor('primary', $(this).css('background-color'));
        });

        /*$toolbar.find('.color-list span').click(function(){
            $(this).addClass('active').siblings().removeClass('active');
        });

        $toolbar.find('.toolbar span').click(function(){
            $(this).addClass('active').siblings().removeClass('active');
        });

        $toolbar.find('.colors, .toolbar').click(function(evt){
            console.log('why?');
            evt.stopPropagation();
        });*/

        $canvasContainer.find('canvas').attr('backgroundAlpha', '0');
        $canvasContainer.find('.lc-drawing').css({
            top: '0px',
            left: '0px'
        });

        $canvasContainer.click(function(evt){
            //$('.toolbar').hide();
            //$('.colors').hide();
            //$canvasContainer.find('.toolbar').show();
            evt.preventDefault();
            return false;
        });

        $('html').click(function(){
            //$canvasContainer.find('.colors, .toolbar').hide()
        });

        if(type == 'text'){
            resize(200, 200);
        }
        return $canvasContainer;
    };
    window.Canvas = Canvas;
})

//http://literallycanvas.com/examples/core.html