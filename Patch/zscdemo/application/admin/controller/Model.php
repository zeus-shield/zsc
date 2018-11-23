<?php


namespace app\admin\controller;
use app\common\controller\Admin;

class Model extends Admin {

	public function _initialize() {
		parent::_initialize();
		$this->getContentMenu();
	}
}