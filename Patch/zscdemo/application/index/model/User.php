<?php
/*用户管理模型*/
namespace app\common\model;
use think\Log;
use think\Cookie;
use think\Db;
/*
	用户模型
*/
class User extends Base{

/**
	 * 被保人图片处理
	 * @var array
	 */
	public $recognList = array(
		array('name'=>'papersImgx', 'title'=>'正面', 'type'=>'image', 'help'=>'', 'option'=>''),
		array('name'=>'papersImgy', 'title'=>'背面', 'type'=>'image', 'help'=>'', 'option'=>''),
		array('name'=>'handIdentityImg', 'title'=>'手持', 'type'=>'image', 'help'=>'', 'option'=>''),
	);
	/**
	 * 编辑图片字段
	 * @var array
	 */
	public $eRecognList = array(
		array('name'=>'epapersImgx', 'title'=>'正面', 'type'=>'image', 'help'=>'', 'option'=>''),
		array('name'=>'epapersImgy', 'title'=>'背面', 'type'=>'image', 'help'=>'', 'option'=>''),
		array('name'=>'ehandIdentityImg', 'title'=>'手持', 'type'=>'image', 'help'=>'', 'option'=>''),
	);

	public function getSexAttr($value)
	{
		$sex = [0=>'男',1=>'女',2=>"未设置"];
       	return $sex[$value];
	}
/**
	 * 用户登录
	 * @param  [type] $data [登录参数]
	 * @return [type]       [boole]
	 */
	public function userLogin($data,$reg='')
	{
		$userInfo = $this->where('account',$data['account'])->find();

		if(empty($userInfo)){
			return -1;//没有该用户
		}elseif($userInfo['status']==0){
			return -2;//用户审核没有通过
		}

		$password = $this->pwdEncrypt($data['password'],$userInfo['salt']);

		if($userInfo['password'] == $password && $data['remePwd']==1){
			//保存Cookie
     		Cookie::set("uid",$userInfo['uid'],60*60*30);//默认保存时间为一个月
			Cookie::set("account",$userInfo['account'],60*60*30);
			Cookie::set("zscAccount",$userInfo['account'],60*60*30);//默认保存时间为一个月
			Cookie::set("zscPassword",$data['password'],60*60*30);
	

     		if(preg_match("/^1[34578]\d{9}$/", $data['account'])){
				Cookie::set('type',0,60*60*30);//个人用户登录
 			}else{
				Cookie::set('type',1,60*60*30);//企业用户登录
 			}
     		return true;
		}elseif($userInfo['password'] == $password){
			//不保存cookie, 关闭浏览器自动清楚
     		Cookie::set("uid",$userInfo['uid']);
			Cookie::set("account",$userInfo['account']);
			Cookie::set("zscAccount",$userInfo['account']);//默认保存时间为一个月
			Cookie::set("zscPassword",$data['password']);
		

     		if(preg_match("/^1[34578]\d{9}$/", $data['account'])){
				Cookie::set('type',0);//个人用户登录
 			}else{
				Cookie::set('type',1);//企业用户登录
 			}
     		return true;
		}else{
			return false;//密码错误
		}
	}
}