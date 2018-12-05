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

		public function del($id) {
		$uid = array('IN', is_array($id) ? implode(',', $id) : $id);
		//获取用户信息
		$find = $this->getUserinfo($uid);
		model('User')->where(array('uid' => $uid))->delete();
		return $this->success('删除用户成功！');
	}

		public function auth() {
		$access = model('AuthGroupAccess');
		$group  = model('AuthGroup');
		if (IS_POST) {
			$uid = input('uid', '', 'trim,intval');
			$access->where(array('uid' => $uid))->delete();
			$group_type = config('user_group_type');
			foreach ($group_type as $key => $value) {
				$group_id = input($key, '', 'trim,intval');
				if ($group_id) {
					$add = array(
						'uid'      => $uid,
						'group_id' => $group_id,
					);
					$access->save($add);
				}
			}
			return $this->success("设置成功！");
		} else {
			$uid  = input('id', '', 'trim,intval');
			$row  = $group::select();
			$auth = $access::where(array('uid' => $uid))->select();

			$auth_list = array();
			foreach ($auth as $key => $value) {
				$auth_list[] = $value['group_id'];
			}
			foreach ($row as $key => $value) {
				$list[$value['module']][] = $value;
			}
			$data = array(
				'uid'       => $uid,
				'auth_list' => $auth_list,
				'list'      => $list,
			);
			$this->assign($data);
			$this->setMeta("用户分组");
			return $this->fetch();
		}
	}

}