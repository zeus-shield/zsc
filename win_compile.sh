#!/bin/bash

SFLAGS="--optimize --overwrite --pretty-json --combined-json bin,abi"
CORE="EthCore"

echo "########## compiling log_recorder.sol ##########"
solc ${SFLAGS} ./${CORE}/log_recorder.sol -o build/log_recorder

echo "########## compiling pos_block.sol ##########"
solc ${SFLAGS} ./${CORE}/pos_block.sol -o build/pos_block

echo "########## compiling pos_base.sol ##########"
solc ${SFLAGS} ./${CORE}/pos_base.sol -o build/pos_base

echo "########## compiling sys_overlayer.sol ##########"
solc ${SFLAGS} ./${CORE}/sys_overlayer.sol -o build/sys_overlayer



read -p "Press any key to continue."