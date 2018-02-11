/*
Copyright (c) 2018, ZSC Dev Team, Eric Yao
2018-02-10: v0.01
*/

pragma solidity ^0.4.18;
import "./db_entity.sol";
import "./db_item.sol";

library DBTemplate {
    struct Template {
        DBEntity.Entity entity_;
        DBItem.Item[]  items_;
        mapping(string => uint) itemExist_;
    }

    function initTemplate(Template storage _template) public {
        DBEntity.insertParameter(_template.entity_, "temp");
    }

    function addItem(Template storage _template, DBItem.Item storage _item, string _name) public returns (bool) {
        if (_template.itemExist_[_name] != 0)
            return false;

        _template.itemExist_[_name] = 1;
        _template.items_.push(_item);

        return true;
    }
}
