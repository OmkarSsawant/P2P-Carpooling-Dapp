## Issue #1
Unsupported Local Chain
Solutions that did not work:
* Created a Project using eth-boilder-plate of Morallis.
* Tried Custom Connectors such as `JSONRPCProvider` and `InjectedConnector` but did not work.
* Added localhost in config of wagmi
* Customized chainId,network and rpcUrls and wsUrls. But Still was Unable to Support 

Solution : To Change the connector used to be local supported used wallet connect as bridge instead of just morallis



##Issue #2
mount error
Solutions that did not work:
* WalletConnect With Wagmi Project was created but wallet connect started to throw the mount error 
* Switched node version as example project and tried gen. projects
* Configured as per the eth-boilerplate but kept node v compatible to web3uikit
* Created Indicidual project and added `wagmi` `vem` but were incompatible with react node verion .Thorwed mount exception
* Created Project using `wagmi init` .Configured all things accorging to eth-boilerplate.Again Thorwed mount exception

Solved:
* Created Project using `wagmi init` and used `NEXT UI` as ui library
* hadling connections only using wagmi



## Issue #3
https://github.com/MetaMask/metamask-extension/issues/14963
Solved:
The issue is either with metamask or hardhat. The metamask is giving irrelevant calls after a call from code.This works on testnet as expected.
Solution:
* Reset Metamask
* Add fallback function in contract *it should not be payable bcz user money will be wasted for failed call*.
