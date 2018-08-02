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

class User extends Fornt{

protected $model;

	protected $field;

	public function _initialize()
	{
		parent::_initialize();

		$this->model = model('user');
		$this->field  = $this->model->recognList;

		$account = Cookie::get('account');

		if(!preg_match("/^1[34578]\d{9}$/", $account) && $account!=null && $this->url!='index/user/loginout' && $this->url!='index/user/login' && $this->url!='index/user/register' && $this->url!='index/user/getCode'){
			$this->error($account);
		}
	}

}
