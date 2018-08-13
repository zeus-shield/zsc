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

class Upload extends Fornt {

	public function _initialize()
	{
		parent::_initialize();
		// var_dump($this->url);
		// if(empty($this->uid) || empty($this->account)){
		// 	echo "<script>alert('请先登录')</script>";
		// }
	}

	public function _empty() {
		$controller = controller('common/Upload');
		$action     = ACTION_NAME;
		return $controller->$action();
	}
}