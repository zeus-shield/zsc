 
function getContractAdr(name) {
    if (name == "AdmAdv") return g_AdmAdvAdr;
    else if (name == "ControlApisAdv") return g_ControlApisAdvAdr;
    else if (name == "FactoryPro") return g_FactoryProAdr;
    else if (name == "DBDatabase") return g_DBDatabaseAdr;
    else {}
}

function getContractFullNme(contractName) {
    if (contractName == 'AdmAdv') {
        return "./zsc/adm_adv.sol:AdmAdv";
    } else if (contractName == 'DBDatabase') {
        return "./zsc/db/Database/db_database.sol:DBDatabase";
    } else if (contractName == 'FactoryPro') {
        return "./zsc/factory_pro.sol:FactoryPro";
    } else if (contractName == 'ControlApis') {
        return "./zsc/db/Database/control_apis.sol:ControlApis";
    } else if (contractName == 'ControlApisAdv') {
        return "./zsc/control_apis_adv.sol:ControlApisAdv";
    }
}

function getCompiledFile(contractName) {
    if (contractName == 'AdmAdv') {
        return compiledAdmAdv;
    } else if (contractName == 'DBDatabase') {
        return compiledDatabase;
    } else if (contractName == 'FactoryPro') {
        return compiledFactoryPro;
    } else if (contractName == 'ControlApis') {
        return compiledApis;
    } else if (contractName == 'ControlApisAdv') {
        return compiledApis;
    }
}

function getContractAbi(contractName) {
    var solcompiled = getCompiledFile(contractName);
    var contractFullName = getContractFullNme(contractName);
    var abi = JSON.parse(solcompiled.contracts[contractFullName].abi)
    return abi;
}

function getContractAbiString(contractName) {
    var solcompiled = getCompiledFile(contractName);
    var contractFullName = getContractFullNme(contractName);
    var abi =  solcompiled.contracts[contractFullName].abi
    return abi;
}


function getContractBin(contractName) {
    var solcompiled = getCompiledFile(contractName);
    var contractFullName = getContractFullNme(contractName);
    return "0x" + solcompiled.contracts[contractFullName].bin;
}

