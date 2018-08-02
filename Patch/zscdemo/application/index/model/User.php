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
}