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
class User extends Fornt{

	protected $model;

	protected $field;

	public function _initialize()
	{
		parent::_initialize();

		$this->model = model('user');
		$this->field  = $this->model->recognList;

		$account = Cookie::get('account');

		if(!preg_match("/^1[34578]\d{9}$/", $account) && $account!=null && $this->url!='index/user/loginout' && $this->url!='index/user/login' && $this->url!='index/user/register' && $this->url!='index/user/getCode'){
			$this->error($account);
		}
	}
	/**
	 * 登录
	 * @return [type] [description]
	 */
	public function login()
	{
		$data = input('post.');

		//登录方式(手机号,邮箱)
		$res = $this->model->userLogin($data);
		if($res===true){
			//查询被保人信息
			$this->assign('list',$this->model->recognizeeList());

			if(preg_match("/^1[34578]\d{9}$/", $data['account'])){
				return $this->personManage();
			}else{
				return action('company/companyInfo');
			}

		}elseif($res==-1){
			$this->error('没有该用户',url('/'));
		}elseif($res==-2){
			$this->error('您的企业认证还未通过,如有疑问请联系13888888888',url('/'));
		}else{
			$this->error('密码错误',url('/'));
		}
	}

	// /**
	//  * 获取用户身份
	//  * @return [type] [json]
	//  */
	// public function getUserType()
	// {
	// 	$account = input('post.account');

	// 	$r = Db::name('user')->where('account',$account)->find();

	// 	if(!empty($r)){
	// 		return $this->jsonSuc('获取成功',$r);
	// 	}else{
	// 		return $this->jsonSuc('没有该用户');
	// 	}
	// }

	/**
	 * 个人注册,公司注册
	 * @return [type] [json]
	 */
	public function register()
	{
		$data   = input('post.');

		$result = $this->model->userReg($data);

		switch ($result) {
			case 1:
				return $this->jsonSuc('注册成功');
				break;
			case -1:
				return $this->jsonErr('验证码错误!');
				break;
			case -1.1:
				return $this->jsonErr('验证码过期!');
				break;
			case -1.2:
				return $this->jsonErr('验证码已经使用!');
				break;
			case -2:
				return $this->jsonErr('重置失败,网络错误!');
				break;
			case -3:
				return $this->jsonErr('帐号已经注册!');
				break;
		}
	}

	/**
	 * 重置密码
	 * @return [type] [description]
	 */
	public function rePwd()
	{
		$data 	= input('post.');
		$result = $this->model->rePwd($data);

		switch ($result) {
			case 1:
				return $this->jsonSuc('重置成功',url('/'));
				break;
			case -1:
				return $this->jsonErr('验证码错误!');
				break;
			case -1.1:
				return $this->jsonErr('验证码过期!');
				break;
			case -1.2:
				return $this->jsonErr('验证码已经使用!');
				break;
			case -2:
				return $this->jsonErr('重置失败,网络错误!');
				break;
		}
	}

	/**
	 * 获取验证码
	 * @return [type] [json]
	 */
	public function getCode()
	{
		$account = input('post.account');

		$type    = input('post.type');//0注册,1忘记密码

		$userInfo = $this->model->where('account',$account)->find();

		if($type){
			if(empty($userInfo)){
				return $this->jsonErr('该帐号未注册!');
			}
		}else{
			if(!empty($userInfo)){
				return $this->jsonErr('该帐号已经注册!');
			}
		}



		if(getCode($account)){
			return $this->jsonSuc('获取成功');
		}else{
			return $this->jsonErr('获取失败');
		};
	}

	/**
	 * 退出登录
	 * @return [type] [description]
	 */
	public function loginOut()
	{
		Cookie::delete('uid');
		Cookie::delete('account');
		Cookie::delete('zscAccount');
		Cookie::delete('zscPassword');
		$this->success('退出成功',url('/'));
	}



	/**
	 * 被保人资料提交审核
	 * @return [type] [description]
	 */
	public function userAudit()
	{
		$data = input('post.');

		$data['uid'] = $this->uid;

		$data['papersType'] = '身份证';

		if(!empty($data['rid'])){
			$data['papersImgx'] 	  = $data['epapersImgx'];
			$data['papersImgy'] 	  = $data['epapersImgy'];
			$data['handIdentityImg']  = $data['ehandIdentityImg'];

			//支付订单添加联系人
			if($data['rid']=='addInfo'){
				$result = model('Recognizee')->allowField(true)->save($data);
			}else{
				$data['papersTime'] = strtotime($data['papersTime']);
				$result = model('Recognizee')->where('rid',$data['rid'])->update($data);
			}
		}else{
			$result = model('Recognizee')->allowField(true)->save($data);

		}

		// name=db&sex=0&epapersImgx=322&epapersImgy=323&papersTime=2018-03-10&ehandIdentityImg=324&rid=addInfo

		if($result===false){
			return $this->jsonErr('操作失败');
		}

		if($result>0){
			return $this->jsonSuc('操作成功');
		}else{
			return $this->jsonSuc('未修改数据,操作成功');
		}

	}

	/**
	 * 被保人信息
	 * @return [type] [description]
	 */
	public function recognizeeInfo()
	{
		$rid  = input('post.rid');

		$info = model('Recognizee')->get($rid);

		/*编辑字段重新定义*/
		$info['epapersImgx'] 	  = $info['papersImgx'];
		$info['epapersImgy'] 	  = $info['papersImgy'];
		$info['ehandIdentityImg'] = $info['handIdentityImg'];


		$info['epapersImgxUrl'] 	  = get_cover($info['papersImgx'],'path');
		$info['epapersImgyUrl'] 	  = get_cover($info['papersImgy'],'path');
		$info['ehandIdentityImgUrl']  = get_cover($info['handIdentityImg'],'path');


		return $this->jsonSuc('获取成功',$info);
	}

	/**
	 * 被保人删除
	 * @return [type] [description]
	 */
	public function userDelete($rid)
	{
		if(model('Recognizee')->where('uid',$this->uid)->delete($rid)){
			$this->success('删除成功',url('index/user/personmanage'));
		}else{
			$this->error('删除失败',url('index/user/personmanage'));
		}
	}

	/**
	 * 个人中心页面
	 * @return [type] [description]
	 */
	public function personManage()
	{
		$this->assign('field',$this->field);

		// $this->assign('bcbc',[]);

		$this->assign('list',$this->model->recognizeeList());

		return $this->fetch('person_manage');
	}


	/**
	 * 我的订单页面
	 * @return [type] [description]
	 */
	public function mine()
	{
		// $list = model('order')->select();
		$where = '';
		$wheres = '';

		$type = input('type');

		$title = input('title');

		if($type==1){
			$where = "a.status=0 and a.uid=".$this->uid."";//未支付
		}else if($type==2){
			$where = "a.endTime>".time()." and a.status=2 and a.uid=".$this->uid."";//保障中
		}else if($type==3){
			$where = "a.status=3";//理赔中
		}else if($type==4){
			$where = "a.endTime<".time()." and a.status=2 and a.uid=".$this->uid."";//已到期
		}else{
			$where = 'a.uid='.$this->uid.'';
		}

		if($title){
			$wheres = "a.pid like '%$title%' or a.orderNo like '%$title%' and a.uid=".$this->uid."";//已到期
		}

		$list = Db::table('order a')
				->join('recognizee b',"a.rid=b.rid")
				->join('product c',"a.pid=c.pid")
				->field('a.startProtect,a.createTime,a.oid,a.orderNo,a.status,a.endTime,b.name,c.name as cName,c.image,c.money,c.pid as cpid')
				->order('a.createTime desc')
				->where($where)
				->where($wheres)
				->paginate(10);

		$lists = $list->all();
		//修改时间代替评价选择
		foreach ($lists as $k => $v) {

			$comment = Db::name('comment')->where(['uid'=>$this->uid,'pid'=>$lists[$k]['cpid'],'oid'=>$lists[$k]['oid']])->find();

			if(!empty($comment)){
				$lists[$k]['comment'] = 1;
			}else{
				$lists[$k]['comment'] = 0;
			}
		}

		// $noPay = model('order')->where('status',0)->where('uid',$this->uid)->count();
		//未支付个数
		$noPay = Db::table('order a')
			        ->join('product b','a.pid=b.pid')
			        ->join('user c','b.uid=c.uid')
		        	->join('recognizee d','d.rid=a.rid')
			        ->where('a.uid='.$this->uid.' and a.status=0')
			        ->count();

		$data = array(
			'list' => $lists,
			'page' => $list->render(),
		);

		$this->assign($data);
		$this->assign('noPay',$noPay);//未支付个数
		$this->assign('type',$type);//点击筛选
		// $this->assign('comment',$comment);//是否支付
		return $this->fetch('mine');
	}


	/**
	 * 我的收藏
	 * @return [type] [description]
	 */
	public function favorite()
	{
		$list = Db::table('collect a')
					->join('product b','a.pid=b.pid')
					->field('b.name,b.money,b.image,b.pid')
					->where('a.uid='.$this->uid.'')
					->paginate(10);

		$data = array(
			'list' => $list,
			'page' => $list->render(),
		);

		$this->assign($data);

		return $this->fetch('favorite');
	}

}
