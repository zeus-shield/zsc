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

	public function add() {
		if (IS_POST) {
			$data   = $this->request->post();
			$result = $this->seo->save($data);
			if ($result) {
				return $this->success("添加成功！");
			} else {
				return $this->error("添加失败！");
			}
		} else {
			$data = array(
				'keyList' => $this->seo->keyList,
			);
			$this->assign($data);
			$this->setMeta("添加规则");
			return $this->fetch('public/edit');
		}
	}

	public function edit($id = null) {
		if (IS_POST) {
			$data   = $this->request->post();
			$result = $this->seo->save($data, array('id' => $data['id']));
			if (false !== $result) {
				return $this->success("修改成功！");
			} else {
				return $this->error("修改失败！");
			}
		} else {
			$id   = input('id', '', 'trim,intval');
			$info = $this->seo->where(array('id' => $id))->find();
			$data = array(
				'info'    => $info,
				'keyList' => $this->seo->keyList,
			);
			$this->assign($data);
			$this->setMeta("编辑规则");
			return $this->fetch('public/edit');
		}
	}

	public function del() {
		$id = $this->getArrayParam('id');
		if (empty($id)) {
			return $this->error("非法操作！");
		}
		$result = $this->seo->where(array('id' => array('IN', $id)))->delete();
		if ($result) {
			return $this->success("删除成功！");
		} else {
			return $this->error("删除失败！");
		}
	}
}