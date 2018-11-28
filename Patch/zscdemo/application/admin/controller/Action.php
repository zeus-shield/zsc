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

	
}