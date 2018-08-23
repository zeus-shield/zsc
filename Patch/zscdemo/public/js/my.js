//延迟加载
// $(".lazy").lazyload({
//     effect: "fadeIn",
//     threshold: 200
// });
//返回顶部
$(".back2top").click(function() {
    $('body,html').animate({ scrollTop: 0 }, 500);
    return false;
});
//banner
$(".slide").slide({ 
	titCell: ".hd ul", 
	mainCell: ".bd ul", 
	effect: "fade", 
	vis: "auto", 
	autoPlay: true, 
	autoPage: true, 
	trigger: "mouseover", 
	switchLoad: "_src", 
	interTime: 5000, 
	delayTime: 800 
});

$(".banner").slide({
    mainCell: ".bd ul",
    titCell: ".hd ul",
    autoPlay: true,
    autoPage: true,
    effect: "fade",
    interTime: 3000,
    delayTime: 1000,
    mouseOverStop: false,
    startFun: function(i, c) {
        var now = $(".banner .bd li").eq(i);
        if (now.attr("data-load") == "no") {
            now.css("backgroundImage", "url(" + now.attr("data-bg") + ")");
            now.attr("data-load", "yes");
        }
    },
    endFun: function(i, c) {
        var now = $(".banner .bd li").eq(i + 1);
        if (now.attr("data-load") == "no") {
            setTimeout(function() {
                now.attr("data-load", "yes");
                now.css("backgroundImage", "url(" + now.attr("data-bg") + ")");
            }, 3000);
        }
    }
});

$(window).bind("scroll", function () {  
var sTop = $(window).scrollTop();  
var sTop = parseInt(sTop);  
if (sTop >= 80) { 
	$(".banner .hd").addClass("hidden");
}else{
	$(".banner .hd").removeClass("hidden");
};  
});  


// 保险详细页tabs
$(".tabsInfo a:first span").addClass("cur");

$(".tabsInfo a").click(function(){
	$(".tabsInfo a span").removeClass("cur");
	$(this).children("span").addClass("cur");
});

// 收藏按钮状态变化
$(".sc2 ").addClass('hidden');

$(".sc1 ").click(function(){
	$(".sc2").removeClass('hidden');
	$(".sc1").addClass('hidden');
})
$(".sc2 ").click(function(){
	$(".sc1").removeClass('hidden');
	$(".sc2").addClass('hidden');
})

// 订单tab样式切换
$(".ttOrder div:first a:first").addClass('cur');
$(".ttOrder div:first a").click(function(){
	$(".ttOrder div:first a").removeClass('cur');
	$(this).addClass('cur');
});

// 排序的tabs切换
$(".sort a:first").addClass('cur');
$(".sort a").click(function(){
	$(".sort a").removeClass('cur');
	$(this).addClass('cur')
});

// 首页注册处的tab切换
$(".regTtabs a:first").addClass('cur');
$(".regTtabs a").click(function(){
	$(".regTtabs a").removeClass('cur');
	$(this).addClass('cur')
});

// 消费记录tabs切换
$(".walletBox ul a:first").addClass('cur');
$(".walletBox ul a").click(function(){
	$(".walletBox ul a").removeClass('cur');
	$(this).addClass('cur');
});

// 首页筛选处tab切换
$(".tabTitle a:first").addClass('cur');
$(".tabTitle a").click(function(){
	$(".tabTitle a").removeClass('cur');
	$(this).addClass('cur');
});


