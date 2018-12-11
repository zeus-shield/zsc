<?php


namespace app\admin\controller;
use app\common\controller\Admin;

class Attribute extends Admin {

	//保存的Model句柄
	protected $model;
	protected $attr;

	//初始化
	public function _initialize() {
		parent::_initialize();
		$this->getContentMenu();
		$this->model = model('Attribute');
		//遍历属性列表
		foreach (get_attribute_type() as $key => $value) {
			$this->attr[$key] = $value[0];
		}
		$this->validate_rule = array(
			0            => '请选择',
			'regex'      => '正则验证',
			'function'   => '函数验证',
			'unique'     => '唯一验证',
			'length'     => '长度验证',
			'in'         => '验证在范围内',
			'notin'      => '验证不在范围内',
			'between'    => '区间验证',
			'notbetween' => '不在区间验证',
		);
		$this->auto_type = array(0 => '请选择', 'function' => '函数', 'field' => '字段', 'string' => '字符串');
		$this->the_time  = array(0 => '请选择', '3' => '始 终', '1' => '新 增', '2' => '编 辑');
		$this->field     = $this->getField();
	}

		public function index($model_id = null) {
		$map['model_id'] = $model_id;
		if (!$model_id) {
			return $this->error("非法操作！");
		}

		$list = model('Attribute')->where($map)->order('id desc')->paginate(25);

		$data = array(
			'list'     => $list,
			'model_id' => $model_id,
			'page'     => $list->render(),
		);
		$this->assign($data);
		$this->setMeta('字段管理');
		return $this->fetch();
	}


		public function add() {
		$model_id = input('model_id', '', 'trim,intval');
		if (IS_POST) {
			$result = $this->model->change();
			if ($result) {
				return $this->success("创建成功！", url('Attribute/index', array('model_id' => $model_id)));
			} else {
				return $this->error($this->model->getError());
			}
		} else {
			if (!$model_id) {
				return $this->error('非法操作！');
			}
			$data = array(
				'info'       => array('model_id' => $model_id),
				'fieldGroup' => $this->field,
			);
			$this->assign($data);
			$this->setMeta('添加字段');
			return $this->fetch('public/edit');
		}
	}

		public function edit() {
		if (IS_POST) {
			$result = $this->model->change();
			if ($result) {
				return $this->success("修改成功！", url('Attribute/index', array('model_id' => $_POST['model_id'])));
			} else {
				return $this->error($this->model->getError());
			}
		} else {
			$id   = input('id', '', 'trim,intval');
			$info = db('Attribute')->find($id);
			$data = array(
				'info'       => $info,
				'fieldGroup' => $this->field,
			);
			$this->assign($data);
			$this->setMeta('编辑字段');
			return $this->fetch('public/edit');
		}
	}

		public function del() {
		$id = input('id', '', 'trim,intval');
		if (!$id) {
			return $this->error("非法操作！");
		}

		$result = $this->model->del($id);
		if ($result) {
			return $this->success("删除成功！");
		} else {
			return $this->error($this->model->getError());
		}
	}

	//字段编辑所需字段
	protected function getField() {
		return array(
			'基础' => array(
				array('name' => 'id', 'title' => 'id', 'help' => '', 'type' => 'hidden'),
				array('name' => 'model_id', 'title' => 'model_id', 'help' => '', 'type' => 'hidden'),
				array('name' => 'name', 'title' => '字段名', 'help' => '英文字母开头，长度不超过30', 'type' => 'text'),
				array('name' => 'title', 'title' => '字段标题', 'help' => '请输入字段标题，用于表单显示', 'type' => 'text'),
				array('name' => 'type', 'title' => '字段类型', 'help' => '用于表单中的展示方式', 'type' => 'select', 'option' => $this->attr, 'help' => ''),
				array('name' => 'length', 'title' => '字段长度', 'help' => '字段的长度值', 'type' => 'text'),
				array('name' => 'extra', 'title' => '参数', 'help' => '布尔、枚举、多选字段类型的定义数据', 'type' => 'textarea'),
				array('name' => 'value', 'title' => '默认值', 'help' => '字段的默认值', 'type' => 'text'),
				array('name' => 'remark', 'title' => '字段备注', 'help' => '用于表单中的提示', 'type' => 'text'),
				array('name' => 'is_show', 'title' => '是否显示', 'help' => '是否显示在表单中', 'type' => 'select', 'option' => array('1' => '始终显示', '2' => '新增显示', '3' => '编辑显示', '0' => '不显示'), 'value' => 1),
				array('name' => 'is_must', 'title' => '是否必填', 'help' => '用于自动验证', 'type' => 'select', 'option' => array('0' => '否', '1' => '是')),
			),
			'高级' => array(
				array('name' => 'validate_type', 'title' => '验证方式', 'type' => 'select', 'option' => $this->validate_rule, 'help' => ''),
				array('name' => 'validate_rule', 'title' => '验证规则', 'help' => '根据验证方式定义相关验证规则', 'type' => 'text'),
				array('name' => 'error_info', 'title' => '出错提示', 'type' => 'text', 'help' => ''),
				array('name' => 'validate_time', 'title' => '验证时间', 'help' => '英文字母开头，长度不超过30', 'type' => 'select', 'option' => $this->the_time, 'help' => ''),
				array('name' => 'auto_type', 'title' => '自动完成方式', 'help' => '英文字母开头，长度不超过30', 'type' => 'select', 'option' => $this->auto_type, 'help' => ''),
				array('name' => 'auto_rule', 'title' => '自动完成规则', 'help' => '根据完成方式订阅相关规则', 'type' => 'text'),
				array('name' => 'auto_time', 'title' => '自动完成时间', 'help' => '英文字母开头，长度不超过30', 'type' => 'select', 'option' => $this->the_time),
			),
		);
	}
}