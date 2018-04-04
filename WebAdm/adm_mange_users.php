

<?php include("adm_header.php"); ?>

<html>
<head>
<?php echo includeScriptFiles(); ?>
<script type="text/javascript">
    var web3 = setupWeb3js(false);
   
    function addUser(usernameId, elementId) {
        var adr = "<?php echo readModuleAddress('ControlApisAdv')?>";
        sF_addUser(adr, usernameId, elementId);
    }

</script>
</head>
<body>

<?php echo includeHeader();?>

<div class="page-header"><font size="5" color="blue" >Setup ZSC system in the testing envrioment</font></div>

<?php echo includAllAdrs();?>

<div class="well">
        <text>Username</text>  <input type="text" id="AddUserName" value="test"></input> <br>
        <button type="button" onClick="addUser('AddUserName', 'AddUserHash')">Add a user</button> <br>
        <text id="AddUserHash"></text>
</div>

</body>
</html>

