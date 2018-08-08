<?php
/*用户管理模型*/
namespace app\common\model;
use think\Log;
use think\Cookie;
use think\Db;
/*
	用户模型
*/
class Recognizee extends Base{


	protected $autoWriteTimestamp = true;
	protected $createTime         = 'createTime';


	protected $auto = ['uid','PapersTime'];
	protected function getSexAttr($value)
	{
		$sex = [0=>'男',1=>'女'];
       	return $sex[$value];
	}



}