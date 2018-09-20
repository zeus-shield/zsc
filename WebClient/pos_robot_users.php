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
                loadUserRobots();
            }
        });
    });

    /////////////////////////////
    function loadUserRobots() {
        userRobotGM.loadUserRobots(true, function() {
            loadAllRobotHtml("PageBody", "createGen0Robot", "showRobotDetails");
        });
    }

    function createGen0Robot(hashId) {
        userRobotGM.createGen0Robot(hashId, function(){
            loadAllRobotHtml("PageBody", "createGen0Robot", "showRobotDetails");
        });
    }

    function showRobotDetails(hashId, robotIndex) {
        userRobotGM.loadUserRobots(false, function() {
            loadHtml("PageBody", "loadUserRobots", "enhanceRobot");
        });
    }

    /////////////////////////
    function enhanceRobot(hashId, robotId) {
        userRobotGM.enhanceMinerRobot(hashId, robotId, function(){
            loadHtml("PageBody", "loadUserRobots", "enhanceRobot");
        });
    }

    /////////////////////////
    function sellRobot(hashId, robotId, priceId) {
        var price = document.getElementById(priceId).value;
        userRobotGM.publishMinerRobot(hashId, robotId, price, function() {                
        });
    }

    function cancelSelling(hashId, robotId) {
        userRobotGM.cancalSellingMinerRobot(hashId, robotId, function() {                
        });
    }

    /////////////////////////
    function activeMining(hashId, tokenTypeId, posTypeId, robotId) {
        var tokenType = document.getElementById(tokenTypeId).value;
        var posType = document.getElementById(posTypeId).value;
        userRobotGM.activeMinerRobot(hashId, robotId, tokenType, posType, function() {                
        });
    }

    function claimReward(hashId, tokenTypeId, robotId) {
        var tokenType = document.getElementById(tokenTypeId).value;
        userRobotGM.claimReward(hashId, robotId, tokenType, function() {                
        });
    }

    /////////////////////////
    function loadAllRobotHtml(elementId, createGen0, showRobot) {
        var createGen0Func = createGen0 + "('OperationHash')"; 

        var showPrefix = showRobot + "('OperationHash', '"; 
        var showSuffix = "')";

        var symbol;
        var adr;
        var balance;
        var hashId;
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
            hashId  = symbol + "Hash";
            sentoId = symbol + "Dest";
            amountId= symbol + "Amount";
    
            text += '<tr>'
            text += '   <td><text>' + userRobotGM.getRobotPara("id",      false, i) + '</text></td>'
            text += '   <td><text>' + userRobotGM.getRobotPara("status",  false, i) + '</text></td>'
            text += '   <td><text>' + userRobotGM.getRobotPara("rare",    false, i) + '</text></td>'
            text += '   <td><text>' + userRobotGM.getRobotPara("spLev",   false, i) + '</text></td>'
            text += '   <td><text>' + userRobotGM.getRobotPara("spMax",   false, i) + '</text></td>'
            text += '   <td><button type="button" onClick="' + showPrefix + robotId + showSuffix + '"> Show </button></td>'
            text += '</tr>'
            text += '   <tr> <td>------</td> <td>------</td> <td>------</td> <td>------</td> <td>------</td> td>------</td>  </tr>'
        }
        text += '</table>'
        text += '</div>'
        document.getElementById(elementId).innerHTML = text;  
    }

</script>

</body>
</html>
