<?php


namespace app\admin\controller;
use app\common\controller\Admin;

class Ad extends Admin {

	protected $ad;
	protected $adplace;

	public function _initialize() {
		parent::_initialize();
		$this->ad      = db('Ad');
		$this->adplace = db('AdPlace');
	}

	public function index() {
		$map   = array();
		$order = "id desc";

		$list = db('AdPlace')->where($map)->order($order)->paginate(10);
		$data = array(
			'list' => $list,
			'page' => $list->render(),
		);
		$this->assign($data);
		$this->setMeta("广告管理");
		return $this->fetch();
	}	


	public function add() {
		$place = model('AdPlace');
		if (IS_POST) {
			$result = $place->change();
			if (false !== false) {
				return $this->success("添加成功！");
			} else {
				return $this->error($place->getError());
			}
		} else {
			$data = array(
				'keyList' => $place->keyList,
			);
			$this->assign($data);
			$this->setMeta("添加广告位");
			return $this->fetch('public/edit');
		}
	}
}