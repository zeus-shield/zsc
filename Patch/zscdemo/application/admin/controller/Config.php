<?php


namespace app\admin\controller;
use app\common\controller\Admin;

class Config extends Admin {

	public function _initialize() {
		parent::_initialize();
		$this->model = model('Config');
	}
	public function index() {
		$group = input('group', 0, 'trim');
		$name  = input('name', '', 'trim');
		/* 查询条件初始化 */
		$map          = array('status' => 1);
		if ($group) {
			$map['group'] = $group;
		}

		if ($name) {
			$map['name'] = array('like', '%' . $name . '%');
		}

		$list = $this->model->where($map)->order('id desc')->paginate(25);
		// 记录当前列表页的cookie
		Cookie('__forward__', $_SERVER['REQUEST_URI']);

		$data = array(
			'group'       => config('config_group_list'),
			'config_type' => config('config_config_list'),
			'page'        => $list->render(),
			'group_id'    => $group,
			'list'        => $list,
		);

		$this->assign($data);
		$this->setMeta('配置管理');
		return $this->fetch();
	}
	public function group($id = 1) {
		if (IS_POST) {
			$config = $this->request->post('config/a');
			$model  = model('Config');
			foreach ($config as $key => $value) {
				$model->where(array('name' => $key))->setField('value', $value);
			}
			//清除db_config_data缓存
			cache('db_config_data', null);
			return $this->success("更新成功！");
		} else {
			$type = config('config_group_list');
			$list = db("Config")->where(array('status' => 1, 'group' => $id))->field('id,name,title,extra,value,remark,type')->order('sort')->select();
			if ($list) {
				$this->assign('list', $list);
			}
			$this->assign('id', $id);
			$this->setMeta($type[$id] . '设置');
			return $this->fetch();
		}
	}
	public function add() {
		if (IS_POST) {
			$config = model('Config');
			$data   = $this->request->post();
			if ($data) {
				$id = $config->validate(true)->save($data);
				if ($id) {
					cache('db_config_data', null);
					//记录行为
					action_log('update_config', 'config', $id, session('user_auth.uid'));
					return $this->success('新增成功', url('index'));
				} else {
					return $this->error('新增失败');
				}
			} else {
				return $this->error($config->getError());
			}
		} else {
			$this->setMeta('新增配置');
			$this->assign('info', null);
			return $this->fetch('edit');
		}
	}
	public function edit($id = 0) {
		if (IS_POST) {
			$config = model('Config');
			$data   = $this->request->post();
			if ($data) {
				$result = $config->validate('Config.edit')->save($data, array('id' => $data['id']));
				if (false !== $result) {
					cache('db_config_data', null);
					//记录行为
					action_log('update_config', 'config', $data['id'], session('user_auth.uid'));
					return $this->success('更新成功', Cookie('__forward__'));
				} else {
					return $this->error($config->getError(), '');
				}
			} else {
				return $this->error($config->getError());
			}
		} else {
			$info = array();
			/* 获取数据 */
			$info = db('Config')->field(true)->find($id);

			if (false === $info) {
				return $this->error('获取配置信息错误');
			}
			$this->assign('info', $info);
			$this->setMeta('编辑配置');
			return $this->fetch();
		}
	}
}