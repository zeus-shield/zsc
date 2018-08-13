<?php
// +----------------------------------------------------------------------
// | SentCMS [ WE CAN DO IT JUST THINK IT ]
// +----------------------------------------------------------------------
// | Copyright (c) 2013 http://www.tensent.cn All rights reserved.
// +----------------------------------------------------------------------
// | Author: molong <molong@tensent.cn> <http://www.tensent.cn>
// +----------------------------------------------------------------------

namespace app\index\controller;
use app\common\controller\Fornt;
use think\Cookie;
class Index extends Fornt {

	//网站首页
	public function index()
	{
		// $this->jsonSuc('获取成功',['xx'=>1,'yy'=>2]);

		// echo json(['code'=>-2,'msg'=>'注册失败,网络错误','data'=>[]]);
		// die;
		// var_dump(Cookie::get('account'));
		// die;
		//优选产品
		$excellent = model('product')->limit(6)->select();

		//热卖产品
		$hot = model('product')->order('sales desc')->limit(2)->select();

		//推荐产品
		$recommend = model('product')->where('recommend',1)->limit(3)->select();

		$list = [
			'excellent' => $excellent,
			'hot'	    => $hot,
			'recommend' => $recommend
			// 'page' 		=> $recommend->render(),
		];

		$this->assign('list',$list);
		return $this->fetch('index');
	}

	//保险理赔
	public function claims()
	{
		return $this->fetch('claims');



	}

}
