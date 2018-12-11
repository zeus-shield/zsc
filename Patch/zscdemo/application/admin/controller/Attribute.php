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
}