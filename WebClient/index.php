<?php 
/*
Copyright (c) 2018 ZSC Dev Team
*/
?>

<html>
<head>
<?php 
include("include.php");
$htmlObjects = new ZSCInclude();
echo $htmlObjects->loadScriptFiles(); 
?>
</head>
<body>
    <div class="col-lg-12">
        <br><i>Web-client for testing ZSC system on the Rinkeby</i><br><br>
        <div class="well" id="PageAlert"><?php echo $htmlObjects->loadAlert(); ?></div>
        <div class="well" id="PageHeader"><?php echo $htmlObjects->loadPosHeader(); ?></div>
        <div class="well" id="PageBody"></div>
    </div>

<script type="text/javascript">
    var web3;
    var zscUser = new ZSCUser();
    if (doesLocalWeb3js()) { web3 = setupWeb3js();} 
    else { web3 = new Web3(web3.currentProvider);} //Metamask

    function checkUser(adrId) { 
        zscUser.tryLogin(function(ret) {
            var textBody;
            if(ret) {
                textBody = '<table align="center"> <tr><td><i>Welcome!</i> </td></tr></table>'; 
            } else {
                document.getElementById("PageHeader").innerHTML = '<table align="center"> <tr><td><i>Apply one of the following user types!</i> </td></tr></table>'; 
                textBody = ''
                + '<table align="center"><tr><td>'
                + '   <button type="button" onClick="applyForZSCUser('+ "'staker', 'ApplyForUserHash')" + ' ">Apply for staker</button> <br><br>'
                + '   <text id="ApplyForUserHash"></text>'
                + '</td></tr></table>'
            }
            document.getElementById("PageBody").innerHTML = textBody;
        });
    }

    function applyForZSCUser(userType, hashId) {
        zscUser.activeByUser(userType, hashId);
    }

    checkUser();
</script>

</body>
</html>
