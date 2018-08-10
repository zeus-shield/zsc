<?php
// +----------------------------------------------------------------------
// | SentCMS [ WE CAN DO IT JUST THINK IT ]
// +----------------------------------------------------------------------
// | Copyright (c) 2013 http://www.tensent.cn All rights reserved.
// +----------------------------------------------------------------------
// | Author: molong <molong@tensent.cn> <http://www.tensent.cn>
// +----------------------------------------------------------------------

namespace app\index\controller;
use app\common\controller\Fornt;
use think\Cookie;
use think\Cache;
use think\Db;
class Company extends Fornt{

	protected $model;//数据模型

	protected $field;//图片遍历

	protected $info;//公司信息

	public function _initialize()
	{
		parent::_initialize();

		$this->model = model('Company');

		$this->field = $this->model->companyList;

		$this->info = $this->model->get(['uid'=>Cookie::get('uid')]);

		$this->assign('info',$this->info);//企业信息

		$account = Cookie::get('account');

		if(preg_match("/^1[34578]\d{9}$/", $account) && $this->url!='index/user/loginout'){
			$this->error('非法操作');
		}
	}
	

}
