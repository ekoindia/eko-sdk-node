# eko-sdk-node

Node.js SDK for [Eko APIs](https://developers.eko.in)


[![npm version](https://badge.fury.io/js/@ekoindia%2Feko-sdk-node.svg)](https://badge.fury.io/js/@ekoindia%2Feko-sdk-node) [![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/ekoindia/eko-sdk-node/issues)

[![https://nodei.co/npm/@ekoindia/eko-sdk-node.png?downloads=true&downloadRank=true&stars=true](https://nodei.co/npm/@ekoindia/eko-sdk-node.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/@ekoindia/eko-sdk-node)


**Warning: This is not yet ready to use in production**

Have any questions/suggestions? Share in the [Discord community](http://dsc.gg/ekodevs)

## Getting started

### Install the package

```
npm install @ekoindia/eko-sdk-node
```

### Initialize the SDK

```
const Eko = require('@ekoindia/eko-sdk-node')
const ekoAPI = Eko.init({
    hostname: "eko.in",
    port: 443,
    developerKey: "becbbce45f79c6f5109f848acd540567",
    authKey: "f74c50a1-f705-4634-9cda-30a477df91b7",
    initiatorId: "9971771929"
})
```


### Usage for KYC related APIs

```
//How to verify PAN
ekoAPI.verifyPAN({
    panNumber: 'pan number',
    purpose: 'purpose of verification',
    purposeDescription: 'description of the purpose'
}, function(err, result){
    console.log(JSON.stringify(result));
})
```

```
//How to verify Bank account
ekoApi.verifyBankAccount({ 
    accountNo: '12313897932', 
    ifsc: 'SBIN02349D', 
    customerId: 4315453, 
    userCode: 12345 
}, (err, result) => { 
    console.log(JSON.stringify(result));
})
```

## Resources

- [Eko Developers Community](https://github.com/ekoindia/eko-dev-community)
- [Discord](http://dsc.gg/ekodevs)
- [YouTube](https://www.youtube.com/@ekodevelopers)
