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
    var userLogin;
    var userRobotGM;

    checkeWeb3Account(function(account) {
        userLogin = new ZSCLogin(account);
        userLogin.tryLogin(function(ret) { 
            if(!ret) { 
                window.location.href = "index.php";
            } else {
                userRobotGM = new ZSCRobotOwned(account, userLogin.getControlApisAdr(), userLogin.getControlApisFullAbi());
                loadUserRobots();
            }
        });
    });

    /////////////////////////////
    function loadUserRobots() {
        userRobotGM.loadUserRobots(function() {
            loadHtml("PageBody", "activeMining", "claimReward");
        });
    }

    function activeMining(hashId, posTypeId, robotId) {
        var posType = document.getElementById(posTypeId).value;
        userRobotGM.activeMinerRobot(hashId, robotId, posType, function() {                
        });
    }

    function claimReward(hashId, robotId) {
        userRobotGM.claimReward(hashId, function() {                
        });
    }

    function loadHtml(elementId, mining, claim) {
        var miningPrefix = mining + "('OperationHash', 'PosType', '"; 
        var miningSuffix = "')"; 
        var claimPrefix = claim + "('OperationHash', '"; 
        var claimSuffix = "')";

        var symbol;
        var adr;
        var balance;
        var hashId;
        var robotNos = userRobotGM.getRobotNos();

        var posType = '<td><select id = "PosType" style="width:60px">'
        posType += '<option value ="7">7 Days (3%) </option>'
        posType += '<option value ="30">30 Days (3.5%)</option>'
        posType += '<option value="90">90 Days (4%)</option>'
        posType += '<option value="180">180 Days (5%)</option>'
        posType += '<option value="360">360 Days (6%)</option>'
        posType += '</select></td>'

        var titlle = "user mining (TestZSC) status: " 

        text  = '<div class="well">' + titlle + '<br>';
        text += '<text id="OperationHash" value = "log:"> </text> </div>';

        text += '<div class="well">';
        text += '<table align="center" style="width:800px;min-height:30px">'
        text += '   <tr> <td>Robot ID</td> <td>Level</td> <td>Cur./Max SP </td> <td> Reward Ratio </td> <td>Start/End</td> <td>Type</td> <td>Mining</td> <td> Rewards</td> </tr> '
        text += '   <tr> <td>------</td> <td>------</td> <td>------</td> <td>------</td> <td>------</td>  <td>------</td> <td>------</td> <td>------</td> </tr>'

        for (var i = 0; i < robotNos; ++i) {
            var robotId = userRobotGM.getRobotId(i);
            var status = "Idle"; 
            if (userRobotGM.getMineStart(i) > 0) {
                status = "Mining";
            } else {
                if (userRobotGM.getPrceForSale(i) > 0) {
                    status = "Selling";
                } 
            }

            if (status != "selling") {
                text += '<tr>'
                text += '   <td><text>' + robotId + '</text></td>'
                text += '   <td><text>' + userRobotGM.getRobotLev(i) + '</text></td>'
                text += '   <td><text>' + userRobotGM.getCurSP(i) + '<br>'  + userRobotGM.getMaxSP(i) + '</text></td>'
                text += '   <td><text>' + userRobotGM.getRewardRatio(i) + '%</text></td>'
                text += '   <td><text>' + userRobotGM.getMineStart(i) + '<br>'  + userRobotGM.getMineEnd(i) + '</text></td>'
                if (status == "Idle") {
                    text += posType;
                    text += '   <td><button type="button" onClick="' + miningPrefix + robotId + miningSuffix + '"> Start </button></td>'
                } else {
                    text += '   <td><text>Not Available</text></td>'
                    text += '   <td><text>Not Available</text></td>'
                }

                if (status == "mining") {
                    text += '   <td><button type="button" onClick="' + claimPrefix + robotId + claimSuffix + '"> Claim (' + userRobotGM.getRewards(i) + ')</button></td>'
                } else {
                    text += '   <td><text>Not Available</text></td>'
                }
                text += '</tr>'
                text += '   <tr> <td>------</td> <td>------</td> <td>------</td> <td>------</td> <td>------</td>  <td>------</td> <td>------</td> <td>------</td> </tr>'
            }
        }
        text += '</table>'
        text += '</div>'
    
        document.getElementById(elementId).innerHTML = text;  
    }

</script>

</body>
</html>
