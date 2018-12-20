<?php


namespace app\admin\controller;
use app\common\controller\Admin;

class Menu extends Admin {

	public function _initialize() {
		parent::_initialize();
	}

	public function index() {
		$map   = array();
		$title = trim(input('get.title'));
		$list  = db("Menu")->where($map)->field(true)->order('sort asc,id asc')->column('*', 'id');
		int_to_string($list, array('hide' => array(1 => '是', 0 => '否'), 'is_dev' => array(1 => '是', 0 => '否')));

		if (!empty($list)) {
			$tree = new \com\Tree();
			$list = $tree->toFormatTree($list);
		}
		// 记录当前列表页的cookie
		Cookie('__forward__', $_SERVER['REQUEST_URI']);

		$this->setMeta('菜单列表');
		$this->assign('list', $list);
		return $this->fetch();
	}	

	public function editable($name = null, $value = null, $pk = null) {
		if ($name && ($value != null || $value != '') && $pk) {
			db('Menu')->where(array('id' => $pk))->setField($name, $value);
		}
	}	

	public function add() {
		if (IS_POST) {
			$Menu = model('Menu');
			$data = input('post.');
			$id   = $Menu->save($data);
			if ($id) {
				session('admin_menu_list', null);
				//记录行为
				action_log('update_menu', 'Menu', $id, session('user_auth.uid'));
				return $this->success('新增成功', Cookie('__forward__'));
			} else {
				return $this->error('新增失败');
			}
		} else {
			$this->assign('info', array('pid' => input('pid')));
			$menus = db('Menu')->select();
			$tree  = new \com\Tree();
			$menus = $tree->toFormatTree($menus);
			if (!empty($menus)) {
				$menus = array_merge(array(0 => array('id' => 0, 'title_show' => '顶级菜单')), $menus);
			} else {
				$menus = array(0 => array('id' => 0, 'title_show' => '顶级菜单'));
			}

			$this->assign('Menus', $menus);
			$this->setMeta('新增菜单');
			return $this->fetch('edit');
		}
	}	


	public function edit($id = 0) {
		if (IS_POST) {
			$Menu = model('Menu');
			$data = input('post.');
			if ($Menu->save($data, array('id' => $data['id'])) !== false) {
				session('admin_menu_list', null);
				//记录行为
				action_log('update_menu', 'Menu', $data['id'], session('user_auth.uid'));
				return $this->success('更新成功', Cookie('__forward__'));
			} else {
				return $this->error('更新失败');
			}
		} else {
			$info = array();
			/* 获取数据 */
			$info  = db('Menu')->field(true)->find($id);
			$menus = db('Menu')->field(true)->select();
			$tree  = new \com\Tree();
			$menus = $tree->toFormatTree($menus);

			$menus = array_merge(array(0 => array('id' => 0, 'title_show' => '顶级菜单')), $menus);
			$this->assign('Menus', $menus);
			if (false === $info) {
				return $this->error('获取后台菜单信息错误');
			}
			$this->assign('info', $info);
			$this->setMeta('编辑后台菜单');
			return $this->fetch();
		}
	}	

	public function del() {
		$id = $this->getArrayParam('id');

		if (empty($id)) {
			return $this->error('请选择要操作的数据!');
		}

		$map = array('id' => array('in', $id));
		if (db('Menu')->where($map)->delete()) {
			session('admin_menu_list', null);
			//记录行为
			action_log('update_menu', 'Menu', $id, session('user_auth.uid'));
			return $this->success('删除成功');
		} else {
			return $this->error('删除失败！');
		}
	}	


	public function toogleHide($id, $value = 1) {
		session('admin_menu_list', null);
		$result = db('Menu')->where(array('id' => $id))->setField(array('hide' => $value));
		if ($result !== false) {
			return $this->success('操作成功！');
		} else {
			return $this->error('操作失败！');
		}
	}	


	public function toogleDev($id, $value = 1) {
		session('admin_menu_list', null);
		$result = db('Menu')->where(array('id' => $id))->setField(array('is_dev' => $value));
		if ($result !== false) {
			return $this->success('操作成功！');
		} else {
			return $this->error('操作失败！');
		}
	}	


	public function importFile($tree = null, $pid = 0) {
		if ($tree == null) {
			$file = APP_PATH . "Admin/Conf/Menu.php";
			$tree = require_once $file;
		}
		$menuModel = D('Menu');
		foreach ($tree as $value) {
			$add_pid = $menuModel->add(
				array(
					'title' => $value['title'],
					'url'   => $value['url'],
					'pid'   => $pid,
					'hide'  => isset($value['hide']) ? (int) $value['hide'] : 0,
					'tip'   => isset($value['tip']) ? $value['tip'] : '',
					'group' => $value['group'],
				)
			);
			if ($value['operator']) {
				$this->import($value['operator'], $add_pid);
			}
		}
	}	


	public function import() {
		if (IS_POST) {
			$tree      = input('post.tree');
			$lists     = explode(PHP_EOL, $tree);
			$menuModel = db('Menu');
			if ($lists == array()) {
				return $this->error('请按格式填写批量导入的菜单，至少一个菜单');
			} else {
				$pid = input('post.pid');
				foreach ($lists as $key => $value) {
					$record = explode('|', $value);
					if (count($record) == 4) {
						$menuModel->add(array(
							'title'  => $record[0],
							'url'    => $record[1],
							'pid'    => $record[2],
							'sort'   => 0,
							'hide'   => 0,
							'tip'    => '',
							'is_dev' => 0,
							'group'  => $record[3],
						));
					}
				}
				session('admin_menu_list', null);
				return $this->success('导入成功', url('index?pid=' . $pid));
			}
		} else {
			$this->setMeta('批量导入后台菜单');
			$pid = (int) input('get.pid');
			$this->assign('pid', $pid);
			$data = db('Menu')->where("id={$pid}")->field(true)->find();
			$this->assign('data', $data);
			return $this->fetch();
		}
	}	

	public function sort() {
		if (IS_GET) {
			$ids = input('ids');
			$pid = input('pid');

			//获取排序的数据
			$map = array('status' => array('gt', -1));
			if (!empty($ids)) {
				$map['id'] = array('in', $ids);
			} else {
				if ($pid !== '') {
					$map['pid'] = $pid;
				}
			}
			$list = db('Menu')->where($map)->field('id,title')->order('sort asc,id asc')->select();

			$this->assign('list', $list);
			$this->setMeta('菜单排序');
			return $this->fetch();
		} elseif (IS_POST) {
			$ids = input('post.ids');
			$ids = explode(',', $ids);
			foreach ($ids as $key => $value) {
				$res = db('Menu')->where(array('id' => $value))->setField('sort', $key + 1);
			}
			if ($res !== false) {
				session('admin_menu_list', null);
				return $this->success('排序成功！');
			} else {
				return $this->error('排序失败！');
			}
		} else {
			return $this->error('非法请求！');
		}
	}	
}