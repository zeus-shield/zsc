<?php


namespace app\admin\controller;
use app\common\controller\Admin;

class Menu extends Admin {

	public function _initialize() {
		parent::_initialize();
	}

	public function index() {
		$map   = array();
		$title = trim(input('get.title'));
		$list  = db("Menu")->where($map)->field(true)->order('sort asc,id asc')->column('*', 'id');
		int_to_string($list, array('hide' => array(1 => '是', 0 => '否'), 'is_dev' => array(1 => '是', 0 => '否')));

		if (!empty($list)) {
			$tree = new \com\Tree();
			$list = $tree->toFormatTree($list);
		}
		// 记录当前列表页的cookie
		Cookie('__forward__', $_SERVER['REQUEST_URI']);

		$this->setMeta('菜单列表');
		$this->assign('list', $list);
		return $this->fetch();
	}	
}