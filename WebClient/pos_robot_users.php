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
                loadUserAllRobotBriefs();
            }
        });
    });

    /////////////////////////////
    function loadHtml(isAllRobots) {
        if (isAllRobots) {
            loadUserAllRobotHtml("PageBody", "loadUserRobotDetails", "createGen0Robot");
        } else {
            loadUserRobotDetailsHtml("PageBody", "loadUserAllRobots", "upgradeRobot", "activeMining", "claimReward", "sellRobot", "cancelSelling");
        }
    }
    function loadUserAllRobotBriefs() {
        userRobotGM.loadUserAllRobotBriefs(function() {
            loadHtml(true);
        });
    }

    function createGen0Robot(hashId) {
        userRobotGM.createGen0Robot(hashId, function(){
            loadHtml(true);
        });
    }

    /////////////////////////
    function loadUserRobotDetails(index) {
        userRobotGM.loadUserRobots(false, function() {
            loadHtml(false);
        });
    }

    /////////////////////////
    function upgradeRobot(hashId, robotId) {
        userRobotGM.upgradeMinerRobot(hashId, robotId, function(){
            loadHtml(false);
        });
    }

    /////////////////////////
    function activeMining(hashId, tokenTypeId, posTypeId, robotId) {
        var tokenType = document.getElementById(tokenTypeId).value;
        var posType = document.getElementById(posTypeId).value;
        userRobotGM.activeMinerRobot(hashId, robotId, tokenType, posType, function() {      
            loadHtml(false);          
        });
    }

    function claimReward(hashId, tokenTypeId, robotId) {
        var tokenType = document.getElementById(tokenTypeId).value;
        userRobotGM.claimReward(hashId, robotId, tokenType, function() { 
            loadHtml(false);       
        });
    }

    /////////////////////////
    function sellRobot(hashId, priceId, robotId) {
        var price = document.getElementById(priceId).value;
        userRobotGM.publishMinerRobot(hashId, robotId, price, function() {  
            loadHtml(false);
              
        });
    }

    function cancelSelling(hashId, robotId) {
        userRobotGM.cancalSellingMinerRobot(hashId, robotId, function() {
            loadHtml(false);                
        });
    }

    /////////////////////////    
    function loadUserAllRobotHtml(elementId, createGen0, showRobot) {
        var createGen0Func = createGen0 + "('OperationHash')"; 

        var showPrefix = showRobot + "('OperationHash', '"; 
        var showSuffix = "')";

        var robotNos = userRobotGM.getRobotNos();
        var titlle = "User owned robots" 

        text  = '<div class="well" align="center" >' + titlle + '<br>';
        text  = '<text id="OperationHash" value = "log:"> </text> </div>';

        text += '<div class="well" align="center" >'
        text += '   <button type="button" onClick="' + createGen0Func + '">  Create Lev0 miner robot (Cost 0.01ETH) </button> <br>'
        text += '</div>';

        text += '<div class="well">';
        text += '<table align="center" style="width:600px;min-height:30px">'
        text += '   <tr> <td>id</td> <td>status</td> <td>rare</td> <td>spLev</td> <td>spMax</td> <td> Details </td></tr> '
        text += '   <tr> <td>------</td> <td>------</td> <td>------</td> <td>------</td> <td>------</td> <td>------</td> </tr>'

        for (var i = 0; i < robotNos; ++i) {
            //default paras: "id", "status", "rare", "spLev", 
            //this.robotParaBrief = ["spMax"];
            text += '<tr>'
            text += '   <td><text>' + userRobotGM.getRobotParaBriefValue("id",     i, "null") + '</text></td>'
            text += '   <td><text>' + userRobotGM.getRobotParaBriefValue("status", i, "null") + '</text></td>'
            text += '   <td><text>' + userRobotGM.getRobotParaBriefValue("rare",   i, "null") + '</text></td>'
            text += '   <td><text>' + userRobotGM.getRobotParaBriefValue("spLev",  i, "null") + '</text></td>'
            text += '   <td><text>' + userRobotGM.getRobotParaBriefValue("spMax",  i, "FromWei") + '</text></td>'
            text += '   <td><button type="button" onClick="' + showPrefix + robotId + showSuffix + '"> Show </button></td>'
            text += '</tr>'
            text += '   <tr> <td>------</td> <td>------</td> <td>------</td> <td>------</td> <td>------</td> td>------</td>  </tr>'
        }
        text += '</table>'
        text += '</div>'
        document.getElementById(elementId).innerHTML = text;  
    }

    function loadUserRobotDetailsHtml(elementId, loadUserAllRobots, upgradeRobot, activeMining, claimReward, sellRobot, cancelSelling) {
        var loadUserAllRobotsFunc = loadUserAllRobots + "()"; 

        var upgradeRobotPrefix = upgradeRobot + "('OperationHash', '"; 
        var upgradeRobotSuffix = "')";

        var activeMiningPrefix = activeMining + "('OperationHash', 'TokenType', 'PosType', '"; 
        var activeMiningSuffix = "')";

        var claimRewardPrefix = enhance + "('OperationHash', 'TokenType', '"; 
        var claimRewardSuffix = "')";

        var sellRobotPrefix = enhance + "('OperationHash', 'SellPrice', '"; 
        var sellRobotSuffix = "')";

        var cancelSellingPrefix = enhance + "('OperationHash', '"; 
        var cancelSellingSuffix = "')";     
    
        var titlle = "User owned robots" 

        var tokenType = '<select id = "TokenType" style="width:80px">'
        tokenType += '<option value ="TestZSC">TestZSC </option>'
        tokenType += '</select>'

        var posType = '<select id = "PosType" style="width:80px">'
        posType += '<option value ="7">7 Days (1.0%) </option>'
        posType += '<option value ="30">30 Days (2.0%)</option>'
        posType += '<option value="90">90 Days (3.5%)</option>'
        posType += '<option value="180">180 Days (5.0%)</option>'
        posType += '<option value="360">360 Days (7.5%)</option>'
        posType += '</select>'

        var sellPrice = '<input style="width:100px" id="SellPrice></input>'

        var robotStatus = userRobotGM.getRobotParaDetailValue("status",      "null");
        var robotId     = userRobotGM.getRobotParaDetailValue("id",          "null");

        var text  = '<div class="well" align="center" >' + titlle + '<br>';
        text  = '<text id="OperationHash" value = "log:"> </text> </div>';

        text += '<div class="well" align="center" >'
        text += '   <button type="button" onClick="' + createGen0Func + '">  Create Lev0 ZSC miner robot (Cost 0.01ETH) </button> <br>'
        text += '</div>';

        text += '<div class="well">';
        text += '<table align="center" style="width:600px;min-height:30px">'

        text += '<tr> <td><text> id     </text></td> <td><text>' + robotId     + '</text></td> </tr>';
        text += '<tr> <td><text> status </text></td> <td><text>' + robotStatus + '</text></td> </tr>';
        text += '<tr> <td>------</td> <td>------</td> </tr>'


        //default paras: "id", "status", "rare", "spLev", 
        //others: "ctg", "name", "minedSP", "rewardSP", "rrMineDay", "rrRewardDay", "spCur", "spMax", "spBase", "mineStart", "mineEnd", "spBirth", "spExtra", "rrType" ,"rrBirth", "rrExtra", "rrLevEft", "upProb", "upBirth", "upExtra", "upPrice", "price", "seller"
        if (robotStatus == "idle") {
            text += '<tr>'
            text += '   <td><text> Upgrade </text></td> '
            text += '   <td><button type="button" onClick="' + upgradeRobotPrefix + robotId + upgradeRobotSuffix + '"> Confirm </button></td>'
            text += '</tr>'
            text += '<tr>'
            text += '   <td><text> Mining </text></td> '
            text += '   <td>' + tokenType + posType + '<button type="button" onClick="' + activeMiningPrefix + robotId + activeMiningSuffix + '"> Confirm </button></td>'
            text += '</tr>'
            text += '<tr>'
            text += '   <td><text> Sell </text></td> '
            text += '   <td>' + sellPrice + '<button type="button" onClick="' + sellRobotPrefix + robotId + sellRobotSuffix + '"> Confirm </button></td>'
            text += '</tr>'
        } else if (robotStatus == "mining") {
            text += '<tr>'
            text += '   <td><text> Upgrade </text></td> '
            text += '   <td><button type="button" onClick="' + claimRewardPrefix + robotId + claimRewardSuffix + '"> Confirm </button></td>'
            text += '</tr>'
        } else {
            // robotStatus == "selling"
            text += '<tr>'
            text += '   <td><text> Upgrade </text></td> '
            text += '   <td><button type="button" onClick="' + cancelSellingPrefix + robotId + cancelSellingSuffix + '"> Confirm </button></td>'
            text += '</tr>'
        }
        text += '<tr> <td>------</td> <td>------</td> </tr>'

        text += '<tr> <td><text> rare         </text></td> <td><text>' + userRobotGM.getRobotParaDetailValue("rare",        "null") + '</text></td> </tr>';
        text += '<tr> <td><text> spLev        </text></td> <td><text>' + userRobotGM.getRobotParaDetailValue("spLev",       "null") + '</text></td> </tr>';
        text += '<tr> <td><text> ctg          </text></td> <td><text>' + userRobotGM.getRobotParaDetailValue("ctg",         "null") + '</text></td> </tr>';
        text += '<tr> <td><text> name         </text></td> <td><text>' + userRobotGM.getRobotParaDetailValue("name",        "null") + '</text></td> </tr>';
        text += '   <tr> <td>------</td> <td>------</td> </tr>'

        text += '<tr> <td><text> spLev        </text></td> <td><text>' + userRobotGM.getRobotParaDetailValue("spLev",       "null") + '</text></td> </tr>'; 
        text += '<tr> <td><text> spBase       </text></td> <td><text>' + userRobotGM.getRobotParaDetailValue("spBase",      "FromWei") + '</text></td> </tr>';
        text += '<tr> <td><text> spBirth      </text></td> <td><text>' + userRobotGM.getRobotParaDetailValue("spBirth",     "FromWei") + '</text></td> </tr>';
        text += '<tr> <td><text> spExtra      </text></td> <td><text>' + userRobotGM.getRobotParaDetailValue("spExtra",     "FromWei") + '</text></td> </tr>';
        text += '<tr> <td><text> spMax        </text></td> <td><text>' + userRobotGM.getRobotParaDetailValue("spMax",       "FromWei") + '</text></td> </tr>';
        text += '   <tr> <td>------</td> <td>------</td> </tr>'

        text += '<tr> <td><text> rrType       </text></td> <td><text>' + userRobotGM.getRobotParaDetailValue("rrType",      "null") + '</text></td> </tr>';
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
        text += '<tr> <td><text> seller       </text></td> <td><text>' + userRobotGM.getRobotParaDetailValue("seller",      "null") + '</text></td> </tr>';
        text += '   <tr> <td>------</td> <td>------</td> </tr>'

        text += '</table>'
        text += '</div>'
    
        document.getElementById(elementId).innerHTML = text;  
    }

</script>

</body>
</html>
