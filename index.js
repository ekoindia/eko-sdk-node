const kyc = require('./kyc');

// Make sure to set these values via Eko.init(ekoApiConfigOptions) else default values will be used
let EKO_API_CONFIGS = {
    hostname: "staging.eko.in",
    port: 25004,
    developerKey: "becbbce45f79c6f5109f848acd540567",
    authKey: "f74c50a1-f705-4634-9cda-30a477df91b7",
    initiatorId: "9971771929"
}

/**
 * The main object exposed to the sdk user
 */
const Eko = {
    init: init,
    verifyPAN: verifyPAN,
    verifyBankAccount: verifyBankAccount
}

/**
 * Initializes the api configurations and makes them immutable
 * @param {Object} options { host, port, developerKey, authKey, initiatorId, userCode }
 * @returns {Object} main Eko object
 */
function init(configs){
    if(!configs){
        console.log("No Eko api configurations provided. Going to use the default ones for testing.")
    } else {
        for(config of configs){
            Object.defineProperty(EKO_API_CONFIGS, key, {
                value: options[key],
                writable: false
            })
        }
    }
    console.debug("EKO API configs: ", JSON.stringify(EKO_API_CONFIGS, null, 4))
    kyc.activatePANApi(EKO_API_CONFIGS, function(err, result){
        if(err){
            console.debug(err)
            throw new Error("Error in enabling PAN verification API");
        }
    });
    return Eko;
}

/**
 * Verify PAN details
 * @param {Object} options { panNumber: number, purpose: string, purposeDescription: string }
 */
function verifyPAN(options, cb){
    kyc.verifyPAN(EKO_API_CONFIGS, options, function(err, result){
        return cb(err, result)
    });
}

/**
 * Verify Bank account details
 * @param {Object} options { accountNo, ifsc or bankCode, customerId, userCode }
 */
function verifyBankAccount(options, cb){
    kyc.verifyBankAccount(EKO_API_CONFIGS, options, function(err, result){
        return cb(err, result)
    });
}

module.exports = Eko;