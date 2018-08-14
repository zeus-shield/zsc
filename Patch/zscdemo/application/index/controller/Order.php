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

	// public function _initialize()
	// {
	// 	parent::_initialize();
	// 	if(empty($this->uid) || empty($this->account)){
	// 		echo "<script>alert('请先登录')</script>";
	// 		return $this->fetch('Order/settment2');
	// 	}
	// }
	/**
	 * 订单列表(公司,个人)
	 * @return [type] [array]
	 */
	public function lists()
	{
		return $this->fetch('Order/list');
	}


	/**
	 * 填写投保信息
	 * @return [type] [description]
	 */
	public function settment()
	{

		$data = [
			'name'	  	   => input('name'),//投保金额
			'sex'		   => input('sex'),
			'insureMoney'  => input('insureMoney'),//投保金额
			'securityTime' => input('securityTime'),//保障时间
			'year'	   	   => input('year'),//交费年限
			'medical'      => input('medical'),//附加长期医疗  0 不投保
			'payType'  	   => input('payType'),//0:季交, 年交
			'startProtect' => input('startProtect'),//起保时间
			'pid' 		   => input('pid'),//产品id
		];

		$list = model('Recognizee')->where('uid',$this->uid)->select();

		//添加和编辑模式区分
		$this->info = ['epapersImgx'=>0,'epapersImgy'=>0,'ehandIdentityImg'=>0];
		// $sex 		  = input('sex');
		// $insureMoney  = input('insureMoney');
		// $securityTime = input('securityTime');
		// $year 		  = input('year');
		// $medical 	  = input('medical');
		// $payType      = input('payType');
		// $startProtect 	  = input('startProtect');
		$this->assign('data',$data);
		$this->assign('list',$list);
		$this->assign('info',$this->info);

		return $this->fetch('Order/settment');
	}

/*添加订单信息*/
	public function addOrder()
	{
		$data = input('post.');

		$productInfo = Db::name('product')->find($data['pid']);//产品信息

		if($productInfo['num']==0){
			return $this->jsonErr('产品已经销售完,暂时无法购买!');
		}

		$time = explode("-",$data['startProtect']);

		$data['endTime'] = $time[0]+$data['securityTime']."-".$time[1]."-".$time[2];//保单终止时间

		$result = model('Order')->allowField(true)->save($data);

		if($result===false){
			return $this->jsonErr('操作失败');
		}

		if($result>0){

			return $this->jsonSuc('操作成功',model('Order')->oid);
		}else{
			return $this->jsonSuc('未修改数据,操作成功');
		}
	}

	/**
	 * 删除订单
	 * @return [type] [description]
	 */
	public function delOrder($oid='')
	{

		if(!empty($oid)){
		  $result = model('order')->where('oid',$oid)->delete();
		}

		if($result){
			return $this->jsonSuc('删除成功');
		}else{
			return $this->jsonSuc('未修改数据,操作成功');
		}
	}
}
