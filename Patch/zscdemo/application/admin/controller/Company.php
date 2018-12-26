<?php


namespace app\admin\controller;
use app\common\controller\Admin;
use think\Db;
class Company extends Admin {

	private $model;
	public function _initialize()
    {
    	parent::_initialize();
        $this->model = model('Users');
    }

	public function index($id=null) {
		$list = $this->model->where('type',1)->paginate(15);

		$data = array(
			'list' => $list,
			'page' => $list->render(),
		);

		$this->assign($data);

		$this->setMeta('公司信息');

		return $this->fetch('index');
	}    
}