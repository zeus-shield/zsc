<?php
/*
Copyright (c) 2018, ZSC Dev Team
*/
?>

<?php

include("zsc_system_objects.php");

class ZSCHtmlObjects extends ZSCSystemObjects {
    public function __construct(){
        parent::__construct();
    }

    public  function __destruct() {
    }

    public function loadHeader() {
        $text='<br><br>
        <div align="center">
        <table align="center" style="width:800px">
           <tr>
            <td align="center"><a href="adm_create_contract.php">[Create contract]</a></td>
            <td align="center"><a href="adm_configure_logrecorder.php">[Config. LogRecorder]</a></td>
            <td align="center"><a href="adm_init_sys_component.php">[Init Component]</a></td>
            <td align="center"><a href="adm_add_database.php">[Add Database]</a></td>
            <td align="center"><a href="adm_add_factory.php">[Add Factory]</a></td>
            <td align="center"><a href="adm_add_gm.php">[Add Moduele]</a></td>
          </tr>
        </table><br>
        <table align="center" style="width:800px">
           <tr>
            <td align="center"><a href="adm_manage_token_contracts.php">[Mag. Tokens]</a></td>
            <td align="center"><a href="adm_manage_users.php">[Mag. Users]</a></td>
            <td align="center"><a href="adm_manage_pos_0.php">[PoS Sets]</a></td>
            <td align="center"><a href="adm_manage_pos_1.php">[PoS Ratio]</a></td>
            <td align="center"><a href="adm_manage_pos_2.php">[PoS Level]</a></td>
            <td align="center"><a href="adm_manage_pos_3.php">[PoS Ctg]</a></td>
            <td align="center"><a href="adm_manage_pos_4.php">[PoS Spec]</a></td>
          </tr>
        </table><br>
        <table align="center" style="width:400px">
           <tr>
            <td align="center"><a href="adm_show_log.php">[Show Log]</a></td>
            <td align="center"><a href="adm_print_abi.php">[Print Abi]</a></td>
            <td align="center"><a href="adm_uninstall_system.php">[Unins. Sys.]</a></td>
          </tr>
        </table>
        </div>';
        return $text;
    }
    
    public function loadScriptFiles() {
        $text = '
        <meta http-equiv="content-type" content="text/html; charset=utf-8">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
    
        <script src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
        <script type="text/javascript" src="../WebClient/web3.js/dist/web3.js"></script>
        <script type="text/javascript" src="../WebClient/common/web3js.js"></script>
        <script type="text/javascript" src="./js/createContract.js"></script>
        <script type="text/javascript" src="./js/setupFunctions.js"></script>
        <script type="text/javascript" src="./js/zsc_js_base.js"></script>
        <script type="text/javascript" src="./js/zsc_printlog.js"></script>
        <script type="text/javascript" src="./js/zsc_setup.js"></script>
        <script type="text/javascript" src="./js/zsc_show_element.js"></script>
        <script type="text/javascript" src="./js/zsc_show_user_agrs.js"></script>
        <script type="text/javascript" src="./js/zsc_show_user_tmps.js"></script>
        <script type="text/javascript" src="./js/zsc_show_user_transactions.js"></script>
        <script type="text/javascript" src="./js/zsc_show_user_wallets.js"></script>
        <script type="text/javascript" src="./js/zsc_user_management.js"></script>
        <script type="text/javascript" src="./js/zsc_wallet_management.js"></script>
        <script type="text/javascript" src="./js/zsc_pos_management.js"></script>

        <script type="text/javascript" src="./js/compiled_zsc_test_token.js"></script>
        <script type="text/javascript" src="./js/compiled_loger.js"></script>
        <script type="text/javascript" src="./js/compiled_time_stamp.js"></script>

        <script type="text/javascript" src="./js/compiled_adm_adv.js"></script>
        <script type="text/javascript" src="./js/compiled_apis_adv.js"></script>
        <script type="text/javascript" src="./js/control_apis_user.js"></script>

        <script type="text/javascript" src="./js/compiled_database.js"></script>
        <script type="text/javascript" src="./js/compiled_factory_pro.js"></script>
        <script type="text/javascript" src="./js/compiled_factory_rec.js"></script>
        <script type="text/javascript" src="./js/compiled_factory_staker.js"></script>
        <script type="text/javascript" src="./js/compiled_factory_tmp.js"></script>
        <script type="text/javascript" src="./js/compiled_factory_agr.js"></script>
        <script type="text/javascript" src="./js/compiled_factory_wallet_adv.js"></script>
        <script type="text/javascript" src="./js/compiled_sys_gm_token.js"></script>
        <script type="text/javascript" src="./js/compiled_sys_gm_pos.js"></script>
        ';
        return $text;
    }
    
    public function loadEthereumEnable() {
        $text = '
        <script type="text/javascript">
    window.addEventListener("load", async () => {
    if (doesLocalWeb3js()) return;
    // Modern dapp browsers...
    if (window.ethereum) {
        window.web3 = new Web3(ethereum);
        try {
            // Request account access if needed
            await ethereum.enable();
            
        } catch (error) {
            // User denied account access...
        }
    }
});
</script>
        ';
        return $text;
    }

    public function loadAllAdrs() {
        $modules = ZscBase::getObjectArray();
        $num = count($modules);

        $text  = '<div class="well">';
        for ($x = 0; $x < $num; $x++) {
            $name = $modules[$x];
            $text .=    '<text id = "'.$name.'Adr">'.$name.' address: '.parent::readObjectAddress($name).'</text> <br>';
        }
        $text .= '</div>';
        return $text;
    }

    public function loadCreateContract($func) {
        $objects= ZscBase::getObjectArray();
        $num = count($objects);

        $text = '';
        for($x = 0; $x < $num; $x++) {
            $name = $objects[$x];
            $text .= '<text>Step - '.$x.': Create '.$name.'</text>';
            $text .= '<div class="well">';
            $text .= '   <text> Name: </text>';
            $text .= '   <input type="text" id="'.$name.'Name" value = "test_'.$name.'"></input>';
            $text .= '   <button type="button" onClick="'.$func.'(\''.$name.'\',\''.$name.'Name\')">Create</button> <br>';
            $text .= '   <text id="'.$name.'Log"></text> <br>';
            $text .= '</div>';
        }

        return $text;
    }

    public function killContract($func) {
        $objects= ZscBase::getObjectArray();
        $num = count($objects);

        $text = '';
        for($x = 0; $x < $num; $x++) {
            $name = $objects[$x];
            $adr = parent::readObjectAddress($name);

            $text .= '<text>Step - '.$x.': Create '.$name.'</text>';
            $text .= '<div class="well">';
            $text .= '   <text> Name: </text>';
            $text .= '   <input type="text" id="'.$name.'Name" value = "test_'.$name.'"></input>';
            $text .= '   <button type="button" onClick="'.$func.'(\''.$name.'\',\''.$adr.'\')">Kill</button> <br>';
            $text .= '   <text id="'.$name.'Log"></text> <br>';
            $text .= '</div>';
        }

        return $text;
    }
    
    public function loadRegisterLogRecorderHtml($func) {
        $logedModules = ZscBase::getLogedObjectArray();
        $num = count($logedModules);
    
        $text = '<div class="well">';
    
        for($x = 0; $x < $num; $x++) {
            $name = $logedModules[$x];
            //<button type="button" onClick="registerToLogRecorder('AdmAdv','RegisterAdmAdvHash')">Register AdmAdv</button> 
            $text .= '<button type="button" onClick="'.$func.'(\''.$name.'\',\'Register'.$name.'Hash\')">Register '.$name.'</button>';
            //<text id="SetLogAdmAdvHash"></text><br> <br>
            $text .= '<text id="Register'.$name.'Hash"></text> <br> <br>';
        }
    
        $text .= '</div>';
    
        return $text;
    }

    public function loadSetLogRecorderHtml($func) {
        $logedModules = ZscBase::getLogedObjectArray();
        $num = count($logedModules);
    
        $text = '<div class="well">';
    
        for($x = 0; $x < $num; $x++) {
            $name = $logedModules[$x];
            //<button type="button" onClick="setLogRecorderToListener('AdmAdv','SetLogAdmAdvHash')">Set Loger to DBDatabase</button> 
            $text .= '<button type="button" onClick="'.$func.'(\''.$name.'\',\'SetLog'.$name.'Hash\')">SetLog '.$name.'</button>';
            //<text id="SetLogAdmAdvHash"></text><br> <br>
            $text .= '<text id="SetLog'.$name.'Hash"></text> <br> <br>';
        }
    
        $text .= '</div>';
    
        return $text;
    }

    public function loadInitObjects($func) {
        $objects= ZscBase::getObjectArray();
        $num = count($objects);

        $text = '';
    
        for($x = 0; $x < $num; $x++) {
            $name = $objects[$x];
            $hashId = $name.'Hash'.$x;
            $action = "Init ".$name;
            
            $text .= '<text>Step - '.($x+1).' </text>';
            $text .= '<button type="button" onClick="'.$func.'(\''.$name.'\', \''.$hashId.'\')">'.$action.'</button>';
            $text .= '<text id="'.$hashId.'"></text><br><br>';
        }
    
        return $text;
    }

    public function loadPrintObjectAbi($func) {
        $objects= ZscBase::getObjectArray();
        $num = count($objects);

        $text = '';
    
        for($x = 0; $x < $num; $x++) {
            $name = $objects[$x];
            $action = "Print ".$name." Abi";
            $text .= ' | <button type="button" onClick="'.$func.'(\''.$name.'\')">'.$action.'</button> | '; 
        }
    
        return $text;
    }

    public function loadAddFactoryModules($func) {
        $modules = ZscBase::getFactoryModuleArray(); 
        $num = count($modules);
        $text = '';
    
        for($x = 0; $x < $num; $x++) {
            $name = $modules[$x];
            $hashId = $name.'Hash';
            $action = "Add ".$name;
            
            $text .= '<text>Step - '.($x+1).' </text>';
            $text .= '<button type="button" onClick="'.$func.'(\''.$name.'\', \''.$hashId.'\')">'.$action.'</button>';
            $text .= '<text id="'.$hashId.'"></text><br><br>';
        }
    
        return $text;
    }

    public function loadAddGMs($func) {
        $gms = ZscBase::getGmArray(); 
        $num = count($gms);
        $text = '';
    
        for($x = 0; $x < $num; $x++) {
            $name = $gms[$x];
            $hashId = $name.'Hash'.$x;
            $action = "Add ".$name;
            
            $text .= '<text>Step - '.($x+1).' </text>';
            $text .= '<button type="button" onClick="'.$func.'(\''.$name.'\', \''.$hashId.'\')">'.$action.'</button>';
            $text .= '<text id="'.$hashId.'"></text><br><br>';
        }
    
        return $text;
    }

    public function loadWalletManager($names, $symbols, $address) {
        $text = '<div class="well">';    
        
        $text .= '</div>';
    
        return $text;
    }
}
?>

