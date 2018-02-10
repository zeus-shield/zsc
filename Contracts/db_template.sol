/*
Copyright (c) 2018, ZSC Dev Team, Eric Yao
2018-02-10: v0.01
*/

pragma solidity ^0.4.18;
import "./db_entity.sol";

library DBTemplate {
    struct Template {
        DBEntity.Entity entity_;
    }

    function initTemplate(Template storage _template) public {
        DBEntity.insertParameter(_template.entity_, "temp");
    }
}
