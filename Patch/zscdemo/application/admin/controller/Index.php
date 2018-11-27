<?php


namespace app\admin\controller;
use app\common\controller\Admin;

class Index extends Admin {

	public function index() {
		$this->setMeta('后台首页');
		return $this->fetch();
	}

}