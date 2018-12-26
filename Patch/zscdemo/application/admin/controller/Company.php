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

	public function product()
	{
		$list = Db::name('product')->paginate(15);

		$data = array(
			'list'=>$list,
			'page'=>$list->render(),
		);

		$this->assign($data);

		$this->setMeta('产品信息');

		return $this->fetch();
	}

	public function addProduct()
	{
		$uid = input('id');

		if(IS_POST){
			$msg = input('post.');
			$msg['addTime'] = time();
			$res = Db::name('product')->insert($msg);

			if($res){
				$this->success('添加成功',url('company/product'));
			}else{
				$this->success('操作失败');
			}
		}else{
			$data = array(
				'keyList' => $this->model->addfield,
				'info'    => ['uid'=>$uid]
			);
			$this->assign($data);
			$this->setMeta('添加产品');
			return $this->fetch('public/edit');
		}
	}	
	public function editProduct()
	{
		$uid = input('id');

		if(IS_POST){
			$msg = input('post.');

			$res = Db::name('product')->where('pid',$msg['pid'])->update($msg);

			if($res){
				$this->success('编辑成功成功',url('company/product'));
			}else{
				$this->success('操作失败');
			}
		}else{
			$pid  = input('pid');

			$info = Db::name('product')->find($pid);

			$data = array(
				'keyList' => $this->model->addfield,
				'info'    => $info
			);
			$this->assign($data);
			$this->setMeta('添加产品');
			return $this->fetch('public/edit');
		}
	}
}