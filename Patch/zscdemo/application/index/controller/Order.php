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
use think\Db;
class Order extends Fornt{

	 public function _initialize()
	 {
	 	parent::_initialize();
		if(empty($this->uid) || empty($this->account)){
	 		echo "<script>alert('请先登录')</script>";
	 		return $this->fetch('Order/settment2');
	 	}
	 }
	/**
	 * 订单列表(公司,个人)
	 * @return [type] [array]
	 */

}
