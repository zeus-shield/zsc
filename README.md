# ZSC
Zeusshield (ZSC) system: AI&P2P Insurance Market Platform

Official solidity implementation for the core part of the ZSC system.

Implementation of the website based interfance not included here.

## 1. Codes structure

### 1.1 Contracts: the solidity-based coding here

#### 1.1.1 token: zsc token contract

#### 1.1.2 database: construct the decentralized databased

#### 1.1.3 plat: basic functions

### 1.2 Test: testing codes here

## 1. ZSC token part
Based on ERC20 protocol

2017.09.05: add multisigtoken.sol, multisigwallet.sol and token.sol

## 2. ZSC platform part:
### 2.1. Framework Components

---Solidity Libraries---

              |--- db_receiver

              |--- db_provider

db_entity --> |--- db_item

              |--- db_agreement

              |--- db_template


### 2.2. Code update

2017.10.28: add the initial version of zscDatabase.sol

2017.12.18: add five files: plat_math.sol v0.01; plat_string.sol v0.01; plat_vector3d.sol v0.01; db_entity.sol v0.01; db_agreement.sol v0.01

2018.02.09: add three new files: db_receiver.sol v0.03; db_database.sol v0.02; test_basic_funcs.js 0.01

2018.02.10: add one new file: db_provider.sol 0.02

2018.02.10: add one new file: db_itme.sol, start re-constructing db_entity and related framwork components.

