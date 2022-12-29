# eko-sdk-node

Node.js SDK for [Eko APIs](https://developers.eko.in)

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
})
```

## Resources

- [Eko Developers Community](https://github.com/ekoindia/eko-dev-community)
- [Discord](http://dsc.gg/ekodevs)
- [YouTube](https://www.youtube.com/@ekodevelopers)
