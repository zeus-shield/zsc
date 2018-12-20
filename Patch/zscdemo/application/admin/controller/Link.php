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
}