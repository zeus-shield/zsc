<?php


namespace app\index\controller;
use app\common\controller\Fornt;
use app\index\model\Zsc as ZscModel;
use think\Cookie;
use think\Cache;
use think\Db;
class Zsc extends Fornt{
    public function _initialize()
	{
		parent::_initialize();
		
	}

	public function ZscTestLogin() {
		
		return $this->fetch();
	}
	
}