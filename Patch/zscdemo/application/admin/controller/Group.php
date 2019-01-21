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
	//会员分组编辑控制器
	public function edit($id) {
		if (!$id) {
			return $this->error("非法操作！");
		}
		if (IS_POST) {
			$result = $this->group->change();
			if ($result) {
				return $this->success("编辑成功！", url('admin/group/index'));
			} else {
				return $this->error("编辑失败！");
			}
		} else {
			$info = $this->group->where(array('id' => $id))->find();
			$data = array(
				'info'    => $info,
				'keyList' => $this->group->keyList,
			);
			$this->assign($data);
			$this->setMeta('编辑用户组');
			return $this->fetch('public/edit');
		}
	}
	//会员分组编辑字段控制器
	public function editable() {
		$pk     = input('pk', '', 'trim,intval');
		$name   = input('name', '', 'trim');
		$value  = input('value', '', 'trim');
		$result = $this->group->where(array('id' => $pk))->setField($name, $value);
		if ($result) {
			return $this->success("删除成功！");
		} else {
			return $this->error("删除失败！");
		}
	}
	//会员分组删除控制器
	public function del() {
		$id = $this->getArrayParam('id');
		if (empty($id)) {
			return $this->error("非法操作！");
		}
		$result = $this->group->where(array('id' => array('IN', $id)))->delete();
		if ($result) {
			return $this->success("删除成功！");
		} else {
			return $this->error("删除失败！");
		}
	}
	//权限节点控制器
	public function access($type = 'admin') {
		$map['module'] = $type;

		$list = db('AuthRule')->where($map)->order('id desc')->paginate(15);

		$data = array(
			'list' => $list,
			'page' => $list->render(),
			'type' => $type,
		);
		$this->assign($data);
		$this->setMeta('权限节点');
		return $this->fetch();
	}
}