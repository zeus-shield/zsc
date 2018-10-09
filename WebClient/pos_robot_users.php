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

    let binded = false;

    checkeWeb3Account(function(account) {
        userLogin = new ZSCLogin(account);
        userLogin.tryLogin(userType, function(ret) {
            binded = ret;
            userLogin.getControlApisInfo(userLogin, function(ret) {
                if(!ret) { 
                    window.location.href = "index.php";
                } else {
                    userRobotGM = new ZSCRobotAllBreifes(account, userLogin.getErc721Adr(), userLogin.getControlApisFullAbi());
                    loadAllUserRobotBriefs();
                }
            }); 
        });
    });

    /////////////////////////////
    function loadAllUserRobotBriefs() {
        userRobotGM.loadAllRobotBriefs("user", "0x0", function() {
            loadUserAllRobotHtml("PageBody", "showRobotDetails", "createGen0Robot", "bindAndActivate");
        });
    }

    function createGen0Robot(hashId) {
        userRobotGM.createGen0Robot(hashId, function(){
            window.location.reload(true);
        });
    }

    function showRobotDetails(robotId) {
        window.location.href = "pos_robot_detail.php?robotId=" + robotId;
    }

    function bindAndActivate() {
        window.location.href = "index_login.php?type=staker";
    }

    /////////////////////////    
    function loadUserAllRobotHtml(elementId, showRobot, createGen0, bindAndActivate) {
        var createGen0Func = createGen0 + "('OperationHash')"; 

        var showPrefix = showRobot + "('"; 
        var showSuffix = "')";

        var robotNos = userRobotGM.getRobotNos();
        var titlle = "User owned robots" 

        // text  = '<div class="well" align="center" >' + titlle + ' | Generate new robot - R: 78%; SR: 20; SSR: 2% <br>';
        text  = '<div class="well" align="center" >'
        text  += '<text> ' + titlle + ' - Generate new robot - R: 78%; SR: 20; SSR: 2% </text><br>';
        text  += '<text id="OperationHash" value = "log:"> </text> </div>';

        text += '<div class="well" align="center" >'
        if (binded) {
            text += '   <button type="button" onClick="' + createGen0Func + '">  Create Lev0 miner robot (Cost 0.01ETH) </button> <br>'
        } else {
            text += '   <button type="button" onClick="'+ bindAndActivate + '()"' + '>Bind account and activate wallet at first, then create Lev0 miner robot (Cost 0.01ETH)</button> <br>'
        }
        text += '</div>';

        text += '<div class="well">';
        text += '<table align="center" style="width:600px;min-height:30px">'
        text += '   <tr> <td>id</td> <td>status</td> <td>rare</td> <td>spLev</td> <td>spMax</td> <td> Details </td></tr> '
        text += '   <tr> <td>------</td> <td>------</td> <td>------</td> <td>------</td> <td>------</td> <td>------</td> </tr>'

        for (var i = 0; i < robotNos; ++i) {
            //default paras: "id", "status", "rare", "spLev", 
            //this.robotParaBrief = ["spMax"];
            var robotId = userRobotGM.getRobotBriefParaValue("id",     i, "null");
            text += '<tr>'
            text += '   <td><text>' + robotId + '</text></td>'
            text += '   <td><text>' + userRobotGM.getRobotBriefParaValue("status", i, "null") + '</text></td>'
            text += '   <td><text>' + userRobotGM.getRobotBriefParaValue("rare",   i, "Rare") + '</text></td>'
            text += '   <td><text>' + userRobotGM.getRobotBriefParaValue("spLev",  i, "null") + '</text></td>'
            text += '   <td><text>' + userRobotGM.getRobotBriefParaValue("name",   i, "null") + '</text></td>'
            text += '   <td><button type="button" onClick="' + showPrefix + robotId + showSuffix + '"> Show </button></td>'
            text += '</tr>'
        }
        text += '</table>'
        text += '</div>'
        document.getElementById(elementId).innerHTML = text;  
    }

</script>

</body>
</html>
