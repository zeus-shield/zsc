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
use think\Cache;
use think\Db;
class Company extends Fornt{

	protected $model;//数据模型

	protected $field;//图片遍历

	protected $info;//公司信息

	public function _initialize()
	{
		parent::_initialize();

		$this->model = model('Company');

		$this->field = $this->model->companyList;

		$this->info = $this->model->get(['uid'=>Cookie::get('uid')]);

		$this->assign('info',$this->info);//企业信息

		$account = Cookie::get('account');

		if(preg_match("/^1[34578]\d{9}$/", $account) && $this->url!='index/user/loginout'){
			$this->error('非法操作');
		}
	}
	
	public function companyOrder()
	{
		$type = input('type');

		$title = input('title');

		$where = '';

		$wheres = '';

		if($type==1){
			$where = "a.status=0";
		}else if($type==2){
			$where = "a.endTime>".time()." and a.status=2";
		}else if($type==3){
			$where = "a.status=3";
		}else if($type==4){
			$where = "a.endTime<".time()." and a.status=2";
		}

		if($title){
			$wheres = "a.pid like '%$title%' or a.orderNo like '%$title%'";
		}

		
		$list = Db::table('order a')
		        ->join('product b','a.pid=b.pid')
		        ->join('user c','b.uid=c.uid')
		        ->join('recognizee d','d.rid=a.rid')
		        ->where('c.uid='.$this->uid.'')
		        ->where($where)
				->where($wheres)
		        ->field('d.name as rName,b.name,b.money,a.payTime,a.oid,a.status,a.orderNo')
		        ->paginate(10);

		
		$noPay  = Db::table('order a')
			        ->join('product b','a.pid=b.pid')
			        ->join('user c','b.uid=c.uid')
		        	->join('recognizee d','d.rid=a.rid')
			        ->where('c.uid='.$this->uid.' and a.status=0')
			        ->count();

		$data = [
			'list'=>$list,
			'page'=>$list->render()
		];

		$this->assign($data);
		$this->assign('type',$type);
		$this->assign('noPay',$noPay);

		return $this->fetch('company/company_order');
	}

}
