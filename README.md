# ZSC
[ZSC Wiki](https://github.com/zeus-shield/zsc/wiki)

[ZSC APIs](https://github.com/zeus-shield/zsc/wiki#zscapireference) 

Zeusshield (ZSC) system: AI&P2P Insurance Market Platform 

Official implementation for the solidity-based core part of the ZSC system, as well as the js-based web-client and js/php based web-adm.

## Project structure
```bash
|-- Database:  
    |-- Core part of zsc system
    |-- Solidity based implementation
|-- Token:     
    |-- zsc token contract
    |-- Based on ERC20 protocol
|-- WebAdm
    |-- web3.js, javascript and php based implementation
    |-- Compatible with Metamask 
|-- WebClient
    |-- web3.js and javascript based implementation
    |-- Compatible with Metamask 
```

## Smart contract inheritance
```bash
|-- Erc721
|-- owned
    |-- delegated 
        |-- Erce721Adv
        |-- log_recorder
        |-- objct 
            |-- pos_block
            |-- pos_block_pool, pos_staker_group
                |-- pos_base
            |-- sys_overlayer
            |-- sys_gm_base
                |-- sys_gm_tpken
            |-- adm_base
            |-- app_proxy   
            |-- db_database
            |-- db_idmanager
            |-- db_node 
                |-- wallet_base
                    |-- wallet_multisig
                        |-- wallet_eth
                        |-- wallet_erc20
                |-- db_entity 
                    |-- db_user
                        |-- db_receiver
                        |-- db_provider
                        |-- db_staker
                |-- db_item
                |-- db_template
                |-- db_agreement
            |-- factory_base
            |-- control_info
                |-- control_base 
                    |-- control_apis

|--plat_string
|--plat_math (SafeMath)
```

## WebAdm
```bash
|--php
    |-- zsc_base
        |-- zsc_system_objects
            |-- zsc_html_objects
|--js
    |-- zsc_printlog
    |-- zsc_js_base
        |-- zsc_setup
        |-- zsc_show_element
        |-- zsc_show_user_agrs
        |-- zsc_show_user_tmps
        |-- zsc_show_user_transactions
        |-- zsc_show_user_wallets
        |-- zsc_user_management
        |-- zsc_wallet_management        
```

## WebClient
```bash
|--js
    |-- zsc_html 
    |-- zsc_user
    |-- zsc_client
        |-- zsc_agreements_all
        |-- zsc_agreements_provider
        |-- zsc_agreements_receiver
        |-- zsc_block
        |-- zsc_element
        |-- zsc_pos
        |-- zsc_templates
        |-- zsc_transactions
        |-- zsc_wallet
        |-- zsc_view_agreement
```

## .sol update log
```bash
2017.09.05: add multisigtoken.sol, multisigwallet.sol and token.sol
2017.10.28: add the initial version of zscDatabase.sol
2017.12.18: add five files: plat_math.sol v0.01; plat_string.sol v0.01; plat_vector3d.sol v0.01; db_entity.sol v0.01; db_agreement.sol v0.01
2018.02.09: add three new files: db_receiver.sol v0.03; db_database.sol v0.02; test_basic_funcs.js 0.01
2018.02.10: add one new file: db_provider.sol 0.02
2018.02.10: add one new file: db_item.sol 0.01
2018.02.11: add three new file: object.sol 0.01; db_template.sol 0.01; db_idmanager.sol 0.01
2018.02.12: add a new file: db_node.sol 0.01
2018.02.13-14: re-design the topology among different db modules
2018.02.15: add a new file: app_basic.sol 0.01
2018.02.16: change the name app_basic.sol to db_apis.sol; add a new file: app_controller.sol 0.01
2018.02.17-18: add the mapping among parameter (bytes32) and its value (string) in app_controller.sol. Enable the operation of parsering and returning the string from/to the client 
2018.02.19: add two new files: test_database.sol; test_create_contract.sol
2018.02.20-21: test and modification on different db modules.
2018.02.24: add a new file db_user.sol
2018.02.22-25: start constructing the new way of "passing string" among contracts.
2018.02.26: add a new file plat_externalcontracts.sol
2018.02.27-03.01: re-construct the system as the currrent size of entire compiled bin (single) file is over 70KB, which leades to oversized error when deploying to the ethereum platform
2018.03.02-03.04: testing on db_database and db_node.f
2018.03.05: add a new file factory_basic.sol
2018.03.06: working on testing the db_database and db_node;
2018.03.07: creating db_node by integrating with db_database is ok by now
2018.03.08: chnage factory_basic.sol to db_factory.sol
2018.03.09-10: creating a DBProvider node and setting node parameters by DBApis are ok
2018.03.11: change file names: db_factory.sol->factory_base.sol, db_apis.sol->control_apis.sol
2018.03.12: add two files: control_info.sol and control_apis.sol
2018.03.13-15: work on testing zsc APIs with using Ethereum JS-APIs; to be continued...
2018.03.16: add a file: log_recorder.sol
2018.03.17-19: work on developing ZSC ControlApis based javascript apis used for web-client; work on dev. db_template;
2018.03.20-22: be compatible with Metamask now
2018.03.23-26: work on integrating web3.js apis, Metamask and zsc apis via web
2018.03.27: start developing the functionality of creating customized insurance template
2018.03.28: add two files web3js.js and userFunctions.js for showing examples of how to use web3js and zsc apis as well as Metamask at the web-client side
2018.03.29: add three files htmlFormat.js, zscTestLogin.html and zscTestMain.html
2018.03.30: change file name app_control.sol -> app_proxy.sol; add file basicFunctions.sol
2018.03.31: add two new file adm_base.sol and simulation_base.sol
2018.04.01: change the module name from simulation_base to db_simulator; add two new files adm_create_contract.php and adm_header.php
2018.04.02: add files adm_control_apis_adv.php, adm_configure_logrecorder.php, zscUser.js and zscElement.js
2018.04.01-03: add five files adm_show_log.php, db_staker.sol, wallet_base.sol, WebAdm/js/setupFunctions.js, WebAdm/js/createContract.js
2018.04.04: add two files zsc_html_modules.php, zsc_system_modules.php; change file name db_simulator.sol -> simulator_base.sol
2018.04.05: add file WebAdm/zsc_base.php, WebClient/zscHtml.js
2018.04.06-08: add three WebAdm/js/zsc_user_management.js, pos_block_pool.sol and pos_user_group.sol
2018.04.09-10: chang the key modifer only_delegat in order to support assigning different priorities to different kinds of contract objects
2018.04.11: add three files pos_block.sol, wallet_eth.sol, wallet_erc20.sol
2018.04.12: add file Database/wallet_manager.sol
2018.04.13: add file WebAdm/js/zsc_setup.js
2018.04.14-15: adjust inter-connection among different modules
2018.04.16: add files WebAdm/js/zsc_js_base.js, WebAdm/js/zsc_printlog.js, WebAdm/js/zsc_wallet_management.js, Database/simulator_manager.sol
2018.04.17-18: add file WebAdm/adm_manage_token_contracts.php
2018.04.19-20: add file WebClient/zsc_html.js and WebClient/zsc_wallet.js;updated solidity based core modules with focus on Agreement and Wallet
2018.04.21-24: add file WebAdm/adm_show_userdetails.php, WebAdm/js/zsc_show_user.js
2018.04.25-26: add SafeMath module
2018.04.27-28: update the code with reference to the solidity compiler 0.4.21
2018.04.29: add files WebAdm/js/zsc_show_user_agrs.js, WebAdm/js/zsc_show_user_wallets.js, WebAdm/js/zsc_show_user_tmps.js
2018.04.28-05.01: add files WebClient/zsc_block.js, WebClient/zsc_agreements.js, WebClient/zsc_client.js, WebClient/zsc_element.js, WebClient/zsc_pos.js, WebClient/zsc_templates.js, WebClient/zsc_transactions.js
2018.05.02-05.03: add file WebClient/zsc_view_agreement.js; update others
2018.05.04: add files WebAdm/zsc_show_user_transactions.js, Database/wallet_multisig.sol
2018.05.05-05.06: add files Database/delegate.sol, Database/factory_manager.sol
2018.05.07-05.08: add files Database/log_transaction.sol, Database/db_managet.sol; changed/updated file factory_manager.sol->module_manager.sol
2018.05.07-05.08: add files Database/adr_manager.sol, Database/manager_base.sol, Database/system_manager.sol, WebAdm/adm_add_factory.php
2018.05.09-05.14: removed files module_base.sol, module_base_adv.sol; added files sys_com_module.sol, sys_include.sol, log_base.sol, log_manager.sol; changed/updated files: system_manger.sol -> sys_overlayer.sol, wallet_manager.sol -> sys_gm_wallet.sol, simulator_manager.sol -> sys_gm_simulator.sol, factory_manager.sol -> sys_gm_factory.sol, db_manager.sol -> sys_gm_db.sol, adr_manager.sol -> sys_com_group.sol, manager_base.sol -> sys_com_base.sol
2018.05.15-05.23: re-construct/adjust architecture for sys_gm_*.sol; changed/updated files: WebAdm/adm_add_database.php, WebAdm/zsc_system_modules.php -> WebAdm/zsc_system_objects.php, WebAdm/zsc_html_modules.php -> WebAdm/zsc_html_objects.php; added file Database/sys_gm_string.sol;
2018.05.24-05.29: add file WebAdm/adm_add_gm.php, WebAdm/adm_print_abi.php; change codes with reference to solidity compiler 4.21
2018.05.30-06.12: conduct internal testing on the alpha-version
2018.06.13-06.19: release the close-beta version to Rinkeby Etherume test network, not including the modules: pos, staker, sys_gm_token, sys_gm_simulator, wallet_eth, wallet_multisig; re-construct the "sys_gm_*" modules
2018.06.20-06.22: add files EthCore/erc721_base.sol, EthCore/erc721_adv.sol
```
