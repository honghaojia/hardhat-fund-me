# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

#

## Preparation

To use chainlink function ,you need to add package of @chainlink/contracts!

```shell
yarn add --dev @chainlink/contracts
```

#

To deploy contract within hardhat project ,you need to add package

```shell
yarn add --dev @nomiclabs/hardhat-ethers@npm:hardhat-deploy-ethers ethers
```

and then add "require("@nomiclabs/hardhat-ethers")" in the hardhat.config.js

#

To make your code more good-looking , you can add a package called prettier-plugin-solidity

```shell
yarn add --dev prettier prettier-plugin-solidity
```
and don't forget to add file .prettierignore  to lighten job amount.


or you can use extension called Prettier-code for vscode.
```js
"editor.defaultFormatter": "esbenp.prettier-vscode",
```
add the above code in settings.json
#
If you want to verify contract successfully, you will need a new proxy 
firstly , add undici package
```shell
yarn add --dev undici
```
then add the following codes in the hardhat.config.js
```
//用于告诉程序按照本地代理链接网络
const { ProxyAgent, setGlobalDispatcher } = require("undici")
const proxyAgent = new ProxyAgent("http://172.26.80.1:7890")
setGlobalDispatcher(proxyAgent)
```

#

#

# Optimize Gas_Use

1. use type "immutable"&&"constant" instead of storage as much as possible.
2. when read storage_datas . read them after loading to local memory.
3. don't use getter function , instead of public ,use private .

### Generally movement

```shell
yarn hardhat compile
yarn hardhat deploy --network nepolia
yarn hardhat node
yarn hardhat console //用来测试的绝佳选择
```
