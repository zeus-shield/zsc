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
}