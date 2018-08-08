<?php
/*用户管理模型*/
namespace app\common\model;
use think\Log;
use think\Cookie;
use think\Db;
/*
	用户模型
*/
class Order extends Base{


	protected $autoWriteTimestamp = true;
	protected $createTime         = 'createTime';


	protected $auto = ['uid','orderNo'];

	protected function setStartProtectAttr($value)
    {
        return strtotime($value);
    }

    protected function setEndTimeAttr($value)
    {
        return strtotime($value);
    }

    protected function setOrderNoAttr($value)
    {
       return date('YmdHi') . str_pad(mt_rand(1, 99999), 5, '0', STR_PAD_LEFT);;
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