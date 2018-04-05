<?php
/*
Copyright (c) 2018, ZSC Dev Team
*/
?>

<?php

class ZscSystemModules { 
    private $moduleArray = array("LogRecorder", "AdmAdv", "DBDatabase", "FactoryPro", "FactoryTmp", "FactoryAgr", "ControlApisAdv");   
    private $logedModuleArray =  array("AdmAdv", "DBDatabase", "FactoryPro", "FactoryTmp", "FactoryAgr", "ControlApisAdv");
    private $logedModuleNameArrayInString =  "['AdmAdv', 'DBDatabase', 'FactoryPro', 'FactoryTmp', 'FactoryAgr', 'ControlApisAdv']";

    private function readContent($file) {
        $myfile = fopen($file, "r");
        $text = fread($myfile,filesize($file));
        fclose($myfile);
        return $text;
    }

    private function writeContent($file, $text) {
        $myfile = fopen($file, "wr") or die("Unable to open file!");
        fwrite($myfile, $text);
        fclose($myfile);
    }

    public function getModuleArray() { 
        return $moduleArray; 
    } 

    public function getLogedModuleArray() {
        return $logedModuleArray;
    }
    
    public function getLogedModuleNameArrayInString() {
        return $logedModuleNameArrayInString;
    }
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


