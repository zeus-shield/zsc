<?php
/*用户管理模型*/
namespace app\common\model;
use think\Log;
use think\Cookie;
use think\Db;
/*
	用户模型
*/
class Product extends Base{

	protected function getRecommendAttr($value)
	{
		$sex = [0=>'不推荐',1=>'推荐'];
       	return $sex[$value];
	}

	protected function setPapersTimeAttr($value)
    {
        return strtotime($value);
    }

    /*上架时间*/
    protected function getAddedTimeAttr($value)
    {
        return date('Y-m-d H:i:s',$value);
    }
    /*特色*/
    protected function getTraitAttr($value)
    {
    	return explode(",",$value);
    }

    /*图片*/
	protected function getImageAttr($value, $data){
		return get_cover($value,'path');
	}

	/*分类人群*/
	protected function getClassifyAttr($value){

		$classify = config('classify');

       	return $classify[$value];
	}

	/*险种*/
	protected function getCoverageAttr($value){

		$coverage = config('coverage');

       	return $coverage[$value];
	}

}