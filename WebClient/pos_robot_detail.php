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
    var singleRobotGM;

    var owner;

    checkeWeb3Account(function(account) {
        userLogin = new ZSCLogin(account);
        userLogin.tryLogin(userType, function(ret) {
            if(!ret) { 
                  window.location.href = "index_login.php?type=staker";
            } else {
                singleRobotGM = new ZSCRobotSingleDetails(account, userLogin.getErc721Adr(), userLogin.getControlApisFullAbi());
                singleRobotGM.getOwner(robotId, function(error, result) {
                if (!error) {
                        owner = result;
                        loadSingleRobotDetails(robotId);
                    }
                });
            }
        });
    });

    /////////////////////////
    function loadSingleRobotDetails(robotId) {
        singleRobotGM.loadSingleRobotDetails(robotId, function() {
            loadSingleRobotDetailsHtml("PageBody",  "upgradeRobot", "transferToOther", "activeMining", "claimReward", "sellRobot", "cancelSelling", "purchaseSellingRobot", "bindAndActivate");
        });
    }

    /////////////////////////
    function upgradeRobot(hashId, robotId) {
        singleRobotGM.upgradeMinerRobot(hashId, robotId, function(){
           window.location.reload(true);               
        });
    }

    function transferToOther(hashId, destId, robotId) {
        var dest = document.getElementById(destId).value;
        singleRobotGM.transferToOther(hashId, dest, robotId, function(){
            window.location.reload(true);
        });
    }

    /////////////////////////
    function activeMining(hashId, tokenTypeId, posTypeId, robotId) {
        var tokenType = document.getElementById(tokenTypeId).value;
        var posType = document.getElementById(posTypeId).value;
        singleRobotGM.activeMinerRobot(hashId, robotId, tokenType, posType, function() {    
           window.location.reload(true);               
        });
    }

    function claimReward(hashId, robotId) {
        singleRobotGM.claimReward(hashId, robotId, function() { 
           window.location.reload(true);               
        });
    }

    /////////////////////////
    function sellRobot(hashId, priceId, robotId) {
        var price = document.getElementById(priceId).value;
        singleRobotGM.publishMinerRobot(hashId, robotId, price, function() { 
           window.location.reload(true);               
        });
    }

    function cancelSelling(hashId, robotId) {
        singleRobotGM.cancelSellingMinerRobot(hashId, robotId, function() {
            window.location.reload(true);
        });
    }

    /////////////////////////
    function purchaseSellingRobot(hashId, robotId) {
        singleRobotGM.purchaseSellingRobot(hashId, robotId, function() {  
             window.location.href = "pos_robot_market.php";
        });
    }

    function bindAndActivate() {
        window.location.href = "index_login.php?type=staker";
    }

    /////////////////////////
    function loadSingleRobotDetailsHtml(elementId, upgradeRobot, transfer, activeMining, claimReward, sellRobot, cancelSelling, purchaseRobot, bindAndActivate) {
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

        var purchaseRobotPrefix = purchaseRobot + "('OperationHash', '"; 
        var purchaseRobotSuffix = "')";

        var titlle = "User owned robots" 

        var tokenType = '<select id = "TokenType" style="width:100px">'
        tokenType += '<option value ="TestMYT">TestMYT</option>'
        tokenType += '</select>'

        var posType = '<select id = "PosType" style="width:100px">'
        posType += '<option value ="7">7 Days (0.5%) </option>'
        posType += '<option value ="30">30 Days (0.75%)</option>'
        posType += '<option value="90">90 Days (1.25%)</option>'
        posType += '<option value="180">180 Days (2.0%)</option>'
        posType += '</select>'

        var sellPrice = '<input style="width:100px" id="SellPrice" value="0.0"></input>'

        var robotStatus = singleRobotGM.getRobotDetailParaValue("status", "null");
        var robotId     = singleRobotGM.getRobotDetailParaValue("id",     "null");
        var seller      = singleRobotGM.getRobotDetailParaValue("seller", "Adr")

        var text  = '<div class="well" align="center" >' + titlle + ' | 1 day => 1 minute <br>';
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

            // if (singleRobotGM.getUserAccount() == seller) {
            if (owner == seller) {
                text += '<tr>'
                text += '   <td colspan="1"><button type="button" onClick="' + cancelSellingPrefix + robotId + cancelSellingSuffix + '"> Cancel selling </button></td>'
                text += '</tr>'
            } else {
                text += '<tr>'
                text += '   <td colspan="1"><button type="button" onClick="' + purchaseRobotPrefix + robotId + purchaseRobotSuffix + '"> Purchase robot</button></td>'
                text += '</tr>'
                
            }
        }
        text += '</table></div>'

        text += '<div class="well"><text id="OperationHash" value = "log:"> </text> </div>';
        text += '<div class="well">';
        text += '<table align="center" style="width:600px;min-height:30px">'

        //default paras: "id",  "rare", "spLev"
        //all paras: "status", "name", "special", "sellPrice", "seller", "posToken", "minedSP", "rewardSP", "lastSP", "rrMineDay", "rrRewardDay", "spCur", "spMax", "spBase", "mineStart", "mineEnd", "spBirth", "spExtra", "rrBirth", "rrExtra", "rrLevEft", "upProb", "upBirth", "upExtra", "upPrice"];
    
        text += '<tr> <td><text> id     </text></td> <td><text>' + robotId     + '</text></td> </tr>';
        text += '<tr> <td><text> owner     </text></td> <td><text>' + owner     + '</text></td> </tr>';
        text += '<tr> <td><text> status </text></td> <td><text>' + robotStatus + '</text></td> </tr>';
        text += '<tr> <td>------</td> <td>------</td> </tr>'

        text += '<tr> <td><text> sellPrice    </text></td> <td><text>' + singleRobotGM.getRobotDetailParaValue("sellPrice",   "FromWei") + '</text></td> </tr>';
        text += '<tr> <td><text> seller       </text></td> <td><text>' + seller + '</text></td> </tr>';
        text += '   <tr> <td>------</td> <td>------</td> </tr>'

        text += '<tr> <td><text> rare         </text></td> <td><text>' + singleRobotGM.getRobotDetailParaValue("rare",        "null") + '</text></td> </tr>';
        text += '<tr> <td><text> special      </text></td> <td><text>' + singleRobotGM.getRobotDetailParaValue("special",     "null") + '</text></td> </tr>';
        text += '<tr> <td><text> name         </text></td> <td><text>' + singleRobotGM.getRobotDetailParaValue("name",        "null") + '</text></td> </tr>';
        text += '   <tr> <td>------</td> <td>------</td> </tr>'

        text += '<tr> <td><text> spLev        </text></td> <td><text>' + singleRobotGM.getRobotDetailParaValue("spLev",       "null") + '</text></td> </tr>'; 
        text += '<tr> <td><text> spBase       </text></td> <td><text>' + singleRobotGM.getRobotDetailParaValue("spBase",      "FromWei") + '</text></td> </tr>';
        text += '<tr> <td><text> spBirth      </text></td> <td><text>' + singleRobotGM.getRobotDetailParaValue("spBirth",     "FromWei") + '</text></td> </tr>';
        text += '<tr> <td><text> spExtra      </text></td> <td><text>' + singleRobotGM.getRobotDetailParaValue("spExtra",     "FromWei") + '</text></td> </tr>';
        text += '<tr> <td><text> spCur        </text></td> <td><text>' + singleRobotGM.getRobotDetailParaValue("spCur",       "FromWei") + '</text></td> </tr>';        
        text += '<tr> <td><text> spMax        </text></td> <td><text>' + singleRobotGM.getRobotDetailParaValue("spMax",       "FromWei") + '</text></td> </tr>';
        text += '   <tr> <td>------</td> <td>------</td> </tr>'

        text += '<tr> <td><text> rrMineDay    </text></td> <td><text>' + singleRobotGM.getRobotDetailParaValue("rrMineDay",   "Prob") + '</text></td> </tr>';
        text += '<tr> <td><text> rrRewardDay  </text></td> <td><text>' + singleRobotGM.getRobotDetailParaValue("rrRewardDay", "Prob") + '</text></td> </tr>';
        text += '<tr> <td><text> rrBirth      </text></td> <td><text>' + singleRobotGM.getRobotDetailParaValue("rrBirth",     "Prob") + '</text></td> </tr>';
        text += '<tr> <td><text> rrExtra      </text></td> <td><text>' + singleRobotGM.getRobotDetailParaValue("rrExtra",     "Prob") + '</text></td> </tr>';
        text += '<tr> <td><text> rrLevEft     </text></td> <td><text>' + singleRobotGM.getRobotDetailParaValue("rrLevEft",    "Prob") + '</text></td> </tr>';
        text += '   <tr> <td>------</td> <td>------</td> </tr>'

        text += '<tr> <td><text> upProb       </text></td> <td><text>' + singleRobotGM.getRobotDetailParaValue("upProb",      "Prob") + '</text></td> </tr>';
        text += '<tr> <td><text> upProbBirth  </text></td> <td><text>' + singleRobotGM.getRobotDetailParaValue("upBirth",     "Prob") + '</text></td> </tr>';
        text += '<tr> <td><text> upProbExtra  </text></td> <td><text>' + singleRobotGM.getRobotDetailParaValue("upExtra",     "Prob") + '</text></td> </tr>';
        text += '<tr> <td><text> upPrice      </text></td> <td><text>' + singleRobotGM.getRobotDetailParaValue("upPrice",     "FromWei") + '</text></td> </tr>';
        text += '   <tr> <td>------</td> <td>------</td> </tr>'

        text += '<tr> <td><text> mineStart    </text></td> <td><text>' + singleRobotGM.getRobotDetailParaValue("mineStart",   "Time") + '</text></td> </tr>';
        text += '<tr> <td><text> mineEnd      </text></td> <td><text>' + singleRobotGM.getRobotDetailParaValue("mineEnd",     "Time") + '</text></td> </tr>';
        text += '<tr> <td><text> minedSP      </text></td> <td><text>' + singleRobotGM.getRobotDetailParaValue("minedSP",     "FromWei") + '</text></td> </tr>';
        text += '<tr> <td><text> rewardSP     </text></td> <td><text>' + singleRobotGM.getRobotDetailParaValue("rewardSP",    "FromWei") + '</text></td> </tr>';
        text += '<tr> <td><text> lastSP       </text></td> <td><text>' + singleRobotGM.getRobotDetailParaValue("lastSP",      "FromWei") + '</text></td> </tr>';
        text += '   <tr> <td>------</td> <td>------</td> </tr>'

        text += '</table></div>'
        text += '</div>'
    
        document.getElementById(elementId).innerHTML = text;  
    }

</script>

<?php echo $htmlObjects->loadEthereumEnable(); ?>

</body>
</html>
