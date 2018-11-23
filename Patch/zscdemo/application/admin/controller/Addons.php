<?php


namespace app\admin\controller;
use app\common\controller\Admin;

class Addons extends Admin {

	protected $addons;

	public function _initialize() {
		parent::_initialize();
		//加入菜单
		$this->getAddonsMenu();
		$this->addons = model('Addons');
		$this->hooks  = db('Hooks');
	}
	
}