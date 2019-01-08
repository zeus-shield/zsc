#!/bin/bash

SFLAGS="--optimize --overwrite --pretty-json --combined-json bin,abi"
CORE="sol"
MODULE="insurance"
IMPORTPATH="/=/"
SOURCES=(
insurance_company
insurance_template
insurance_user
insurance_policy
insurance_user_policy
)
BUILDPATH="../build"

for((i=0;i<${#SOURCES[@]};i++));
do
SOURCE=${SOURCES[i]}".sol";
echo "########## compiling "${SOURCE}" ##########"

# Compiling to JSON file(build/xxx/combined.json)
# solc ${SFLAGS} ${IMPORTPATH} ./${CORE}/${MODULE}/${SOURCE} -o ${BUILDPATH}/${MODULE}/${SOURCES[i]}
solc ${SFLAGS} ${IMPORTPATH} ../${CORE}/${MODULE}/${SOURCE} -o ${BUILDPATH}/${MODULE}
mv ${BUILDPATH}/${MODULE}/combined.json ${BUILDPATH}/${MODULE}/${SOURCES[i]}.json


# Compiling to JS file(WebAdm/js/compiled_xxx.js)
# COMPILED="`solc ${SFLAGS} ./${CORE}/${SOURCE}`"
# echo "########## compiled "${COMPILED}" ##########"
# echo "var compiled_"${SOURCES[i]}"=${COMPILED}" > ./compiled/"${SOURCES[i]}".js
done

read -p "Press any key to continue."