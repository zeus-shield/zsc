<?php
/*
Copyright (c) 2018, ZSC Dev Team
*/
?>

<?php
include("zsc_base.php");

class ZSCSystemObjects extends ZSCBase {    
    public function __construct() {
        parent::__construct();
    }

    public  function __destruct() {
    }

    public function readObjectAddress($name) {
        return parent::readContent('./adrs/'.$name.'.txt');
    }

    public function writeObjectAddress($name, $adr) {
        parent::writeContent('./adrs/'.$name.'.txt', $adr);
    }

    public function getLogedObjectAddressArrayInString() {
        $logedModules = parent::getLogedObjectArray();
        $num = count($logedModules);
    
        $text = "";
    
        for($x = 0; $x < $num; $x++) {
            $name = $logedModules[$x];
            $text .= "['".$this->readObjectAddress($name);
        }
        return $text;
    }

    public function getFactoryModuleAddressArrayInString() {
        $factoryModules = parent::getFactoryModuleArray();
        $num = count($factoryModules);
    
        $text = "";
    
        for($x = 0; $x < $num; $x++) {
            $name = $readModuleAddress[$x];
            $text .= "['".$this->readObjectAddress($name);
        }
        return $text;
    }

    public function getUrlSuffixForAdrs() {
        $system_modules = parent::getObjectArray();
        $num = count($system_modules);
        $text = '?';
        for($x = 0; $x < $num; $x++) {
            $name = $system_modules[$x];
            if ($x == $num - 1) {
                $text .= $name.'='.$this->readObjectAddress($name);
            } else {
                $text .= $name.'='.$this->readObjectAddress($name).'&';
            }
        }
        return $text;
    }
}

?>


