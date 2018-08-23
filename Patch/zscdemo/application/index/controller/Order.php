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
	/**
	 * 订单详情
	 * @return [type] [description]
	 */
	public function orderInfo($oid='')
	{

		if(!empty($oid)){
			$result = Db::table('order a')
				->join('recognizee b',"a.rid=b.rid")
				->join('product c',"a.pid=c.pid")
				->field('a.startProtect,a.oid,a.orderNo,a.status,b.name,c.name as cName,c.image,c.money,c.pid as cpid')
				->order('a.createTime desc')
				->where('a.oid='.$oid.'')
				->find();
			$result['image'] = get_cover($result['image'],'path');
		}

		if($result){
			return $this->jsonSuc('获取成功',$result);
		}else{
			return $this->jsonSuc('没有数据');
		}
	}
	/**
	 * 添加评价信息
	 */
	public function addComent()
	{

		$data = input('post.');

		$data['uid'] = $this->uid;

		$data['createTime'] = time();

		$result = Db::name('comment')->insert($data);

		if($result){
			return $this->jsonSuc('评价成功');
		}else{
			return $this->jsonSuc('网络错误');
		}

	}
	/**
	 * 确认保单
	 */
	public function settment2()
	{
		$oid   = input('oid');

		$info  = model('Order')->find($oid);

		// if(strtotime(date("Y-m-d 23:59:59",strtotime($info['createTime'])))<time()){
		// 	$this->error('订单已失效,请重新购买!');
		// }

		// $infos = Db::name('Order')->find($oid);
		// $time = explode("-",$info['startProtect']);

		// $info['endTime'] = $time[0]+$info['securityTime']."-".$time[1]."-".$time[2];//保单终止时间

		$Recognizee  = model('Recognizee')->find($info['rid']);//被保护人信息

		$Recognizee['account'] = model('user')->where('uid',$info['uid'])->value('account');

		// $productUser = Db::table('product a')
		// 		->join('company b',"b.uid=a.uid")
		// 		->where('a.pid='.$infos['pid'].'')
		// 		->field('b.*')
		// 		->find();

		$this->assign('info',$info);
		$this->assign('Recognizee',$Recognizee);

		return $this->fetch('Order/settment2');
	}
	/**
	 * 订单详情
	 * @return [type] [description]
	 */
	public function orderDetail()
	{
		$oid = input('oid');

		$info = Db::table('order a')
		        ->join('product b','a.pid=b.pid')
		        ->join('user c','b.uid=c.uid')
		        ->join('recognizee d','d.rid=a.rid')
		        ->where('a.uid='.$this->uid.' and a.oid='.$oid.'')
		        ->field('d.name as rName,d.sex,d.papers,d.papersType,d.papersImgx,d.papersImgy,d.handIdentityImg,b.name,b.money,b.image,a.*')
		        ->find();
		$comment = Db::name('comment')->where(['uid'=>$this->uid,'pid'=>$info['pid'],'oid'=>$info['oid']])->find();

		if(!empty($comment)){
			$info['comment'] = 1;
		}else{
			$info['comment'] = 0;
		}

		if($info['status']==0){
			$this->error('请先支付订单!');
		}
		// var_dump($info);
		// die;
		//联系方式
		$info['account'] = model('user')->where('uid',$info['uid'])->value('account');

		$this->assign('info',$info);

		return $this->fetch('Order/order_detail');
	}
	/**
	 * 拒绝产品
	 * @return [type] [description]
	 */
	// public function refuse()
	// {
	// 	$oid 	= input('post.oid');
	// 	$refuse = input('post.refuse');

	// 	$result = model('Order')->where('oid',$oid)->update(['refuse'=>$refuse,'status'=>4]);

	// 	if($result){
	// 		return $this->jsonSuc('操作成功');
	// 	}else{
	// 		return $this->jsonSuc('网络错误');
	// 	}

	// }
		/**
	 * 支付订单
	 * @return [type] [description]
	 */
	public function pay()
	{
		$oid   = input('oid');
		$info  = model('Order')->find($oid);

		if(strtotime(date("Y-m-d 23:59:59",strtotime($info['createTime'])))<time()){
			$this->error('订单已失效,请重新购买!');
		}
		return $this->fetch('order/pay');
	}
}
