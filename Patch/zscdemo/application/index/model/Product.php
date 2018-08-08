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
    
}