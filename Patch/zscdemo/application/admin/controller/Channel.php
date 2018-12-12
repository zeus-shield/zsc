<?php


namespace app\admin\controller;
use app\common\controller\Admin;

class Channel extends Admin {

	public function _initialize() {
		parent::_initialize();
	}

	public function index($type = 0) {
		/* 获取频道列表 */
		//$map  = array('status' => array('gt', -1), 'pid'=>$pid);
		$map  = array('status' => array('gt', -1));
		if ($type) {
			$map['type']   = $type;
		}
		$list = db('Channel')->where($map)->order('sort asc,id asc')->column('*', 'id');

		if (!empty($list)) {
			$tree = new \com\Tree();
			$list = $tree->toFormatTree($list);
		}

		config('_sys_get_channel_tree_', true);

		$data = array(
			'tree' => $list,
			'type' => $type
		);
		$this->assign($data);
		$this->setMeta('导航管理');
		return $this->fetch();
	}

}