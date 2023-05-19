/**
 * KYC related APIs
 */
exports.activatePANApi = activatePANApi;
exports.verifyPAN = verifyPAN;
exports.verifyBankAccount = verifyBankAccount;
exports.isPANServiceActive = isPANServiceActive;

const network = require('./network');
const services = require('./services');

/**
 * @param {Object} apiConfigs 
 * @param {*} cb fn(err, isActive)
 */
function isPANServiceActive(apiConfigs, cb) {
    services.getServiceStatus(apiConfigs, null, function(err, statusReponse){
        if(statusReponse && statusReponse.service_status_list && statusReponse.length>0){
            const statusObject = statusReponse.service_status_list.find((serviceStatusObject) => serviceStatusObject.service_code == services.SERVICE_CODES["PAN"]);
            if(statusObject && statusObject.status_desc && statusObject.status_desc.toUpperCase()=="ACTIVATED"){
                return cb(null, true)
            }
        }
        return cb(null, false);
    })
}

/**
 * @param {Object} apiConfigs 
 * @param {*} cb 
 */
function activatePANApi(apiConfigs, cb) {
    services.activateUserService(apiConfigs, { service: "pan" }, function(err, resultJson){
        return cb(err, resultJson);
    })
}

/**
 * Verifies a PAN (Permanent Account Number) using the specified API configuration and options.
 * @param {Object} apiConfigs An object containing the API configuration details.
 * @param {Object} options { panNumber: number, purpose: string, purposeDescription: string }
 * @param {function} cb A callback function to handle the response from the server
 * @param {Error} cb.err - An error object, if an error occurred.
 * @param {Object} cb.data - The JSON response from the server
 *  {
        "pan_number": "...XXX",
        "last_name": "Foo",
        "middle_name": "",
        "title": "Shri",
        "first_name": "Bar"
    }
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
        /**
         * On success i.e. 200 status
         * {
                "response_status_id": -1,
                "data": {
                    "pan_number": "...XXX",
                    "last_name": "Foo",
                    "middle_name": "",
                    "title": "Shri",
                    "first_name": "Bar"
                },
                "response_type_id": 1255,
                "message": "PAN verification successful",
                "status": 0
            }
         */
        cb(err, resultJson ? resultJson.data : null);
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
 * @param {Object} cb.data - The JSON response from the server.
 *  { 
        "amount": "1.0",
        "fee": "7.00",
        "verification_failure_refund": "7.00",
        "is_Ifsc_required": "0",
        "tid": "2157012435",
        "client_ref_id": "AVS20181123194719311",
        "bank": "Kotak Mahindra Bank",
        "is_name_editable": "1",
        "user_code": "20810200",
        "aadhar": "",
        "recipient_name": "Unknown",
        "ifsc": "",
        "account": "1711654128"
    }
 * 
 */
function verifyBankAccount(apiConfigs, options, cb){
    if(!options || (!options.ifsc && !options.bankCode)){
        return cb({ errorMessage: 'Must provide either IFSC or Bank Code', errorCode: 'VALIDATION_ERROR' })
    }
    if(!options.accountNo){
        return cb({ errorMessage: 'Must provide account number that needs to be verified', errorCode: 'VALIDATION_ERROR' })
    }
    const data = Object.assign({
        initiator_id: options.initiatorId || apiConfigs.initiatorId
    });
    data['customer_id'] = options.customerId;
    // data['client_ref_id'] = options.clientReferenceId;
    data['user_code'] = options.userCode;
    network.send(apiConfigs, {
        path: '/ekoapi/v2/banks/'+(options.ifsc ? 'ifsc:'+options.ifsc : 'bank_code:'+ options.bankCode) +'/accounts/'+options.accountNo,
        method: 'POST'
    }, data, function(err, resultJson){
        /**
         * On success i.e. 200 status
         * {
            "response_status_id": -1,
            "data": {
                "amount": "1.0",
                "fee": "7.00",
                "verification_failure_refund": "7.00",
                "is_Ifsc_required": "0",
                "tid": "2157012435",
                "client_ref_id": "AVS20181123194719311",
                "bank": "Kotak Mahindra Bank",
                "is_name_editable": "1",
                "user_code": "20810200",
                "aadhar": "",
                "recipient_name": "Unknown",
                "ifsc": "",
                "account": "1711654128"
            },
            "response_type_id": 61,
            "message": "The bank did not share the recipient name this time.",
            "status": 0
            }
         */
        cb(err, resultJson ? resultJson.data : null);
    });
}