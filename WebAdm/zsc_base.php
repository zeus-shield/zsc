<?php
/*
Copyright (c) 2018, ZSC Dev Team
*/
?>

<?php

class ZscBase {
    public function __construct() { 
    }

    public function __destruct() {
    }

    public function readContent($file) {
        $text = '';
        $myfile = fopen($file, "r");
        if ($myfile == FALSE) {
            $tex = '';
        } else { 
            $text = fread($myfile,filesize($file));
            fclose($myfile);
        }
        return $text;
    }

    public function writeContent($file, $text) {
        $myfile = fopen($file, "wr") or die("Unable to open file!");
        fwrite($myfile, $text);
        fclose($myfile);
    }

    public function getModuleArray() { 
        return array("LogRecorder", "DBDatabase",  "AdmAdv", "PosAdv", "WalletManager", "FactoryPro", "FactoryRec", "FactoryTmp", "FactoryAgr", "ControlApisAdv");
    } 

    public function getLogedModuleArray() {
        return array("AdmAdv", "DBDatabase", "PosAdv", "WalletManager", "FactoryPro", "FactoryRec", "FactoryTmp", "FactoryAgr", "ControlApisAdv");
    }
    
    public function getLogedModuleNameArrayInString() {
        return "['DBDatabase', 'AdmAdv', 'PosAdv', 'WalletManager', 'FactoryPro', 'FactoryTmp', 'FactoryRec', 'FactoryAgr', 'ControlApisAdv']";
    }

    public function getInitedModuleArray() {
        return array("DBDatabase", "AdmAdv", "PosAdv", "WalletManager", "FactoryPro", "FactoryRec", "FactoryTmp", "FactoryAgr", "ControlApisAdv", "ControlApisAdv", "ControlApisAdv", "ControlApisAdv", "ControlApisAdv", "ControlApisAdv", "ControlApisAdv", "ControlApisAdv"); 
    }

    public function getInitedModuleParaArray() {
        return array("null",       "null",    "null",         "null",        "null",       "null",       "null",       "null",  "WalletManager",  "DBDatabase",     "AdmAdv",       "PosAdv",        "FactoryPro",       "FactoryRec",       "FactoryTmp",   "FactoryAgr");   
    }
}

?>
