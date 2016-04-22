$(function(){
	var Canvas = function(imageSrc, content, type){
		//imageSrc = '1.png';
		var initWidth = 200;
		var initHeight;
		var zoom;
		var deg = 0;
		var template = '\
			<div class="canvas-container">\
			    <div class="canvas"></div>\
			    <img class="c-image" />\
			    <div class="c-content"></div>\
			    <div class="toolbar">\
			    	<span class="pencil">铅笔</span>\
			    	<span class="eraser">橡皮</span>\
			    	<span class="ellipse">圆形</span>\
			    	<span class="rectangle">方形</span>\
			    	<span class="polygon">多边形</span>\
			    	<span class="text">文本</span>\
			    	<span class="clear">重置</span>\
			    	<span class="zoom-in">放大</span>\
			    	<span class="zoom-out">缩小</span>\
			    	<span class="set-color">设置颜色</span>\
			    	<span class="transform-left">向左旋转</span>\
			    	<span class="transform-right">向右旋转</span>\
			    	<span class="delete-canvas">删除</span>\
			    </div>\
			    <div class="drag"></div>\
			    <div class="colors">\
			    	<div class="color-type">填充颜色</div>\
			    	<div class="op-c">\
			    		<span class="op-title">透明度：</span>\
			    		<input type="number" class="opacity opacity1" max="1" min="0" step="0.1" value="0" />\
			    	</div>\
			    	<div class="color-list color-list1">\
			    		<span style="background-color: #ff0000;" value="255,0,0"></span>\
			    		<span style="background-color: #ffff00;" value="255,255,0"></span>\
			    		<span style="background-color: #00ff00;" value="0,255,0"></span>\
			    		<span style="background-color: #00ffff;" value="0,255,255"></span>\
			    		<span style="background-color: #0000ff;" value="0,0,255"></span>\
			    		<span style="background-color: #ff00ff;" value="255,00,255"></span>\
			    		<span style="background-color: #ffffff;" value="0,255,0"></span>\
			    		<span style="background-color: #000000;" value="0,255,255" class="active"></span>\
			    	</div>\
			    	<div class="color-type">线条颜色</div>\
			    	<div class="op-c">\
			    		<span class="op-title">透明度：</span>\
			    		<input type="number" class="opacity opacity2" max="1" min="0" step="0.1" value="1" />\
			    	</div>\
			    	<div class="color-list color-list2">\
			    		<span style="background-color: #ff0000;" value="255,0,0"></span>\
			    		<span style="background-color: #ffff00;" value="255,255,0"></span>\
			    		<span style="background-color: #00ff00;" value="0,255,0"></span>\
			    		<span style="background-color: #00ffff;" value="0,255,255"></span>\
			    		<span style="background-color: #0000ff;" value="0,0,255"></span>\
			    		<span style="background-color: #ff00ff;" value="255,00,255"></span>\
			    		<span style="background-color: #ffffff;" value="0,255,0"></span>\
			    		<span style="background-color: #000000;" value="0,255,255" class="active"></span>\
			    	</div>\
			    	<input type="button" value="确定" class="btn-select-color" />\
			    </div>\
			</div>';
		
		var $canvasContainer = $(template);
		var $canvas = $canvasContainer.find('.canvas');
		var $cImage = $canvasContainer.find('.c-image');
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

			$canvasContainer.find('*').css({
				width: w + 'px',
				height: h + 'px'
			}).attr({
				width: w + 'px',
				height: h + 'px'
			});
			if(zoom){
				context.drawImage(img, 0, 0, width0, height0, 0, 0, w, h);  
				img = new Image();
			    img.src = canvas.toDataURL();
			    lc.clear();
				lc.saveShape(LC.createShape('Image', {x: 0, y: 0, image: img}));
			}
			zoom = 1;
		};

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
			resize(initWidth, initHeight);
		};

		var lc = LC.init($canvas[0]);
		lc.setColor('secondary', 'rgba(0,0,0,0)');

		var tools = [
			{
				name: 'pencil',
				el: $canvasContainer.find('.pencil')[0],
				tool: new LC.tools.Pencil(lc)
			},
			{
				name: 'eraser',
				el: $canvasContainer.find('.eraser')[0],
				tool: new LC.tools.Eraser(lc)
			},
			{
				name: 'ellipse',
				el: $canvasContainer.find('.ellipse')[0],
				tool: new LC.tools.Ellipse(lc)
			},
			{
				name: 'rectangle',
				el: $canvasContainer.find('.rectangle')[0],
				tool: new LC.tools.Rectangle(lc)
			},
			{
				name: 'polygon',
				el: $canvasContainer.find('.polygon')[0],
				tool: new LC.tools.Polygon(lc)
			},
			{
				name: 'text',
				el: $canvasContainer.find('.text')[0],
				tool: new LC.tools.Text(lc)
			}
		];

		var activateTool = function(t) {
			lc.setTool(t.tool);
			tools.forEach(function(t2) {
				if (t == t2) {
					t2.el.style.backgroundColor = 'yellow';
				} else {
					t2.el.style.backgroundColor = 'transparent';
				}
			});
		};

		tools.forEach(function(t) {
			t.el.style.cursor = "pointer";
			t.el.onclick = function(e) {
				e.preventDefault();
				activateTool(t);
			};
		});
		activateTool(tools[0]);

		$canvasContainer.find('.zoom-in').click(function(){
			zoom = zoom * 1.2;
			initWidth = initWidth * 1.2;
			initHeight = initHeight * 1.2;
			resize(initWidth, initHeight);
		});

		$canvasContainer.find('.zoom-out').click(function(){
			zoom = zoom / 1.2;
			initWidth = initWidth / 1.2;
			initHeight = initHeight / 1.2;
			resize(initWidth, initHeight);
		});

		$canvasContainer.find('.undo').click(function(){
			lc.undo();
		});

		$canvasContainer.find('.redo').click(function(){
			lc.redo();
		});

		$canvasContainer.find('.clear').click(function(){
			lc.clear();
		});

		$canvasContainer.find('.set-color').click(function(){
			$('.colors').show();
		});

		$canvasContainer.find('.transform-left').click(function(){
			if(deg > -180){
				deg = deg - 15;
				$cImage.css('transform', ('rotate(' + deg + 'deg'));
			}
		});

		$canvasContainer.find('.transform-right').click(function(){
			if(deg < 180){
				deg = deg + 15;
				$cImage.css('transform', ('rotate(' + deg + 'deg'));
			}
		});

		$canvasContainer.find('.delete-canvas').click(function(){
			if(confirm("确定删除吗？")){
				$canvasContainer.remove();
			}
		});

		$canvasContainer.find('.btn-select-color').click(function(){
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

		$canvasContainer.find('.color-list span').click(function(){
			$(this).addClass('active').siblings().removeClass('active');
		});

		$canvasContainer.find('.toolbar span').click(function(){
			$(this).addClass('active').siblings().removeClass('active');
		});

		$canvasContainer.find('.colors, .toolbar').click(function(evt){
			console.log('why?');
			evt.stopPropagation();
		});

		$canvasContainer.find('canvas').attr('backgroundAlpha', '0');
		$canvasContainer.find('.lc-drawing').css({
			top: '0px',
			left: '0px'
		});

		$canvasContainer.click(function(evt){
			$('.toolbar').hide();
			$('.colors').hide();
			$canvasContainer.find('.toolbar').show();
			evt.preventDefault();
			return false;
		});

		$('html').click(function(){
			$canvasContainer.find('.colors, .toolbar').hide()
		});

		if(type == 'text'){
			resize(200, 200);
		}
		return $canvasContainer;
	};
	window.Canvas = Canvas;
})

//http://literallycanvas.com/examples/core.html