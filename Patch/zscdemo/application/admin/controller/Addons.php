<?php


namespace app\admin\controller;
use app\common\controller\Admin;

class Addons extends Admin {

	protected $addons;

	public function _initialize() {
		parent::_initialize();
		//加入菜单
		$this->getAddonsMenu();
		$this->addons = model('Addons');
		$this->hooks  = db('Hooks');
	}
	

	/**
	 * 插件列表
	 */
	public function index($refresh = 0) {
		if ($refresh) {
			$this->addons->refresh();
		}
		$list = $this->addons->order('id desc')->paginate(25);
		// 记录当前列表页的cookie
		Cookie('__forward__', $_SERVER['REQUEST_URI']);

		$data = array(
			'list' => $list,
			'page' => $list->render(),
		);
		$this->setMeta("插件管理");
		$this->assign($data);
		return $this->fetch();
	}
		//创建向导首页
	public function add() {
		if (IS_POST) {
			$data = $this->addons->create();
			if ($data) {
				if ($result) {
					return $this->success("创建成功！", url('admin/addons/index'));
				} else {
					return $this->error("创建失败！");
				}
			} else {
				return $this->error($this->addons->getError());
			}
		} else {
			$hooks = db('Hooks')->field('name,description')->select();
			$this->assign('Hooks', $hooks);
			$hook = db('Hooks')->field(true)->select();
			foreach ($hook as $key => $value) {
				$addons_opt[$value['name']] = $value['name'];
			}
			$addons_opt = array(array('type' => 'select', 'opt' => $addons_opt));
			if (!is_writable(SENT_ADDON_PATH)) {
				return $this->error('您没有创建目录写入权限，无法使用此功能');
			}
			$this->setMeta("添加插件");
			return $this->fetch();
		}
	}

}