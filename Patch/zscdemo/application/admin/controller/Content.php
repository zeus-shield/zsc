<?php


namespace app\admin\controller;
use app\common\controller\Admin;

class Content extends Admin {

	public function _initialize() {
		parent::_initialize();
		$this->getContentMenu();
		$this->model_id = $model_id = $this->request->param('model_id');
		$row            = db('Model')->select();
		foreach ($row as $key => $value) {
			$list[$value['id']] = $value;
		}

		if (empty($list[$model_id])) {
			return $this->error("无此模型！");
		} else {
			$this->modelInfo = $list[$model_id];
			if ($this->modelInfo['extend'] > 1) {
				$this->model = model('Content')->extend($this->modelInfo['name']);
			} else {
				$this->model = model('Document')->extend($this->modelInfo['name']);
			}
		}

		$this->assign('model_id', $model_id);
		$this->assign('model_list', $list);
	}
}