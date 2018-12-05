<?php

namespace app\admin\controller;
use app\common\controller\Admin;

class User extends Admin {


	public function index() {
		$nickname      = input('nickname');
		$map['status'] = array('egt', 0);
		if (is_numeric($nickname)) {
			$map['uid|nickname'] = array(intval($nickname), array('like', '%' . $nickname . '%'), '_multi' => true);
		} else {
			$map['nickname'] = array('like', '%' . (string) $nickname . '%');
		}

		$order = "uid desc";
		$list  = model('User')->where($map)->order($order)->paginate(15);

		$data = array(
			'list' => $list,
			'page' => $list->render(),
		);
		$this->assign($data);
		$this->setMeta('用户信息');
		return $this->fetch();
	}


	public function add() {
		$model = \think\Loader::model('User');
		if (IS_POST) {
			$data = $this->request->param();
			//创建注册用户
			$result = $model->register($data['username'], $data['password'], $data['repassword'], $data['email'], false);
			if ($result) {
				return $this->success('用户添加成功！', url('admin/user/index'));
			} else {
				return $this->error($model->getError());
			}
		} else {
			$data = array(
				'keyList' => $model->addfield,
			);
			$this->assign($data);
			$this->setMeta("添加用户");
			return $this->fetch('public/edit');
		}
	}

		public function edit() {
		$model = model('User');
		if (IS_POST) {
			$data = $this->request->post();

			$reuslt = $model->editUser($data, true);

			if (false !== $reuslt) {
				return $this->success('修改成功！', url('admin/user/index'));
			} else {
				return $this->error($model->getError(), '');
			}
		} else {
			$info = $this->getUserinfo();

			$data = array(
				'info'    => $info,
				'keyList' => $model->editfield,
			);
			$this->assign($data);
			$this->setMeta("编辑用户");
			return $this->fetch('public/edit');
		}
	}

}