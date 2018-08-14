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
class Product extends Fornt{

	/**
	 * 产品列表页面
	 * @return [type] [description]
	 */
	public function index()
	{

		$sort = input('sort');

		$coverage = input('coverage');
		$classify = input('classify');
		$company  = input('company');

		$name     = input('name','');

		$order = '';

		$where = array();
		if($sort==1){

			$order = 'look desc';//人气排序

		}elseif($sort==2){

			$order = 'sales desc';//销量排序

		}elseif($sort==3){

			$order = 'money desc';//价格排序

		}else{
			$order = 'addTime desc';
		}

		if(isset($coverage) && $coverage!=''){
			array_push($where, 'coverage in ('.$coverage.')');
		}

		if(isset($classify) && $classify!=''){
			array_push($where, 'classify in ('.$classify.')');
		}

		if(isset($company) && $company!=''){
			array_push($where, 'company in ('.$company.')');
		}

		$where = implode(' and ',$where);

		$list = model('product')->order($order)->where($where)->where('name','like','%'.$name.'%')->paginate(5);


		$page['currentPage'] = $list->currentPage();
		$page['lastPage'] 	 = $list->lastPage();
		$page['total'] 	     = $list->total();
		$page['listRows']    = $list->listRows();

		$data = array(
			'list' => $list,
			'page' => $page,
		);

		$this->assign('sort',$sort);
		$this->assign('name',$name);

		$this->assign('url',$this->url);
		$this->assign('coverage',explode(",",input('coverage')));
		$this->assign('classify',explode(",",input('classify')));
		$this->assign('company' ,explode(",",input('company')));
		$this->assign($data);
		return $this->fetch('Product/index');
	}
}
