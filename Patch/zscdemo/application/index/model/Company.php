<?php
/*用户管理模型*/
namespace app\common\model;
use think\Log;
use think\Cookie;
use think\Db;
/*
	用户模型
*/
class Company extends Base{


	protected $autoWriteTimestamp = true;
	protected $createTime         = 'createTime';


	public $companyList = array(
		array('name'=>'license',    'title'=>'营业执照',   'type'=>'image', 'help'=>'', 'option'=>''),
		array('name'=>'papersImgx', 'title'=>'身份证正面', 'type'=>'image', 'help'=>'', 'option'=>''),
		array('name'=>'papersImgy', 'title'=>'身份证背面', 'type'=>'image', 'help'=>'', 'option'=>''),
	);


	protected $auto = ['uid','PapersTime'];

	protected function setPapersTimeAttr($value)
    {
        return strtotime($value);
    }

    /**
	 * 企业信息查询
	 * @return [type] [array]
	 */
	public function companyInfo($uid=null)
	{
		$result = Db::table('user a')
					->join('company b','b.uid=a.uid',"LEFT")
					->where('a.uid',$uid)
					// ->where('b.status',1)
					->find();
		return $result;
	}

}