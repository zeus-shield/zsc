<?php


namespace app\admin\controller;
use app\common\controller\Admin;

class Category extends Admin {

	public function _initialize() {
		parent::_initialize();
		$this->getContentMenu();
	}

	public function index() {
		$map  = array('status' => array('gt', -1));
		$list = db('Category')->where($map)->order('sort asc,id asc')->column('*', 'id');

		if (!empty($list)) {
			$tree = new \com\Tree();
			$list = $tree->toFormatTree($list);
		}

		$this->assign('tree', $list);
		$this->setMeta('栏目列表');
		return $this->fetch();
	}

	/* 单字段编辑 */
	public function editable($name = null, $value = null, $pk = null) {
		if ($name && ($value != null || $value != '') && $pk) {
			db('Category')->where(array('id' => $pk))->setField($name, $value);
		}
	}

}