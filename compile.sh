#!/bin/bash

SFLAGS="--optimize --overwrite --pretty-json --combined-json bin,abi"
CORE="EthCore"

SOURCES=(
log_recorder
log_transaction
pos_block
pos_base
sys_overlayer
#sys_gm_wallet
sys_gm_simulator
sys_gm_token
sys_gm_string
#sys_gm_db
#sys_gm_factory
adm_base
app_proxy
db_database
db_idmanager
factory_base
wallet_eth
wallet_erc20
db_receiver
db_provider
db_staker
db_item
db_template
db_agreement
control_apis
plat_string
plat_math
plat_json
#plat_vector3d
zscDatabase
ZSCTestToken
)

for((i=0;i<${#SOURCES[@]};i++));
do
SOURCE=${SOURCES[i]}".sol";
echo "########## compiling "${SOURCE}" ##########"
solc ${SFLAGS} ./${CORE}/${SOURCE} -o build/${SOURCES[i]}
done

read -p "Press any key to continue."