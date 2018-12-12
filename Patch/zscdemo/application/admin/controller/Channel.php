<?php


namespace app\admin\controller;
use app\common\controller\Admin;

class Channel extends Admin {

	public function _initialize() {
		parent::_initialize();
	}

	public function index($type = 0) {
		/* 获取频道列表 */
		//$map  = array('status' => array('gt', -1), 'pid'=>$pid);
		$map  = array('status' => array('gt', -1));
		if ($type) {
			$map['type']   = $type;
		}
		$list = db('Channel')->where($map)->order('sort asc,id asc')->column('*', 'id');

		if (!empty($list)) {
			$tree = new \com\Tree();
			$list = $tree->toFormatTree($list);
		}

		config('_sys_get_channel_tree_', true);

		$data = array(
			'tree' => $list,
			'type' => $type
		);
		$this->assign($data);
		$this->setMeta('导航管理');
		return $this->fetch();
	}

		/* 单字段编辑 */
	public function editable($name = null, $value = null, $pk = null) {
		if ($name && ($value != null || $value != '') && $pk) {
			model('Channel')->where(array('id' => $pk))->setField($name, $value);
		}
	}

	public function add() {
		if (IS_POST) {
			$Channel = model('Channel');
			$data    = $this->request->post();
			if ($data) {
				$id = $Channel->save($data);
				if ($id) {
					return $this->success('新增成功', url('index'));
					//记录行为
					action_log('update_channel', 'channel', $id, session('user_auth.uid'));
				} else {
					return $this->error('新增失败');
				}
			} else {
				$this->error($Channel->getError());
			}
		} else {
			$pid = input('pid', 0);
			//获取父导航
			if (!empty($pid)) {
				$parent = db('Channel')->where(array('id' => $pid))->field('title')->find();
				$this->assign('parent', $parent);
			}

			$pnav = db('Channel')->where(array('pid' => '0'))->select();
			$this->assign('pnav', $pnav);
			$this->assign('pid', $pid);
			$this->assign('info', null);
			$this->setMeta('新增导航');
			return $this->fetch('edit');
		}
	}

	public function edit($id = 0) {
		if (IS_POST) {
			$Channel = model('Channel');
			$data    = $this->request->post();
			if ($data) {
				if (false !== $Channel->save($data, array('id' => $data['id']))) {
					//记录行为
					action_log('update_channel', 'channel', $data['id'], session('user_auth.uid'));
					return $this->success('编辑成功', url('index'));
				} else {
					return $this->error('编辑失败');
				}
			} else {
				return $this->error($Channel->getError());
			}
		} else {
			$info = array();
			/* 获取数据 */
			$info = db('Channel')->find($id);

			if (false === $info) {
				return $this->error('获取配置信息错误');
			}

			$pid = input('pid', 0);
			//获取父导航
			if (!empty($pid)) {
				$parent = db('Channel')->where(array('id' => $pid))->field('title')->find();
				$this->assign('parent', $parent);
			}

			$pnav = db('Channel')->where(array('pid' => '0'))->select();
			$this->assign('pnav', $pnav);
			$this->assign('pid', $pid);
			$this->assign('info', $info);
			$this->setMeta('编辑导航');
			return $this->fetch();
		}
	}

	public function del() {
		$id = $this->getArrayParam('id');

		if (empty($id)) {
			return $this->error('请选择要操作的数据!');
		}

		$map = array('id' => array('in', $id));
		if (db('Channel')->where($map)->delete()) {
			//记录行为
			action_log('update_channel', 'channel', $id, session('user_auth.uid'));
			return $this->success('删除成功');
		} else {
			return $this->error('删除失败！');
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
			$list = db('Channel')->where($map)->field('id,title')->order('sort asc,id asc')->select();

			$this->assign('list', $list);
			$this->setMeta('导航排序');
			return $this->fetch();
		} elseif (IS_POST) {
			$ids = input('post.ids');
			$ids = explode(',', $ids);
			foreach ($ids as $key => $value) {
				$res = db('Channel')->where(array('id' => $value))->setField('sort', $key + 1);
			}
			if ($res !== false) {
				return $this->success('排序成功！', url('admin/channel/index'));
			} else {
				return $this->error('排序失败！');
			}
		} else {
			return $this->error('非法请求！');
		}
	}

}