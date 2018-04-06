<?php
/*
Copyright (c) 2018, ZSC Dev Team
*/
?>

<?php
include("zsc_base.php");

class ZscSystemModules extends ZscBase {    
    public function __construct() {
        parent::__construct();
    }

    public  function __destruct() {
    }

    public function readModuleAddress($name) {
        return parent::readContent('./adrs/'.$name.'.txt');
    }

    public function writeModuleAddress($name, $adr) {
        parent::writeContent('./adrs/'.$name.'.txt', $adr);
    }

    public function getLogedModuleAddressArrayInString() {
        $logedModules = parent::getModuleArray();
        $num = count($logedModules);
    
        $text = "";
    
        for($x = 0; $x < $num; $x++) {
            $name = $logedModules[$x];
            $text .= "['".$this->readModuleAddress($name);
        }
        return $text;
    }

    public function getUrlSuffixForAdrs() {
        $system_modules = parent::getModuleArray();
        $num = count($system_modules);
        $text = '?';
        for($x = 0; $x < $num; $x++) {
            $name = $system_modules[$x];
            $text .= $name.'='.$this->readModuleAddress($name).'&';
        }
        return $text;
    }
}

?>


