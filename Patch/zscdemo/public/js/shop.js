$(function(){
	$('.addCart').click(function(){
		event.preventDefault();
		var $img = $('.'+$(this).attr('data-src'));
		var target = $('.'+$(this).attr('data-target'));
		var goods_id = $(this).attr('data-id');
		var num = $("."+$(this).attr('data-num')).val();
		num = num ? num : 1;
		var src = $img.attr('src');
		var $showg = $('<img id="cart_dh" style="display:none; border:1px solid #aaa; z-index:99999;" width="200" height="200" src="'+src+'" />').prependTo("body");
		$showg.css({ 
			'width' : 200, 
			'height': 200, 
			'position' : 'absolute',      
			"left":$img.offset().left+16, 
			"top":$img.offset().top+9,
			'opacity' : 1    
		}).show();
		$showg.animate({   
			width: 1, 
			height: 1, 
			top: target.offset().top,    
			left: target.offset().left, 
			opacity: 0
		},500,function(){
			$('img#cart_dh').remove();
			$.ajax({
				url      : BASE_URL + '/cart/add.html',
				data     : {'id':goods_id,'num':num},
				type     : 'post',
				success  : function(data){
					target.find('.badge').html(data.num);
				},
				dataType : 'json'
			})
		});
	});

	var cartCountBadge = $('.CartBtn');
	if (typeof cartCountBadge == 'object') {
		setCartCount();
	}

	function setCartCount(){
		$.ajax({
			url      : BASE_URL + '/cart/count.html',
			type     : 'post',
			success  : function(data){
				cartCountBadge.find('.badge').html(data.info);
			},
			dataType : 'json'
		});
	}
})