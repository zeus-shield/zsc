<?php


namespace app\admin\controller;
use app\common\controller\Admin;
use think\Db;
class Company extends Admin {

	private $model;
	public function _initialize()
    {
    	parent::_initialize();
        $this->model = model('Users');
    }
}