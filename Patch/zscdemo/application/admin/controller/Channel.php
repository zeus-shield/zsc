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

}