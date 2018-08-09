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

	protected function setPapersTimeAttr($value)
    {
        return strtotime($value);
    }

    protected function getPapersTimeAttr($value)
    {
        return date('Y-m-d',$value);
    }

    protected function setUidAttr($value)
    {
    	return Cookie::get('uid');
    }




 //    protected function getPapersImgxAttr($value, $data){
	// 	return get_cover($value,'path');
	// }

	// protected function getPapersImgYAttr($value, $data){
	// 	return get_cover($value,'path');
	// }

	// protected function getHandIdentityImgAttr($value, $data){
	// 	return get_cover($value,'path');
	// }


}