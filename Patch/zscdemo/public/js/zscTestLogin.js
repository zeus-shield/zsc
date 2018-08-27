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
