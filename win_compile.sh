#!/bin/bash

SFLAGS="--optimize --overwrite --pretty-json --combined-json bin,abi"
CORE="EthCore"

SOURCES=(
log_recorder
pos_block
pos_base
sys_overlayer
#sys_gm_wallet
sys_gm_simulator
)

for((i=0;i<${#SOURCES[@]};i++));
do
SOURCE=${SOURCES[i]}".sol";
echo "########## compiling "${SOURCE}" ##########"
solc ${SFLAGS} ./${CORE}/${SOURCE} -o build/${SOURCES[i]}
done

read -p "Press any key to continue."