#!/bin/bash

SFLAGS="--optimize --overwrite --pretty-json --combined-json bin,abi"

solc ${SFLAGS} ./EthCore/db_database.sol -o build/db_database

read -p "Press any key to continue."