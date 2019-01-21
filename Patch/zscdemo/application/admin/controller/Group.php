<?php

namespace app\admin\controller;
use app\common\controller\Admin;

class Group extends Admin {

	protected $model;
	protected $rule;

	public function _initialize() {
		parent::_initialize();
		$this->group = model('AuthGroup');
		$this->rule  = model('AuthRule');
	}
	//会员分组首页控制器
	public function index($type = 'admin') {
		$map['module'] = $type;

		$list = db('AuthGroup')->where($map)->order('id desc')->paginate(10);

		$data = array(
			'list' => $list,
			'page' => $list->render(),
			'type' => $type,
		);
		$this->assign($data);
		$this->setMeta('用户组管理');
		return $this->fetch();
	}
	//会员分组添加控制器
	public function add($type = 'admin') {
		if (IS_POST) {
			$result = $this->group->change();
			if ($result) {
				return $this->success("添加成功！", url('admin/group/index'));
			} else {
				return $this->error("添加失败！");
			}
		} else {
			$data = array(
				'info'    => array('module' => $type, 'status' => 1),
				'keyList' => $this->group->keyList,
			);
			$this->assign($data);
			$this->setMeta('添加用户组');
			return $this->fetch('public/edit');
		}
	}
}