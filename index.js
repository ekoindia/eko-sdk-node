const kyc = require('./kyc');
const billPayments = require('./billPayments');

// Make sure to set these values via Eko.init(ekoApiConfigOptions) else default values will be used
let EKO_API_CONFIGS = {
    hostname: "staging.eko.in",
    port: 8080,
    allowInsecureRequest: false,
    developerKey: "becbbce45f79c6f5109f848acd540567",
    authKey: "d2fe1d99-6298-4af2-8cc5-d97dcf46df30",
    // initiatorId: "9971771929",
    partnerUserCode: "20810200", //unique Eko code provided for your org
    initiatorId: "9962981729"
}

/**
 * The main object exposed to the sdk user
 */
const Eko = {
    init: init,
    verifyPAN: verifyPAN,
    verifyBankAccount: verifyBankAccount,
    isPANServiceActive: isPANServiceActive,
    billPayments: {
        getOperators: function(options, cb){
            billPayments.getOperators(EKO_API_CONFIGS, options, function(err, operatorList){
                return cb(err, operatorList);
            })
        },
        getOperatorCategories: function(options, cb){
            billPayments.getOperatorCategories(EKO_API_CONFIGS, options, function(err, operatorCategoryList){
                return cb(err, operatorCategoryList);
            })
        },
        getOperatorLocations: function(options, cb){
            billPayments.getOperatorLocations(EKO_API_CONFIGS, options, function(err, operatorLocationList){
                return cb(err, operatorLocationList);
            })
        },
        getOperatorParameters: function(options, cb){
            billPayments.getOperatorParameters(EKO_API_CONFIGS, options, function(err, operatorParametersList){
                return cb(err, operatorParametersList);
            })
        },
        getBill: function(options, cb){
            billPayments.getBill(EKO_API_CONFIGS, options, function(err, billInfo){
                return cb(err, billInfo);
            })
        },
        payBill: function(options, cb){
            billPayments.payBill(EKO_API_CONFIGS, options, function(err, paymentReceipt){
                return cb(err, paymentReceipt);
            })
        }
    }
}

/**
 * Initializes the api configurations and makes them immutable
 * @param {Object} configs { host, port, developerKey, authKey, initiatorId, userCode }
 * @returns {Object} main Eko object
 */
function init(configs){
    if(!configs){
        console.log("No Eko api configurations provided. Going to use the default ones for testing.")
    } else {
        for(let key in configs){
            Object.defineProperty(EKO_API_CONFIGS, key, {
                value: configs[key],
                writable: false
            })
        }
    }
    console.debug("EKO API configs: ", JSON.stringify(EKO_API_CONFIGS, null, 4))
    isPANServiceActive(function(err, isActive){
        if(isActive){
            console.log("✔ PAN API service is activated already for user_code:"+ EKO_API_CONFIGS.partnerUserCode)
            return;
        }
        kyc.activatePANApi(EKO_API_CONFIGS, function(err, result){
            if(err){
                console.log("Failed to activate PAN API service for user_code:"+ EKO_API_CONFIGS.partnerUserCode)
                console.debug(err)
                // throw new Error("Error in enabling PAN verification API"); 
            }
        });
    })
    billPayments.isBBPSServiceActive(EKO_API_CONFIGS, function(err, isActive){
        if(isActive){
            console.log("✔ BBPS API service is activated already for user_code:"+ EKO_API_CONFIGS.partnerUserCode)
            return;
        }
        billPayments.activateBBPSApi(EKO_API_CONFIGS, function(err, result){
            if(err){
                console.log("Failed to activate BBPS API service for user_code:"+ EKO_API_CONFIGS.partnerUserCode)
                console.debug(err)
                // throw new Error("Error in enabling PAN verification API"); 
            }
        });
    })
    return Eko;
}

/**
 * Verify PAN details
 * @param {Object} options { panNumber: number, purpose: string, purposeDescription: string }
 * @param {Error} cb.err - An error object, if an error occurred. { statusCode, statusMessage }
 * @param {Object} cb.data - { "pan_number", "title", "first_name", "middle_name", "last_name" }
 */
function verifyPAN(options, cb){
    kyc.verifyPAN(EKO_API_CONFIGS, options, function(err, result){
        return cb(err, result)
    });
}

/**
 * Verify Bank account details
 * @param {Object} options { accountNo, ifsc or bankCode, customerId, userCode }
 * @param {function} cb - A callback function to handle the response from the server.
 * @param {Error} cb.err - An error object, if an error occurred. { statusCode, statusMessage }
 * @param {Object} cb.data - { "amount", "fee","verification_failure_refund", "is_Ifsc_required", "tid", "client_ref_id", "bank", "is_name_editable", "user_code", "aadhar", "recipient_name", "ifsc", "account" }
 */
function verifyBankAccount(options, cb){
    kyc.verifyBankAccount(EKO_API_CONFIGS, options, function(err, result){
        return cb(err, result)
    });
}

/**
 * @param {*} cb fn(err, isActive)
 */
function isPANServiceActive(cb){
    kyc.isPANServiceActive(EKO_API_CONFIGS, function(err, isActive){
        return cb(err, isActive)
    });
}

module.exports = Eko;