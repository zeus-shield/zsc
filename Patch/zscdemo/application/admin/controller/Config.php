<?php


namespace app\admin\controller;
use app\common\controller\Admin;

class Config extends Admin {

	public function _initialize() {
		parent::_initialize();
		$this->model = model('Config');
	}
}