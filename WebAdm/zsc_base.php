<?php
/*
Copyright (c) 2018, ZSC Dev Team
*/
?>

<?php

class ZSCBase {
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
            $text = fread($myfile, filesize($file));
            fclose($myfile);
        }
        return $text;
    }

    public function writeContent($file, $text) {
        $myfile = fopen($file, "wr") or die("Unable to open file!");
        fwrite($myfile, $text);
        fclose($myfile);
    }

    public function getFactoryModuleArray() {
        return array("FactoryPro", "FactoryRec", "FactoryTmp",  "FactoryAgr", "FactoryWalletErc20"); 
    }
    
    public function getLogedObjectArray() {
        /*
        return array("AdmAdv", "PosAdv", "WalletManager", "SimulatorManager", "DatabaseManager", "FactoryManager", "SystemOverlayer", "ControlApisAdv", "DBDatabase", "FactoryPro", "FactoryRec", "FactoryTmp",  "FactoryAgr",  "FactoryWalletEth", "FactoryWalletErc20");
        */
        return array("AdmAdv", "DBDatabase", "FactoryPro", "FactoryRec", "FactoryTmp",  "FactoryAgr", "FactoryWalletErc20", "ControlApisAdv");
    }

    public function getObjectArray() {
        /*
        return array("TestToken", "LogRecorder", "AdmAdv", "PosAdv", "WalletManager", "SimulatorManager", "DatabaseManager", "FactoryManager", "SystemOverlayer", "ControlApisAdv", "DBDatabase", "FactoryPro", "FactoryRec", "FactoryTmp",  "FactoryAgr",  "FactoryWalletEth", "FactoryWalletErc20");
        */
        return array("TestToken", "LogRecorder", "AdmAdv", "DBDatabase", "FactoryPro", "FactoryRec", "FactoryTmp",  "FactoryAgr",  "FactoryWalletErc20", "ControlApisAdv");
    }

    public function getGMArray() {
        return array("PosAdv", "WalletManager", "SimulatorManager");
    }
}

?>
