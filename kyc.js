/**
 * KYC related APIs
 */
exports.activatePANApi = activatePANApi;
exports.verifyPAN = verifyPAN;
exports.verifyBankAccount = verifyBankAccount;

const network = require('./network');

/**
 * @param {Object} apiConfigs 
 * @param {*} cb 
 */
function activatePANApi(apiConfigs, cb) {
    const data = Object.assign({
        service_code: 4,
        initiator_id: apiConfigs.initiatorId,
        user_code: apiConfigs.userCode
    });
    network.send(apiConfigs, {
        path: '/ekoapi/v1/user/service/activate',
        method: 'PUT'
    }, data, function(err, resultJson){
        cb(err, resultJson);
    })
}

/**
 * Verifies a PAN (Permanent Account Number) using the specified API configuration and options.
 * @param {Object} apiConfigs An object containing the API configuration details.
 * @param {Object} options { panNumber: number, purpose: string, purposeDescription: string }
 * @param {function} cb A callback function to handle the response from the server
 */
function verifyPAN(apiConfigs, options, cb) {
    const data = Object.assign({
        initiator_id: apiConfigs.initiatorId
    });
    data['pan_number'] = options.panNumber;
    data['purpose'] = options.purpose;
    data['purpose_desc'] = options.purposeDescription;
    network.send(apiConfigs, {
        path: '/ekoapi/v1/pan/verify',
        method: 'POST'
    }, data, function(err, resultJson){
        cb(err, resultJson);
    })
}


/**
 * Verifies a bank account using the specified API configuration and options.
 *
 * @param {Object} apiConfigs - An object containing the API configuration details.
 * @param {Object} options - An object containing the options for the request.
 * @param {string} options.accountNo - The account number of the bank account.
 * @param {string} options.ifsc - The IFSC (Indian Financial System Code) of the bank.
 * @param {string} [options.bankCode] - The bank code. If ifsc is not provided, the bankCode must be provided.
 * @param {string} options.customerId - The customer ID associated with the bank account.
 * @param {string} options.userCode - User code value of the retailer from whom the request is coming.
 * @param {function} cb - A callback function to handle the response from the server.
 * @param {Error} cb.err - An error object, if an error occurred.
 * @param {Object} cb.resultJson - The JSON response from the server.
 */
function verifyBankAccount(apiConfigs, options, cb){
    if(!options || (!options.ifsc && !options.bankCode)){
        return cb({ errorMessage: 'Must provide either IFSC or Bank Code', errorCode: 'VALIDATION_ERROR' })
    }
    if(!options.accountNo){
        return cb({ errorMessage: 'Must provide account number that needs to be verified', errorCode: 'VALIDATION_ERROR' })
    }
    const data = Object.assign({
        initiator_id: apiConfigs.initiatorId
    });
    data['customer_id'] = options.customerId;
    // data['client_ref_id'] = options.clientReferenceId;
    data['user_code'] = options.userCode;
    network.send(apiConfigs, {
        path: '/ekoapi/v2/banks/'+(options.ifsc ? 'ifsc:'+options.ifsc : 'bank_code:'+ options.bankCode) +'/accounts/'+options.accountNo,
        method: 'POST'
    }, data, function(err, resultJson){
        cb(err, resultJson);
    });
}