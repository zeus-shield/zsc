<?php
/*
Copyright (c) 2018, ZSC Dev Team
*/
?>

<?php

class AdmModulesZsc { 
    private $moduleArray = array("LogRecorder", "AdmAdv", "DBDatabase", "FactoryPro", "FactoryTmp", "FactoryAgr", "ControlApisAdv");   
    private $logedModuleArray =  array("AdmAdv", "DBDatabase", "FactoryPro", "FactoryTmp", "FactoryAgr", "ControlApisAdv");
    private $logedModuleNameArrayInString =  "['AdmAdv', 'DBDatabase', 'FactoryPro', 'FactoryTmp', 'FactoryAgr', 'ControlApisAdv']";

    private function readContent($file) {

    }

    private function writeContent($file, $text) {

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

    }

    public function writeModuleAddress($name, $adr) {

    }
} 

?>