<?php


namespace app\admin\controller;
use app\common\controller\Admin;

class Link extends Admin {

	public function index() {
		$map = array();

		$order = "id desc";
		$list  = db('Link')->where($map)->order($order)->paginate(10);

		$data = array(
			'list' => $list,
			'page' => $list->render(),
		);
		$this->assign($data);
		$this->setMeta("友情链接");
		return $this->fetch();
	}


	public function add() {
		$link = model('Link');
		if (IS_POST) {
			$data = input('post.');
			if ($data) {
				unset($data['id']);
				$result = $link->save($data);
				if ($result) {
					return $this->success("添加成功！", url('Link/index'));
				} else {
					return $this->error($link->getError());
				}
			} else {
				return $this->error($link->getError());
			}
		} else {
			$data = array(
				'keyList' => $link->keyList,
			);
			$this->assign($data);
			$this->setMeta("添加友链");
			return $this->fetch('public/edit');
		}
	}

		public function edit() {
		$link = model('Link');
		$id   = input('id', '', 'trim,intval');
		if (IS_POST) {
			$data = input('post.');
			if ($data) {
				$result = $link->save($data, array('id' => $data['id']));
				if ($result) {
					return $this->success("修改成功！", url('Link/index'));
				} else {
					return $this->error("修改失败！");
				}
			} else {
				return $this->error($link->getError());
			}
		} else {
			$map  = array('id' => $id);
			$info = db('Link')->where($map)->find();

			$data = array(
				'keyList' => $link->keyList,
				'info'    => $info,
			);
			$this->assign($data);
			$this->setMeta("编辑友链");
			return $this->fetch('public/edit');
		}
	}

	public function delete() {
		$id = $this->getArrayParam('id');
		if (empty($id)) {
			return $this->error('非法操作！');
		}
		$link = db('Link');

		$map    = array('id' => array('IN', $id));
		$result = $link->where($map)->delete();
		if ($result) {
			return $this->success("删除成功！");
		} else {
			return $this->error("删除失败！");
		}
	}	
}