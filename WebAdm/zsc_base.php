<?php
/*
Copyright (c) 2018, ZSC Dev Team
*/
?>

<?php

class ZscBase {
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
}
?>
