<?php


namespace app\admin\controller;
use app\common\controller\Admin;

class Category extends Admin {

	public function _initialize() {
		parent::_initialize();
		$this->getContentMenu();
	}

	public function index() {
		$map  = array('status' => array('gt', -1));
		$list = db('Category')->where($map)->order('sort asc,id asc')->column('*', 'id');

		if (!empty($list)) {
			$tree = new \com\Tree();
			$list = $tree->toFormatTree($list);
		}

		$this->assign('tree', $list);
		$this->setMeta('栏目列表');
		return $this->fetch();
	}

	/* 单字段编辑 */
	public function editable($name = null, $value = null, $pk = null) {
		if ($name && ($value != null || $value != '') && $pk) {
			db('Category')->where(array('id' => $pk))->setField($name, $value);
		}
	}

	/* 编辑分类 */
	public function edit($id = null, $pid = 0) {
		if (IS_POST) {
			$category = model('Category');
			//提交表单
			$result = $category->change();
			if (false !== $result) {
				//记录行为
				action_log('update_category', 'category', $id, session('user_auth.uid'));
				return $this->success('编辑成功！', url('index'));
			} else {
				$error = $category->getError();
				return $this->error(empty($error) ? '未知错误！' : $error);
			}
		} else {
			$cate = '';
			if ($pid) {
				/* 获取上级分类信息 */
				$cate = db('Category')->find($pid);
				if (!($cate && 1 == $cate['status'])) {
					return $this->error('指定的上级分类不存在或被禁用！');
				}
			}
			/* 获取分类信息 */
			$info = $id ? db('Category')->find($id) : '';

			$this->assign('info', $info);
			$this->assign('category', $cate);
			$this->setMeta('编辑分类');
			return $this->fetch();
		}
	}

	/* 新增分类 */
	public function add($pid = 0) {
		$Category = model('Category');

		if (IS_POST) {
			//提交表单
			$id = $Category->change();
			if (false !== $id) {
				action_log('update_category', 'category', $id, session('user_auth.uid'));
				return $this->success('新增成功！', url('index'));
			} else {
				$error = $Category->getError();
				return $this->error(empty($error) ? '未知错误！' : $error);
			}
		} else {
			$cate = array();
			if ($pid) {
				/* 获取上级分类信息 */
				$cate = $Category->info($pid, 'id,name,title,status');
				if (!($cate && 1 == $cate['status'])) {
					return $this->error('指定的上级分类不存在或被禁用！');
				}
			}
			/* 获取分类信息 */
			$this->assign('info', null);
			$this->assign('category', $cate);
			$this->setMeta('新增分类');
			return $this->fetch('edit');
		}
	}		

}