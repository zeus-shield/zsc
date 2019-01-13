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
	public function index() {
		if ($this->modelInfo['list_grid'] == '') {
			return $this->error("列表定义不正确！", url('admin/model/edit', array('id' => $this->modelInfo['id'])));
		}
		$grid_list = get_grid_list($this->modelInfo['list_grid']);
		$order     = "id desc";
		$map       = $this->buildMap();
		$field     = array_filter($grid_list['fields']);
		if ($this->modelInfo['extend'] == 1) {
			array_push($field, 'is_top');
		} else {
			unset($map['model_id']);
		}

		$list = $this->model->lists($map, $order);

		$data = array(
			'grid' => $grid_list,
			'list' => $list,
			'page' => $list->render(),
		);
		if ($this->modelInfo['template_list']) {
			$template = 'content/' . $this->modelInfo['template_list'];
		} else {
			$template = 'content/index';
		}
		$this->assign($data);
		$this->setMeta($this->modelInfo['title'] . "列表");
		return $this->fetch($template);
	}
	public function add() {
		if (IS_POST) {
			$result = $this->model->change();
			if ($result) {
				return $this->success("添加成功！", url('admin/content/index', array('model_id' => $this->modelInfo['id'])));
			} else {
				return $this->error($this->model->getError(), url('admin/content/add', array('model_id' => $this->modelInfo['id'])));
			}
		} else {
			$info = array(
				'model_id' => $this->modelInfo['id'],
			);
			$data = array(
				'info'       => $info,
				'fieldGroup' => $this->getField($this->modelInfo),
			);
			if ($this->modelInfo['template_add']) {
				$template = 'content/' . $this->modelInfo['template_add'];
			} else {
				$template = 'public/edit';
			}
			$this->assign($data);
			$this->setMeta("添加" . $this->modelInfo['title']);
			return $this->fetch($template);
		}
	}
	public function edit($id) {
		if (IS_POST) {
			$result = $this->model->change();
			if ($result !== false) {
				return $this->success("更新成功！", url('admin/content/index', array('model_id' => $this->modelInfo['id'])));
			} else {
				return $this->error($this->model->getError(), url('admin/content/edit', array('model_id' => $this->modelInfo['id'], 'id' => $id)));
			}
		} else {
			if (!$id) {
				return $this->error("非法操作！");
			}
			$info = $this->model->detail($id);
			if (!$info) {
				return $this->error($this->model->getError());
			}
			$info['model_id'] = $this->modelInfo['id'];
			$data             = array(
				'info'       => $info,
				'fieldGroup' => $this->getField($this->modelInfo),
			);
			if ($this->modelInfo['template_edit']) {
				$template = 'content/' . $this->modelInfo['template_edit'];
			} else {
				$template = 'public/edit';
			}
			$this->assign($data);
			$this->setMeta("编辑" . $this->modelInfo['title']);
			return $this->fetch($template);
		}
	}
	public function del() {
		$id = $this->getArrayParam('id');
		if (empty($id)) {
			return $this->error("非法操作！");
		}

		$map['id'] = array('IN', $id);
		$result    = $this->model->del($map);

		if (false !== $result) {
			return $this->success("删除成功！");
		} else {
			return $this->error("删除失败！");
		}
	}
}