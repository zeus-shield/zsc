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

	/**
	 * 产品详情页
	 */
	public function ProductDetail()
	{
		//进入详情查看次数+1
		$pid = input('pid');

		model('product')->where('pid',$pid)->setInc('look');

		//产品信息
		$info = model('product')->where('pid',$pid)->find();

		//收藏判断
		$collect = Db::name('collect')->where(['pid'=>$pid,'uid'=>$this->uid])->find();

		//评价信息
		$comment = Db::table('comment a')
					   ->join('user b','a.uid=b.uid')
					   ->where('pid='.$pid.'')
					   ->field('a.content,a.star,a.createTime,b.account')
					   ->paginate(10);

		// Db::name('comment')->where(['pid'=>$pid])->paginate(10);

		// foreach ($comment as $k => $v) {
		// 	$comment[$k]['account'] = Db::name('user')->where('uid',$comment[$k]['uid'])->value('account');//电话号码
		// }

		if(!empty($collect)){
			$info['collect'] = 1;//已经收藏产品
		}else{
			$info['collect'] = 0;//已经收藏产品
		}


		$page['currentPage'] = $comment->currentPage();
		$page['lastPage'] 	 = $comment->lastPage();
		$page['total'] 	     = $comment->total();
		$page['listRows']    = $comment->listRows();

		$this->assign('uid',$this->uid);//用户id
		$this->assign('info',$info);//产品信息
		$this->assign('comment',$comment);//评价内容
		$this->assign('page',$page);//评价分页
		return $this->fetch('Product/product_detail');
	}


	public function collect()
	{
		$pid   = input('post.pid');

		if(empty($pid)){
			return $this->jsonErr('数据不足');
		}

		//多选删除
		if(strlen($pid)>1){
			$res = Db::name('collect')->where('pid','in',$pid)->where(['uid'=>$this->uid])->delete();

			if($res){
				return $this->jsonSuc('取消收藏成功');
			}else{
				return $this->jsonErr('取消收藏失败');
			}
		//单个收藏和取消
		}elseif(strlen($pid)==1){
			$info = Db::name('collect')->where(['pid'=>$pid,'uid'=>$this->uid])->find();

			if(!empty($info)){
				$res = Db::name('collect')->where(['pid'=>$pid,'uid'=>$this->uid])->delete();

				if($res){
					return $this->jsonSuc('取消收藏成功');
				}else{
					return $this->jsonErr('取消收藏失败');
				}
			}else{
				$data = [
					'uid'		=> $this->uid,
					'pid'		=> $pid,
					'createTime'=> time()
				];

				$res = Db::name('collect')->insert($data);

				if($res){
					return $this->jsonSuc('收藏成功');
				}else{
					return $this->jsonErr('收藏失败');
				}
			}
		}
	}

}
