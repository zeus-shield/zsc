<?php


namespace app\admin\controller;
use app\common\controller\Admin;

class Seo extends Admin {

	protected $seo;
	protected $rewrite;

	public function _initialize() {
		parent::_initialize();
		$this->seo     = model('SeoRule');
		$this->rewrite = model('Rewrite');
	}

	public function index($page = 1, $r = 20) {
		//读取规则列表
		$map = array('status' => array('EGT', 0));

		$list = $this->seo->where($map)->order('sort asc')->paginate(10);

		$data = array(
			'list' => $list,
			'page' => $list->render(),
		);
		$this->assign($data);
		$this->setMeta("规则列表");
		return $this->fetch();
	}

}