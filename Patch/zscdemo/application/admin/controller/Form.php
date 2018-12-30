<?php


namespace app\admin\controller;
use app\common\controller\Admin;

class Form extends Admin {

	//自定义表单
	public function index(){
		$list = array();

		$data = array(
			'list'   => $list,
			//'page'   => $list->render()
		);
		$this->setMeta('自定义表单');
		$this->assign($data);
		return $this->fetch();
	}

	public function add(){
		if (IS_POST) {
			# code...
		}else{
			return $this->fetch('public/edit');
		}
	}	


	public function edit(){
		if (IS_POST) {
			# code...
		}else{
			return $this->fetch('public/edit');
		}
	}

}