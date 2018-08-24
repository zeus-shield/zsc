<?php


namespace app\index\controller;
use app\common\controller\Fornt;
use think\Cookie;
use think\Cache;
use think\Db;
class Zscprovider extends Fornt{
    public function _initialize()
	{
		parent::_initialize();
		
	}

	public function zscMain() {
		
		return $this->fetch();
	}
	
	public function zscWallet() {
		return $this->fetch();
	}

	public function zscEnableWallet() {
		return $this->fetch();
	}

	public function zscShowMAdr() {
		return $this->fetch();
	}

	public function zscProfile() {
		return $this->fetch();
	}

	public function zscShowAllAgreementsDetail() {
		return $this->fetch();
	}

	public function zscShowAllAgreements() {
		return $this->fetch();
	}

	
	public function zscProfileSubmitChanges() {
		return $this->fetch();
	}

	public function zscTemplates() {
		return $this->fetch();
	}
	
	public function zscShowAllAgrsDetail() {
		return $this->fetch();
	}

	public function zscTemplateEdit() {
		return $this->fetch();
	}

	public function zscTemplatesList() {
		return $this->fetch();
	}

	public function zscTemplatesListShow() {
		return $this->fetch();
	}

	public function zscAgreement() {
		return $this->fetch();
	}

	public function zscAgreementShow() {
		return $this->fetch();
	}

	/**
	 * 获取用户身份
	 * @return [type] [json]
	 */
	public function getUserType()
	{
		$account = input('post.account');
		

		$r = Db::name('user')->where('account',$account)->find();

		if(!empty($r)){
			return $this->jsonSuc('获取成功',$r);
		}else{
			return $this->jsonErr('没有该用户');
		}
	}

}