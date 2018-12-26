<?php


namespace app\admin\controller;
use app\common\controller\Admin;
use think\Db;
class Company extends Admin {

	private $model;
	public function _initialize()
    {
    	parent::_initialize();
        $this->model = model('Users');
    }

	public function index($id=null) {
		$list = $this->model->where('type',1)->paginate(15);

		$data = array(
			'list' => $list,
			'page' => $list->render(),
		);

		$this->assign($data);

		$this->setMeta('公司信息');

		return $this->fetch('index');
	}    


	public function companyInfo()
	{
		if(IS_POST){
			$data = input('post.');

			$this->model->where('uid',$data['uid'])->update(['status'=>1]);//公司审核通过

			$email = $this->model->where('uid',$data['uid'])->find();

			$email = $email['account'];

			$to   = $email?$email:config('mail_resave_address');//发送邮箱地址
			$body ='您的企业认证信息已经通过,请点击下面连接,进入网站登录!<br>';
			$body.='<br>http://zsd.appux.cn/';

			$r=send_mail($to,'宙斯盾企业用户注册验证',$body);

			if($r){
				return $this->success('审核成功', url('admin/company/index'));
			}else{
				return $this->error($this->model->getError());
			}

		}else{
			$id = input('id');

			$result = Db::name('company')->where('uid',$id)->find();

			$data = array(
					'info'    => $result,
					'keyList' => $this->model->editfield,
				);
			$this->assign($data);
			$this->setMeta("编辑用户");
			return $this->fetch('public/edit');
		}

	}	
}