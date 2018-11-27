<?php
// +----------------------------------------------------------------------
// | SentCMS [ WE CAN DO IT JUST THINK IT ]
// +----------------------------------------------------------------------
// | Copyright (c) 2013 http://www.tensent.cn All rights reserved.
// +----------------------------------------------------------------------
// | Author: molong <molong@tensent.cn> <http://www.tensent.cn>
// +----------------------------------------------------------------------

namespace app\common\model;

/**
* 用户模型
*/
class Users extends Base{

	protected $name = "User";

	/*编辑公司信息*/
	public $editfield = array(
		array('name'=>'uid','type'=>'hidden'),
		array('name'=>'unit','title'=>'单位类别','type'=>'text','help'=>''),
		array('name'=>'companyName','title'=>'公司名称','type'=>'text','help'=>''),
		array('name'=>'companyType','title'=>'公司类型','type'=>'text','help'=>''),
		array('name'=>'registerNum','title'=>'注册号','type'=>'text','help'=>''),
		array('name'=>'tissueCode','title'=>'组织机构代码','type'=>'text','help'=>''),
		array('name'=>'license','title'=>'营业执照','type'=>'image','help'=>''),
		array('name'=>'legalAddress','title'=>'法定代表人归属地','type'=>'text','help'=>''),
		array('name'=>'legalName','title'=>'法定人名称','type'=>'text','help'=>''),
		array('name'=>'papers','title'=>'证件号','type'=>'text','help'=>''),
		array('name'=>'papersTime','title'=>'证件到期时间','type'=>'datetime','help'=>''),
		array('name'=>'papersImgx','title'=>'正面照','type'=>'image','help'=>''),
		array('name'=>'papersImgy','title'=>'反面照','type'=>'image','help'=>''),
		array('name'=>'contact','title'=>'联系方式','type'=>'text','help'=>''),
		array('name'=>'createTime','title'=>'提交时间','type'=>'datetime','help'=>'')
	);

	/*添加产品*/
	public $addfield = array(
		array('name'=>'pid','type'=>'hidden'),
		array('name'=>'name','title'=>'名称','type'=>'text','help'=>''),
		array('name'=>'describe','title'=>'描述','type'=>'text','help'=>''),
		array('name'=>'design','title'=>'设计理念','type'=>'text','help'=>''),
		array('name'=>'trait','title'=>'特色','type'=>'textarea','help'=>'总共三段,输入一段,请用逗号分割'),
		array('name'=>'money','title'=>'保险金额','type'=>'text','help'=>''),
		array('name'=>'company','title'=>'保险公司','type'=>'select','help'=>''),
		array('name'=>'image','title'=>'产品图片','type'=>'image','help'=>''),
		array('name'=>'uid','title'=>'关联用户id','type'=>'readonly','help'=>''),
		array('name'=>'classify','title'=>'产品分类','type'=>'select','help'=>'','option'=>array('0'=>'儿童','1'=>'成人','2'=>'老年')),
		array('name'=>'coverage','title'=>'险种类型','type'=>'select','help'=>'','option'=>array('0'=>'养老险','1'=>'医疗险','2'=>'意外险')),
		array('name'=>'num','title'=>'产品数量','type'=>'text','help'=>''),
	);


	public function initialize(){
		parent::initialize();
		foreach ($this->addfield as $key => $value) {
			if ($value['name'] == 'classify') {
				$value['option'] = config('classify');
			}
			if ($value['name'] == 'coverage') {
				$value['option'] = config('coverage');
			}
			if ($value['name'] == 'company') {
				$value['option'] = config('company');
			}
			$this->addfield[$key] = $value;
		}
	}

}