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

		public function edit($id = null) {
		$place = model('AdPlace');
		if (IS_POST) {
			$result = $place->change();
			if ($result) {
				return $this->success("修改成功！", url('admin/ad/index'));
			} else {
				return $this->error($this->adplace->getError());
			}
		} else {
			$info = db('AdPlace')->where(array('id' => $id))->find();
			if (!$info) {
				return $this->error("非法操作！");
			}
			$data = array(
				'info'    => $info,
				'keyList' => $place->keyList,
			);
			$this->assign($data);
			$this->setMeta("编辑广告位");
			return $this->fetch('public/edit');
		}
	}


		public function del() {
		$id = $this->getArrayParam('id');

		if (empty($id)) {
			return $this->error("非法操作！");
		}
		$map['id'] = array('IN', $id);
		$result    = $this->adplace->where($map)->delete();
		if ($result) {
			return $this->success("删除成功！");
		} else {
			return $this->error("删除失败！");
		}
	}

		public function lists($id = null) {
		$map['place_id'] = $id;
		$order           = "id desc";

		$list = db('Ad')->where($map)->order($order)->paginate(10);
		$data = array(
			'id'   => $id,
			'list' => $list,
			'page' => $list->render(),
		);
		$this->assign($data);
		$this->setMeta("广告管理");
		return $this->fetch();
	}
}