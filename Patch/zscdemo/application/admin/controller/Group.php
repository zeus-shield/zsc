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
	//根据菜单更新节点
	public function upnode($type) {
		$rule = model('Menu')->getAuthNodes($type);
		$reuslt = $this->rule->uprule($rule, $type);
		return $this->success("更新成功！");
	}
	/**
	 * 授权
	 */
	public function auth($id) {
		if (!$id) {
			return $this->error("非法操作！");
		}
		if (IS_POST) {
			$rule          = $this->request->post('rule/a', array());
			$extend_rule   = $this->request->post('extend_rule/a', array());
			$extend_result = $rule_result = false;
			//扩展权限
			$extend_data = array();
			foreach ($extend_rule as $key => $value) {
				foreach ($value as $item) {
					$extend_data[] = array('group_id' => $id, 'extend_id' => $item, 'type' => $key);
				}
			}
			if (!empty($extend_data)) {
				db('AuthExtend')->where(array('group_id' => $id))->delete();
				$extend_result = db('AuthExtend')->insertAll($extend_data);
			}
			if ($rule) {
				$rules       = implode(',', $rule);
				$rule_result = $this->group->where(array('id' => $id))->setField('rules', $rules);
			}

			if ($rule_result !== false || $extend_result !== false) {
				return $this->success("授权成功！", url('admin/group/index'));
			} else {
				return $this->error("授权失败！");
			}
		} else {
			$group = $this->group->where(array('id' => $id))->find();

			$map['module'] = $group['module'];
			$row           = db('AuthRule')->where($map)->order('id desc')->select();

			$list = array();
			foreach ($row as $key => $value) {
				$list[$value['group']][] = $value;
			}
			//模块
			$model = db('model')->field('id,title,name')
				->where(array('status' => array('gt', 0), 'extend' => array('gt', 0)))
				->select();
			//扩展权限
			$extend_auth = db('AuthExtend')->where(array('group_id' => $id, 'type' => 2))->column('extend_id');
			$data        = array(
				'list'        => $list,
				'model'       => $model,
				'extend_auth' => $extend_auth,
				'auth_list'   => explode(',', $group['rules']),
				'id'          => $id,
			);
			$this->assign($data);
			$this->setMeta('授权');
			return $this->fetch();
		}
	}
	public function addnode($type = 'admin') {
		if (IS_POST) {
			$result = $this->rule->change();
			if ($result) {
				return $this->success("创建成功！", url('admin/group/access'));
			} else {
				return $this->error($this->rule->getError());
			}
		} else {
			$data = array(
				'info'    => array('module' => $type, 'status' => 1),
				'keyList' => $this->rule->keyList,
			);
			$this->assign($data);
			$this->setMeta('添加节点');
			return $this->fetch('public/edit');
		}
	}
	public function editnode($id) {
		if (IS_POST) {
			$result = $this->rule->change();
			if (false !== $result) {
				return $this->success("更新成功！", url('admin/group/access'));
			} else {
				return $this->error("更新失败！");
			}
		} else {
			if (!$id) {
				return $this->error("非法操作！");
			}
			$info = $this->rule->find($id);
			$data = array(
				'info'    => $info,
				'keyList' => $this->rule->keyList,
			);
			$this->assign($data);
			$this->setMeta('编辑节点');
			return $this->fetch('public/edit');
		}
	}
}