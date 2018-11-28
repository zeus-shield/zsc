<?php

namespace app\admin\controller;
use app\common\controller\Admin;

class Action extends Admin {

	
	public function index() {
		$map = array('status' => array('gt', -1));

		$order = "id desc";
		//获取列表数据
		$list = model('Action')->where($map)->order($order)->paginate(10);

		// 记录当前列表页的cookie
		Cookie('__forward__', $_SERVER['REQUEST_URI']);
		$data = array(
			'list' => $list,
			'page' => $list->render(),
		);
		$this->assign($data);
		$this->setMeta('用户行为');
		return $this->fetch();
	}

	public function add() {
		$model = model('Action');
		if (IS_POST) {
			$data   = input('post.');
			$result = $model->save($data);
			if (false != $result) {
				action_log('add_action', 'Action', $result, session('user_auth.uid'));
				return $this->success('添加成功！', url('index'));
			} else {
				return $this->error($model->getError());
			}
		} else {
			$data = array(
				'keyList' => $model->fieldlist,
			);
			$this->assign($data);
			$this->setMeta("添加行为");
			return $this->fetch('public/edit');
		}
	}

	public function edit($id = null) {
		$model = model('Action');
		if (IS_POST) {
			$data   = input('post.');
			$result = $model->save($data, array('id' => $data['id']));
			if ($result !== false) {
				action_log('edit_action', 'Action', $id, session('user_auth.uid'));
				return $this->success('编辑成功！', url('index'));
			} else {
				return $this->error($model->getError());
			}
		} else {
			$info = $model::where(array('id' => $id))->find();
			if (!$info) {
				return $this->error("非法操作！");
			}
			$data = array(
				'info'    => $info,
				'keyList' => $model->fieldlist,
			);
			$this->assign($data);
			$this->setMeta("编辑行为");
			return $this->fetch('public/edit');
		}
	}

	public function del() {
		$id = $this->getArrayParam('id');
		if (empty($id)) {
			return $this->error("非法操作！", '');
		}
		$map['id'] = array('IN', $id);
		$result    = db('Action')->where($map)->delete();
		if ($result) {
			action_log('delete_action', 'Action', $id, session('user_auth.uid'));
			return $this->success('删除成功！');
		} else {
			return $this->error('删除失败！');
		}
	}

	public function setstatus() {
		$id = $this->getArrayParam('id');
		if (empty($id)) {
			return $this->error("非法操作！", '');
		}
		$status    = input('get.status', '', 'trim,intval');
		$message   = !$status ? '禁用' : '启用';
		$map['id'] = array('IN', $id);
		$result    = db('Action')->where($map)->setField('status', $status);
		if ($result !== false) {
			action_log('setstatus_action', 'Action', $id, session('user_auth.uid'));
			return $this->success('设置' . $message . '状态成功！');
		} else {
			return $this->error('设置' . $message . '状态失败！');
		}
	}
}