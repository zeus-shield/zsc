<?php


namespace app\admin\controller;
use app\common\controller\Admin;

class Ad extends Admin {

	protected $ad;
	protected $adplace;

	public function _initialize() {
		parent::_initialize();
		$this->ad      = db('Ad');
		$this->adplace = db('AdPlace');
	}
}