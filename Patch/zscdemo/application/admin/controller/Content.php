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
	public function status($id, $status) {
		$model = $this->model;

		$map['id'] = $id;
		$result    = $model::where($map)->setField('status', $status);
		if (false !== $result) {
			return $this->success("操作成功！");
		} else {
			return $this->error("操作失败！！");
		}
	}
	public function settop($id, $is_top) {
		$model = $this->model;

		$map['id'] = $id;
		$result    = $model::where($map)->setField('is_top', $is_top);
		if (false !== $result) {
			return $this->success("操作成功！");
		} else {
			return $this->error("操作失败！！");
		}
	}
	protected function getField() {
		$field_group = parse_config_attr($this->modelInfo['field_group']);
		$field_sort  = json_decode($this->modelInfo['field_sort'], true);

		if ($this->modelInfo['extend'] > 1) {
			$map['model_id'] = $this->modelInfo['id'];
		} else {
			$model_id[]      = $this->modelInfo['id'];
			$model_id[]      = 1;
			$map['model_id'] = array('IN', $model_id);
		}
		if ($this->request->action() == 'add') {
			$map['is_show'] = array('in', array('1', '2'));
		} elseif ($this->request->action() == 'edit') {
			$map['is_show'] = array('in', array('1', '3'));
		}

		//获得数组的第一条数组
		$first_key = array_keys($field_group);
		$fields    = model('Attribute')->getFieldlist($map);
		if (!empty($field_sort)) {
			foreach ($field_sort as $key => $value) {
				foreach ($value as $index) {
					if (isset($fields[$index])) {
						$groupfield[$key][] = $fields[$index];
						unset($fields[$index]);
					}
				}
			}
		}
		//未进行排序的放入第一组中
		$fields[] = array('name' => 'model_id', 'type' => 'hidden'); //加入模型ID值
		$fields[] = array('name' => 'id', 'type' => 'hidden'); //加入模型ID值
		foreach ($fields as $key => $value) {
			$groupfield[$first_key[0]][] = $value;
		}

		foreach ($field_group as $key => $value) {
			if ($groupfield[$key]) {
				$data[$value] = $groupfield[$key];
			}
		}
		return $data;
	}
	protected function buildMap() {
		$map  = array();
		$data = $this->request->get();
		foreach ($data as $key => $value) {
			if ($value) {
				if ($key == 'keyword') {
					$map['title'] = array("LIKE", "%$value%");
				} elseif ($key == 'category') {
					$map['category_id'] = $value;
				} elseif ($key == 'create_time') {
					$map['create_time'] = array('BETWEEN', array(strtotime($value[0]), strtotime($value[1])));
				} else {
					$map[$key] = $value;
				}
			}
		}
		if (isset($map['page'])) {
			unset($map['page']);
		}
		if ($this->modelInfo['extend'] == 1) {
			$category  = isset($data['category']) ? $data['category'] : '';
			$cate_list = parse_field_bind('category', $category, 0);
			$map['model_id'] = $this->model_id;
			$this->assign('cate_list', $cate_list);
		}
		$this->assign($data);
		return $map;
	}
}