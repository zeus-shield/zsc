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
    //起保时间
    protected function getStartProtectAttr($value)
    {
        return date('Y-m-d',$value);
    }
    //到期时间
    protected function getEndTimeAttr($value)
    {
        return date('Y-m-d',$value);
    }
    //交费方式
    protected function getPayTypeAttr($value)
    {
        if($value){
            return "年交";
        }else{
            return "季交";
        }
    }
    //附加长期医疗
    protected function getMedicalAttr($value)
    {
        if($value){
            return $value;
        }else{
            return "不投保";
        }
    }
    //pid
    protected function getPidAttr($value)
    {
        $name = Db::name('product')->where('pid',$value)->column('name');

        return $name;
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