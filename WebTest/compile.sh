#!/bin/bash

SFLAGS="--optimize --overwrite --pretty-json --combined-json bin,abi"
CORE="sol"
MODULE="logistics"
MODE="single"
# MODE="multiple"
IMPORTPATH="/=/"
SOURCES=(
logistics
)
BUILDPATH="./build"

for((i=0;i<${#SOURCES[@]};i++));
do
SOURCE=${SOURCES[i]}".sol";
echo "########## compiling "${SOURCE}" ##########"

# Compiling to JSON file(build/xxx/combined.json)
# solc ${SFLAGS} ${IMPORTPATH} ./${CORE}/${MODULE}/${MODE}/${SOURCE} -o ${BUILDPATH}/${MODULE}/${MODE}/${SOURCES[i]}
solc ${SFLAGS} ${IMPORTPATH} ./${CORE}/${MODULE}/${MODE}/${SOURCE} -o ${BUILDPATH}/${MODULE}/${MODE}
mv ${BUILDPATH}/${MODULE}/${MODE}/combined.json ${BUILDPATH}/${MODULE}/${MODE}/${SOURCES[i]}.json


# Compiling to JS file(WebAdm/js/compiled_xxx.js)
# COMPILED="`solc ${SFLAGS} ./${CORE}/${SOURCE}`"
# echo "########## compiled "${COMPILED}" ##########"
# echo "var compiled_"${SOURCES[i]}"=${COMPILED}" > ./compiled/"${SOURCES[i]}".js
done

read -p "Press any key to continue."