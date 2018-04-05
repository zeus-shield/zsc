<?php
/*
Copyright (c) 2018, ZSC Dev Team
*/
?>

<?php
include("zsc_base.php");

class ZscSystemModules extends ZscBase {    
    public function readModuleAddress($name) {
        return readContent('./adrs/'.$name.'.txt');
    }

    public function writeModuleAddress($name, $adr) {
        writeContent('./adrs/'.$name.'.txt', $adr);
    }

    public function getLogedModuleAddressArrayInString() {
        $logedModules = getModuleArray();
        $num = count($logedModules);
    
        $text = "";
    
        for($x = 0; $x < $num; $x++) {
            $name = $logedModules[$x];
            $text .= "['".readModuleAddress($name);
        }
        return $text;
    }

    public function getUrlSuffixForAdrs() {
        $system_modules = getModuleArray();
        $num = count($system_modules);
        $text = '?';
        for($x = 0; $x < $num; $x++) {
            $name = $system_modules[$x];
            $text .= $name.'='.readModuleAddress($name).'&';
        }
        return $text;
    }
}

?>


