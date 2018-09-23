<?php 
/*
Copyright (c) 2018 ZSC Dev Team
*/
session_start();
?>

<html>
<head>
<?php 
    include("include.php");
    $htmlObjects = new ZSCInclude($_SESSION["userType"]);
    echo $htmlObjects->loadScriptFiles(); 
?>
</head>
<body>
    <div class="col-lg-12">
        <br><i>Web-client for testing ZSC system on the Rinkeby</i><br><br>
        <div class="well" id="PageAlert"><?php echo $htmlObjects->loadAlert(); ?></div>
        <div class="well" id="PageHeader"><?php echo $htmlObjects->loadHeader(); ?></div>
        <div class="well" id="PageBody"></div>
    </div>

<script type="text/javascript">
    /////////////////////////////
    <?php echo $htmlObjects->loadWeb3();?>
    var checkeWeb3Account = <?php echo $htmlObjects->checkWeb3Account();?>;
    var robotId = <?php echo "'".$_GET["robotId"]."'";?>;
    var userType = <?php echo "'".$_SESSION["userType"]."'";?>;
    var userLogin;
    var userRobotGM;

    checkeWeb3Account(function(account) {
        userLogin = new ZSCLogin(account);
        userLogin.tryLogin(userType, function(ret) {
            if(!ret) { 
                window.location.href = "index.php";
            } else {
                userRobotGM = new ZSCRobotOwned(account, userLogin.getErc721Adr(), userLogin.getControlApisFullAbi());
                loadUserRobotDetails(robotId);
            }
        });
    });

    /////////////////////////
    function loadUserRobotDetails(robotId) {
        userRobotGM.loadUserSingleRobotDetail(robotId, function() {
            loadUserRobotDetailsHtml("PageBody",  "upgradeRobot", "transferToOther", "activeMining", "claimReward", "sellRobot", "cancelSelling");
        });
    }

    /////////////////////////
    function upgradeRobot(hashId, robotId) {
        userRobotGM.upgradeMinerRobot(hashId, robotId, function(){
            loadUserRobotDetails(robotId);
        });
    }

    function transferToOther(hashId, destId, robotId) {
        var dest = document.getElementById(destId).value;
        userRobotGM.transferToOther(hashId, dest, robotId, function(){
            loadUserRobotDetails(robotId);
        });
    }

    /////////////////////////
    function activeMining(hashId, tokenTypeId, posTypeId, robotId) {
        var tokenType = document.getElementById(tokenTypeId).value;
        var posType = document.getElementById(posTypeId).value;
        userRobotGM.activeMinerRobot(hashId, robotId, tokenType, posType, function() {      
            loadUserRobotDetails(robotId);
        });
    }

    function claimReward(hashId, robotId) {
        userRobotGM.claimReward(hashId, robotId, function() { 
            loadUserRobotDetails(robotId);
        });
    }

    /////////////////////////
    function sellRobot(hashId, priceId, robotId) {
        var price = document.getElementById(priceId).value;
        userRobotGM.publishMinerRobot(hashId, robotId, price, function() {  
            loadUserRobotDetails(robotId);
              
        });
    }

    function cancelSelling(hashId, robotId) {
        userRobotGM.cancelSellingMinerRobot(hashId, robotId, function() {
            loadUserRobotDetails(robotId);
        });
    }

    function loadUserRobotDetailsHtml(elementId, upgradeRobot, transfer, activeMining, claimReward, sellRobot, cancelSelling) {
        var upgradeRobotPrefix = upgradeRobot + "('OperationHash', '"; 
        var upgradeRobotSuffix = "')";

        var transferPrifix = transfer + "('OperationHash', 'DestAdr', '"; 
        var transferSuffix = "')";

        var activeMiningPrefix = activeMining + "('OperationHash', 'TokenType', 'PosType', '"; 
        var activeMiningSuffix = "')";

        var claimRewardPrefix = claimReward + "('OperationHash', '"; 
        var claimRewardSuffix = "')";

        var sellRobotPrefix = sellRobot + "('OperationHash', 'SellPrice', '"; 
        var sellRobotSuffix = "')";

        var cancelSellingPrefix = cancelSelling + "('OperationHash', '"; 
        var cancelSellingSuffix = "')";     
    
        var titlle = "User owned robots" 

        var tokenType = '<select id = "TokenType" style="width:100px">'
        tokenType += '<option value ="TestZSC">TestZSC </option>'
        tokenType += '</select>'

        var posType = '<select id = "PosType" style="width:100px">'
        posType += '<option value ="7">7 Days (1.0%) </option>'
        posType += '<option value ="30">30 Days (2.0%)</option>'
        posType += '<option value="90">90 Days (3.5%)</option>'
        posType += '<option value="180">180 Days (5.0%)</option>'
        posType += '<option value="360">360 Days (7.5%)</option>'
        posType += '</select>'

        var sellPrice = '<input style="width:100px" id="SellPrice" value="0.0"></input>'

        var robotStatus = userRobotGM.getRobotParaDetailValue("status",      "null");
        var robotId     = userRobotGM.getRobotParaDetailValue("id",          "null");

        var text  = '<div class="well" align="center" >' + titlle + '<br>';
        text += '<div class="well">';
        text += '<table align="center" style="width:600px;min-height:30px">'
        if (robotStatus == "idle") {
            text += '<tr>'
            text += '   <td><button type="button" onClick="' + upgradeRobotPrefix + robotId + upgradeRobotSuffix + '"> Upgrade SP Lev </button></td>'
            text += '   <td>' + tokenType + posType + '<br><button type="button" onClick="' + activeMiningPrefix + robotId + activeMiningSuffix + '"> Start mining </button></td>'
            text += '   <td><text> Price (ETH) </text>' + sellPrice + '<br><button type="button" onClick="' + sellRobotPrefix + robotId + sellRobotSuffix + '"> Publish selling </button></td>'
            text += '</tr>'
            text += '<tr><td colspan="3">----</td></tr>'
            text += '<tr>'
            text += '  <td colspan="3"> <button type="button" onClick="' + transferPrifix + robotId + transferSuffix + '"> transfer to </button>'
            text += '    <input style="width:400px" id="DestAdr"></input> </td> '
            text += '</tr>'
        } else if (robotStatus == "mining") {
            text += '<tr>'
            text += '   <td colspan="1"><button type="button" onClick="' + claimRewardPrefix + robotId + claimRewardSuffix + '"> Claim SP </button></td>'
            text += '</tr>'
        } else {
            // robotStatus == "selling"
            text += '<tr>'
            text += '   <td colspan="1"><button type="button" onClick="' + cancelSellingPrefix + robotId + cancelSellingSuffix + '"> Cancel selling </button></td>'
            text += '</tr>'
        }
        text += '</table></div>'

        text += '<div class="well"><text id="OperationHash" value = "log:"> </text> </div>';
        text += '<div class="well">';
        text += '<table align="center" style="width:600px;min-height:30px">'

        text += '<tr> <td><text> id     </text></td> <td><text>' + robotId     + '</text></td> </tr>';
        text += '<tr> <td><text> status </text></td> <td><text>' + robotStatus + '</text></td> </tr>';
        text += '<tr> <td>------</td> <td>------</td> </tr>'


        //default paras: "id", "status", "rare", "spLev", 
        //others: "ctg", "name", "minedSP", "rewardSP", "rrMineDay", "rrRewardDay", "spCur", "spMax", "spBase", "mineStart", "mineEnd", "spBirth", "spExtra", "rrBirth", "rrExtra", "rrLevEft", "upProb", "upBirth", "upExtra", "upPrice", "price", "seller"
        text += '<tr> <td><text> rare         </text></td> <td><text>' + userRobotGM.getRobotParaDetailValue("rare",        "null") + '</text></td> </tr>';
        text += '<tr> <td><text> name         </text></td> <td><text>' + userRobotGM.getRobotParaDetailValue("name",        "null") + '</text></td> </tr>';
        text += '   <tr> <td>------</td> <td>------</td> </tr>'

        text += '<tr> <td><text> spLev        </text></td> <td><text>' + userRobotGM.getRobotParaDetailValue("spLev",       "null") + '</text></td> </tr>'; 
        text += '<tr> <td><text> spBase       </text></td> <td><text>' + userRobotGM.getRobotParaDetailValue("spBase",      "FromWei") + '</text></td> </tr>';
        text += '<tr> <td><text> spBirth      </text></td> <td><text>' + userRobotGM.getRobotParaDetailValue("spBirth",     "FromWei") + '</text></td> </tr>';
        text += '<tr> <td><text> spExtra      </text></td> <td><text>' + userRobotGM.getRobotParaDetailValue("spExtra",     "FromWei") + '</text></td> </tr>';
        text += '<tr> <td><text> spMax        </text></td> <td><text>' + userRobotGM.getRobotParaDetailValue("spMax",       "FromWei") + '</text></td> </tr>';
        text += '   <tr> <td>------</td> <td>------</td> </tr>'

        text += '<tr> <td><text> rrMineDay    </text></td> <td><text>' + userRobotGM.getRobotParaDetailValue("rrMineDay",   "Prob") + '</text></td> </tr>';
        text += '<tr> <td><text> rrRewardDay  </text></td> <td><text>' + userRobotGM.getRobotParaDetailValue("rrRewardDay", "Prob") + '</text></td> </tr>';
        text += '<tr> <td><text> rrBirth      </text></td> <td><text>' + userRobotGM.getRobotParaDetailValue("rrBirth",     "Prob") + '</text></td> </tr>';
        text += '<tr> <td><text> rrExtra      </text></td> <td><text>' + userRobotGM.getRobotParaDetailValue("rrExtra",     "Prob") + '</text></td> </tr>';
        text += '<tr> <td><text> rrLevEft     </text></td> <td><text>' + userRobotGM.getRobotParaDetailValue("rrLevEft",    "Prob") + '</text></td> </tr>';
        text += '   <tr> <td>------</td> <td>------</td> </tr>'

        text += '<tr> <td><text> upProb       </text></td> <td><text>' + userRobotGM.getRobotParaDetailValue("upProb",      "Prob") + '</text></td> </tr>';
        text += '<tr> <td><text> upProbBirth  </text></td> <td><text>' + userRobotGM.getRobotParaDetailValue("upBirth",     "Prob") + '</text></td> </tr>';
        text += '<tr> <td><text> upProbExtra  </text></td> <td><text>' + userRobotGM.getRobotParaDetailValue("upExtra",     "Prob") + '</text></td> </tr>';
        text += '<tr> <td><text> upPrice      </text></td> <td><text>' + userRobotGM.getRobotParaDetailValue("upPrice",     "FromWei") + '</text></td> </tr>';
        text += '   <tr> <td>------</td> <td>------</td> </tr>'

        text += '<tr> <td><text> mineStart    </text></td> <td><text>' + userRobotGM.getRobotParaDetailValue("mineStart",   "Time") + '</text></td> </tr>';
        text += '<tr> <td><text> mineEnd      </text></td> <td><text>' + userRobotGM.getRobotParaDetailValue("mineEnd",     "Time") + '</text></td> </tr>';
        text += '<tr> <td><text> minedSP      </text></td> <td><text>' + userRobotGM.getRobotParaDetailValue("minedSP",     "FromWei") + '</text></td> </tr>';
        text += '<tr> <td><text> rewardSP     </text></td> <td><text>' + userRobotGM.getRobotParaDetailValue("rewardSP",    "FromWei") + '</text></td> </tr>';
        text += '   <tr> <td>------</td> <td>------</td> </tr>'

        text += '<tr> <td><text> sellPrice    </text></td> <td><text>' + userRobotGM.getRobotParaDetailValue("price",       "FromWei") + '</text></td> </tr>';
        text += '<tr> <td><text> seller       </text></td> <td><text>0x' + userRobotGM.getRobotParaDetailValue("seller",      "null") + '</text></td> </tr>';
        text += '   <tr> <td>------</td> <td>------</td> </tr>'

        text += '</table></div>'
        text += '</div>'
    
        document.getElementById(elementId).innerHTML = text;  
    }

</script>

</body>
</html>
