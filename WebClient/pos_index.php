<?php 
/*
Copyright (c) 2018 ZSC Dev Team
*/

session_start();
$_SESSION["userType"] = "staker";
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

    checkeWeb3Account(function(account) {
        userLogin = new ZSCLogin(account);
        checkUser();
    });
    /////////////////////////////
    
    function applyForZSCUser(userType, hashId) {
        userLogin.activeByUser(userType, hashId);
    }

    function checkUser(adrId) { 
        userLogin.tryLogin(function(ret) {
            var textBody;
            if(ret) {
                textBody = '<table align="center"> <tr><td><i>Welcome!</i> </td></tr></table>'; 
            } else {
                textBody = ''
                + '<table align="center"><tr><td>'
                + '   <button type="button" onClick="applyForZSCUser('+ "'staker', 'ApplyForUserHash')" + ' ">Apply for staker</button> <br><br>'
                + '   <text id="ApplyForUserHash"></text>'
                + '</td></tr></table>'
            }
            document.getElementById("PageBody").innerHTML = textBody;
        });
    }

    
</script>

</body>
</html>
