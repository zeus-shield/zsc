#!/bin/bash

SFLAGS="--optimize --overwrite --pretty-json --combined-json bin,abi"
CORE="sol"

SOURCES=(
sample
logistics_string
logistics_string_min
)

for((i=0;i<${#SOURCES[@]};i++));
do
SOURCE=${SOURCES[i]}".sol";
echo "########## compiling "${SOURCE}" ##########"

# Compiling to JSON file(build/xxx/combined.json)
solc ${SFLAGS} ./${CORE}/${SOURCE} -o build/${SOURCES[i]}

# Compiling to JS file(WebAdm/js/compiled_xxx.js)
# COMPILED="`solc ${SFLAGS} ./${CORE}/${SOURCE}`"
# echo "########## compiled "${COMPILED}" ##########"
# echo "var compiled_"${SOURCES[i]}"=${COMPILED}" > ./compiled/"${SOURCES[i]}".js
done

read -p "Press any key to continue."