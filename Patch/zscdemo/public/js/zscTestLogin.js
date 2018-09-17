var web3;
if (doesLocalWeb3js()) {
    web3 = setupWeb3js();
} else {
    //Metamask
    web3 = new Web3(web3.currentProvider);
}

var zscHtml = new ZSCHtml();
var zscUser;
var zscElement;
var zscWalletGM;
var zscTransGM;
var zscTmpsGM;
var zscAgrsProGM;
var zscBlockGM;
var zscPosGM;
var zscViewAgrsGM;
var zscModuleAdrGM;

/*tag:
logon, wallet, profile, templates, agreements
*/
function htmlLoadLogin() {
    document.getElementById("PageHeader").innerHTML = ""
        + "<i>Needs to install MetaMask extension</i><br>"
        + "<i>(需要安装MetaMask插件才能显示登录框以其他相关页面)</i><br><br>"
        + "<i>Both the FireFox and Chrome browsers are recommended</i><br>"
        + "<i>(推荐使用火狐或者Chrome浏览器)</i><br><br>";
    document.getElementById("PageBody").innerHTML = "";
    zscHtml.setHtmlContentIds("PageHeader", "PageBody");
    zscHtml.loadPageBody("login", "checkUser");
}

function checkUser(adrId, userId, passId) {
    var admAdr = "0x295459c5ba2e760daacb57e0ac455456227df223";
    var user = document.getElementById(userId).value;
    var password = document.getElementById(passId).value;

    zscUser = new ZSCUser(admAdr);
    zscUser.tryLogin(user, password, function (ret) {
        if (ret) {
            var userName = zscUser.getUserName();
            var fullAbi = zscUser.getControlApisFullAbi();
            var controlApisAdvAdr = zscUser.getControlApisAdr();
            zscElement = new ZSCElement(userName, fullAbi, controlApisAdvAdr);
            zscWalletGM = new ZSCWallet(userName, fullAbi, controlApisAdvAdr);
            zscTmpsGM = new ZSCTemplate(userName, fullAbi, controlApisAdvAdr);
            zscAgrsProGM = new ZSCAgreementProvider(userName, fullAbi, controlApisAdvAdr);
            zscAgrsRecGM = new ZSCAgreementReceiver(userName, fullAbi, controlApisAdvAdr);
            zscAgrsAllGM = new ZSCAgreementAll(userName, fullAbi, controlApisAdvAdr);
            zscTransGM = new ZSCTransactions(userName, fullAbi, controlApisAdvAdr);
            zscModuleAdrGM = new ZSCModuleAdrs(userName, fullAbi, controlApisAdvAdr);
            //
            //zscViewAgrsGM = new ZSCViewAgreement(zscUser.getUserName(), fullAbi, controlApisAdvAdr);
            /*
            zscBlockGM  = new ZSCBlock(zscUser.getUserName(), fullAbi, controlApisAdvAdr);
            zscPosGM    = new ZSCPos(zscUser.getUserName(), fullAbi, controlApisAdvAdr);
            zscWalletGM = new ZSCWallet(zscUser.getUserName(), fullAbi, controlApisAdvAdr);
            */
            loadHtmlPageBody("welecome");
        } else {
            alert("User name or password wrong!!");
        }
    });
}

function applyForUser(type, hashLogId) {
    zscUser.activeByUser(type, hashLogId);
}

function reFresh() {
    loadHtmlPageBody("apply");
}

function submitTransferValue(tokenSymbol, destAddressId, amountId, logId) {
    var destAddress = document.getElementById(destAddressId).value;
    var amount = document.getElementById(amountId).value;

    zscWalletGM.submitTransferValue(tokenSymbol, destAddress, amount, logId, function () {
        loadHtmlPageBody("wallet");
    });
}

function creatNewTemplate(logId) {
    zscTmpsGM.creatNewTemplate(logId, function () {
        loadHtmlPageBody("template");
    });
}


//Disable during alpha-test
/*
function confirmTransferValue(tokenSymbol, logId) {
    ZSCWalletGM.confirmTransferValue(tokenSymbol, logId, function(){
        loadHtmlPageBody("wallet");
    });
}
*/

function showErc20Tokens(destAddressId, amountId, logId) {
    var destAddress = document.getElementById(destAddressId).value;
    var amount = document.getElementById(amountId).value;

    zscElement.transferEth(destAddress, amount, logId);
}

function submitParameterProfileChanges(logID) {
    zscElement.setElementParameter(logID, function () { });
}

function submitParameterTemplateChanges(logID) {
    zscElement.setElementParameter(logID, function () {
        loadHtmlPageBody("template");
    });
}

function claimReward(logId) {
    zscAgrsProGM.claimReward(logId, zscElement.getElementName(), function () {
        loadHtmlPageBody("template");
    });
}

function claimInsurance(logId) {
    zscAgrsRecGM.claimInsurance(logId, zscElement.getElementName(), function () {
        loadHtmlPageBody("agreement-receiver");
    });
}

function dealwithShowAgreementForAll(elementName, type) {
    if (type == "provider") {
        loadHtmlPageBody("agreement-all");
    } else if (type == "receiver") {
        loadHtmlPageBody("agreement-all");
    }
}

function enableWallet(tokenSymbol, elementId) {
    //Disable during alpha-test
    /*
    ZSCWalletGM.enableWallet(tokenSymbol, elementId, function() {
       loadHtmlPageBody("wallet");
    });
    */
}

function showProvidersAgreements(templateName) {
    zscAgrsProGM.setTemplateName(templateName);
    loadHtmlPageBody("agreement-provider");
}

function showTransactions(tokenSymbol) {
    zscTransGM.setTokenSymbol(tokenSymbol);
    loadHtmlPageBody("transaction");
}

function showTemplateParameters(elementName) {
    zscElement.setElementName(elementName);
    loadHtmlPageBody("parameter-template")
}

function showProAgrParameters(elementName) {
    zscElement.setElementName(elementName);
    loadHtmlPageBody("parameter-agreement-provider")
}

function showRecAgrParameters(elementName) {
    zscElement.setElementName(elementName);
    loadHtmlPageBody("parameter-agreement-receiver")
}

function showAllAgrParameters(elementName) {
    zscElement.setElementName(elementName);
    loadHtmlPageBody("parameter-agreement-all")
}

function enableAsAgreement(index) {
    zscTmpsGM.enableAsAgreement(index, function () {
        loadHtmlPageBody("template");
    });
}

function submitPurchaseAgreement(elementName) {
    zscAgrsAllGM.submitPurchaseAgreement(elementName, function (result) {
        loadHtmlPageBody("agreement-all")
    });
}

//Disable during alpha-test
/*
function confirmPurchaseAgreement(index) {
    zscViewAgrsGM.confirmPurchaseAgreement(index, function(result) {
        loadHtmlPageBody("view-agreement")
    });
}
*/

function enableTestZSCWallet(hashId) {
    zscWalletGM.enableUserWallet(hashId, function () {
        loadHtmlPageBody("wallet")
    });
}

function publishAgreement(agrName) {
    zscAgrsProGM.publishAgreement(agrName, function (result) {
        loadHtmlPageBody("agreement-provider")
    });
}

function backToProTmp() {
    loadHtmlPageBody("template");
}

function backToRecAgr() {
    loadHtmlPageBody("agreement-receiver");
}

function bakcToAllAgr() {
    loadHtmlPageBody("agreement-all");
}

function loadLocalPageHeader() {
    zscUser.getUserStatusFromAdm(function (status) {
        if (status == 0) {
            //Should not happen 
        } else if (status == "added") {
            zscHtml.loadPageHeader("loadHtmlPageBody", "null", false);
        } else if (status == "applied") {
            zscUser.getUserTypeFromAdm(function (type) {
                zscHtml.loadPageHeader("loadHtmlPageBody", type, true);
                loadHtmlPageBody("applied");
            });
        }
    });
}

// function loadHtmlPageBody(tag) {
//     if (tag == "welecome") {
//         // zscHtml.loadPageBody("welecome");
//         loadLocalPageHeaderDemo();

//     } else if (tag == "apply-provider") {
//         document.getElementById("PageHeader").innerHTML = "Applying... <br> Need to reload once succeeded";
//         document.getElementById("PageBody").innerHTML = '<div class="well"> <text id="ApplyForProviderHash"></text> </div>';
//         applyForUser("provider", "ApplyForProviderHash");

//     } else if (tag == "apply-receiver") {
//         document.getElementById("PageHeader").innerHTML = "Applying... <br> Need to reload once succeeded";
//         document.getElementById("PageBody").innerHTML = '<div class="well"> <text id="ApplyForReceiverHash"></text> </div>';
//         applyForUser("receiver", "ApplyForReceiverHash");

//     } else {
//         switch (tag) {
//             case "logout":
//                 window.location.reload(true);
//                 break;

//             case "module-adrs":
//                 zscModuleAdrGM.setUserType(zscUser.getUserType());
//                 zscModuleAdrGM.setUserName(zscUser.getUserName());
//                 zscModuleAdrGM.getModuleAdrs(function () {
//                     zscModuleAdrGM.loadModuleAdrsHtml("PageBody");
//                 });
//                 break;

//             case "wallet":
//                 zscWalletGM.setUserType(zscUser.getUserType());
//                 zscWalletGM.setUserName(zscUser.getUserName());
//                 zscWalletGM.loadTokenInfoByIndex(0, function () {
//                     zscWalletGM.loadWalletsHtml("PageBody", "submitTransferValue", "showTransactions", "enableTestZSCWallet");
//                 });

//                 break;

//             case "template":
//                 zscTmpsGM.setUserType(zscUser.getUserType());
//                 zscTmpsGM.loadTempates(function () {
//                     //elementId, funcCreateTmp, funcSetPara, funcPublish
//                     zscTmpsGM.loadTemplatesHtml("PageBody", "creatNewTemplate", "enableAsAgreement", "showTemplateParameters", "showProvidersAgreements");
//                 });
//                 break;

//             case "parameter-profile":
//                 zscElement.setElementName(zscUser.getUserName());
//                 zscElement.setUserType(zscUser.getUserType());
//                 zscElement.loadParameterNamesAndvalues(function () {
//                     zscElement.loadParametersHtml("PageBody", "profile", "submitParameterProfileChanges");
//                 });
//                 break;

//             case "parameter-template":
//                 zscElement.loadParameterNamesAndvalues(function () {
//                     zscElement.loadParametersHtml("PageBody", "template", "submitParameterTemplateChanges", "backToProTmp");
//                 });
//                 break;

//             case "parameter-agreement-provider":
//                 zscElement.loadParameterNamesAndvalues(function () {
//                     zscElement.loadParametersHtml("PageBody", "agreement-provider", "claimReward", "backToProTmp");
//                 });
//                 break;
