# ZSC
Zeusshield (ZSC) system: AI&P2P Insurance Market Platform

Official solidity implementation for the core part of the ZSC system.

Implementation of the website based interfance not included here.

## 1. Coding structure

### 1.1 Contracts: the solidity-based coding here

#### token: zsc token contract, Based on ERC20 protocol

#### database: construct the decentralized databased

#### plat: basic functions

### 1.2 Test: testing codes here

## 2. ZSC platform part:

### 2.1 Framework Components

|- objct 

|--- db_node 

|----- db_entity 

|------- db_item

|------- db_receiver

|------- db_provider

|------- db_template

|------- db_agreement

|------- db_idmanager

|------- db_database

|--------- app_basic

### 2.2 .sol update log

2017.09.05: add multisigtoken.sol, multisigwallet.sol and token.sol

2017.10.28: add the initial version of zscDatabase.sol

2017.12.18: add five files: plat_math.sol v0.01; plat_string.sol v0.01; plat_vector3d.sol v0.01; db_entity.sol v0.01; db_agreement.sol v0.01

2018.02.09: add three new files: db_receiver.sol v0.03; db_database.sol v0.02; test_basic_funcs.js 0.01

2018.02.10: add one new file: db_provider.sol 0.02

2018.02.10: add one new file: db_item.sol 0.01

2018.02.11: add three new file: object.sol 0.01; db_template.sol 0.01; db_idmanager.sol 0.01

2018.02.12: add a new file: db_node.sol 0.01

2018.02.13-14: re-design the topology among different db modules

2018.02.15: add a new file: app_basic.sol 0.01
