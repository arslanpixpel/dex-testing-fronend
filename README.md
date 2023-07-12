# pixpel-frontend

This is a [React](https://reactjs.org/) project bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Table of Contents
- [pixpel-frontend](#pixpel-frontend)
    * [🧶 Installation](#-installation)
    * [⚛ Development](#-development)
    * [📦 Build](#-development)
    * [🚀 Run](#-run)
    * [🧰 Configs](#-configs)
      * [Configs/main](#configsmain)
      * [Configs/api](#configsapi)
      * [Configs/contractsInfo](#configscontractsinfo)

## 🧶 Installation

First it's necessary to install packages:

```bash
yarn install
```

## ⚛ Development
```bash
yarn start
```

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

## 📦 Build
```bash
yarn build
```

Builds the app for production to the build folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.\
The build is minified and the filenames include the hashes:

## 🚀 Run

To run project locally:

```bash
yarn serve
```

Builds the app for production to the `build` folder and runs the app on local server.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.


## 🧰 Configs
Configs placed in folder [src/config](src/config)
### Configs/main
Main config is placed in file [src/config/main.js](src/config/main.js):

| variable                	| description                                         	| default value                     	|
|-------------------------	|-----------------------------------------------------	|-----------------------------------	|
| PIXPEL_CONTRACT_ADDRESS 	| Contract address                                    	| {"index":'3879n',"subindex":'0n'} 	|
| MAX_ENERGY              	| Max energy allow for transaction                    	| 30000n                            	|
| MAX_CCD_DELTA           	| For calculating max CCD amount, considering fee etc 	| 120                               	|

### Configs/api
API config is placed in file [src/config/api.js](src/config/api.js):

| variable                	| description                                                    	| default value                                               	|
|-------------------------	|----------------------------------------------------------------	|-------------------------------------------------------------	|
| JS_NODE_URL             	| Node url for getting graph data                                	| https://concordium-servernode.dev-site.space                	|
| JSON_RPC_URL            	| Json RPC url for invokeContract methods                        	| https://json-rpc-proxy-0.dev-site.space                     	|
| NETWORK                 	| Concordium network name, used for generating link to dashboard 	| testnet                                                     	|
| PIXPEL_CONTRACT_METHODS 	| List of Pixpel contract methods names                          	| *List of 10 contract methods*                               	|
| CIS2_CONTRACT_METHODS   	| List of CIS2 contract methods names                            	| {"updateOperator":"updateOperator","balanceOf":"balanceOf"} 	|

### Configs/contractsInfo
Contracts info config is placed if file [src/config/contractsInfo.js](src/config/contractsInfo.js):

| variable                  	| description                                            	|
|---------------------------	|--------------------------------------------------------	|
| MULTI_CONTRACT_MODULE_REF 	| CIS2 multi module reference                            	|
| MULTI_CONTRACT_SCHEMA     	| CIS2 multi contract schema (hex)                       	|
| CIS2_MULTI_CONTRACT_INFO  	| CIS2 multi contract info (contractName, schemaBuffer)  	|
| PIXPEL_SWAP_SCHEMA        	| Pixpel Swap contract schema (hex)                      	|
| PIXPEL_SWAP_CONTRACT_INFO 	| Pixpel Swap contract info (contractName, schemaBuffer) 	|
