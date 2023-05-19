/**
 * Bill payments related APIs
 */
exports.isAePSServiceActive = isAePSServiceActive;
exports.activateAePSApi = activateAePSApi;
exports.pay = pay;

const network = require('./network');
const services = require('./services')


/**
 * @param {Object} apiConfigs 
 * @param {*} cb fn(err, isActive)
 */
function isAePSServiceActive(apiConfigs, cb) {
    services.getServiceStatus(apiConfigs, null, function(err, statusReponse){
        if(statusReponse && statusReponse.service_status_list && statusReponse.length>0){
            const statusObject = statusReponse.service_status_list.find((serviceStatusObject) => serviceStatusObject.service_code == services.SERVICE_CODES["BBPS"]);
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
function activateAePSApi(apiConfigs, cb) {
    services.activateUserService(apiConfigs, { service: "aeps" }, function(err, resultJson){
        return cb(err, resultJson);
    })
}

/**
 * Pay the bill
 * @param {Object} apiConfigs - An object containing the API configuration details.
 * @param {Object} options - { amount, user_code, client_ref_id, utility_acc_no, confirmation_mobile_no, sender_name, operator_id, source_ip, latlong, hc_channel  }
 * @param {string} options.user_code - User code value of the retailer from whom the request is coming
 * @param {string} options.customer_id - Value of customer's mobile number who wants the cash
 * @param {string} options.bank_code - Bank code. Find the code for your bank on docs.
 * @param {string} options.amount - For cash withdrawal pass the amount to be withdrawed and for mini statement and balance inquiry the value will be 0
 * @param {string} options.client_ref_id - Unique transaction ID which you will generate from your end for every transaction
 * @param {string} [options.pipe=0] - By default, pipe = 0
 * @param {string} [options.notify_customer=0] - Pass 1 if you want to send the SMS to the customer otherwise it will be 0
 * @param {string} options.aadhar - Encrypted value of aadhaar card number. For the encryption process please refer below.
 * @param {string} options.piddata - PID data returned in XML format of the biometric device needs to passed as string. To get device capture data in XML format, send pid format as 0 in the capture request body.
 * @param {string} [options.latlong] - latlong of the user from whom the request is coming. We are asking this details in case any fraud happens so please make sure to pass the valid location of the merchant's system. Default value comes from EKO_API_CONFIGS.
 * @param {string} [options.source_ip] - IP of the merchant who is making the request. We are asking this details in case any fraud happens so please make sure to pass the valid IP of the merchant's system. Default value comes from EKO_API_CONFIGS.
 * @param {string} options.service_type - Two Factor Registration
 * @param {number} options.service_ytype - Two Factor Authentication
 * @param {function} cb - A callback function to handle the response from the server
 * @param {Error} cb.err - An error object, if an error occurred.
 * @param {Object} cb.paymentReceipt - The data from JSON response from the server
 * {
        "tx_status": "2",
        "transaction_date": "07-07-21 13:29:35",
        "reason": "Transaction Pending",
        "amount": "100",
        "merchant_code": "",
        "shop": "Nirmal Maheshwari",
        "fee": "",
        "sender_name": "John Cena",
        "tid": "2157059989",
        "auth_code": "00",
        "shop_address_line1": "Eko India, Haryana, Gurgaonr,-122001",
        "user_code": "20810200",
        "service_tax": "0.0",
        "totalfee": "0.0",
        "merchantname": "Customer Name",
        "stan": "443434",
        "aadhar": "XXXX XXXX 9999",
        "customer_balance": "",
        "transaction_time": "07-07-21 13:29:35",
        "comment": "Transaction Pending",
        "bank_ref_num": "RRN1989123435555",
        "terminal_id": "" 
    }
 */
function pay(apiConfigs, options, cb) {
    if(!options || !options.amount || !options.customer_id || !options.user_code || !options.client_ref_id || !options.bank_code || !options.aadhar || !options.piddata || !options.service_type){
        return cb({ errorMessage: 'Missing some of the mandatory parameters among {amount, customer_id, user_code, client_ref_id, bank_code, aadhar, piddata, source_ip, latlong }', errorCode: 'VALIDATION_ERROR' }, null)
    }
    const data = Object.assign({}, options);
    if(!data.hasOwnProperty('initiator_id')) {
        if(data.hasOwnProperty('initiatorId')) {
            data['initiator_id'] = data['initiatorId'];
            delete data['initiatorId'];
        } else {
            data['initiator_id'] = apiConfigs.initiatorId;
        }
    }
    if(!data["latlong"]){
        data["latlong"] = apiConfigs.latlong;
    }
    if(!data["source_ip"]){
        data["source_ip"] = apiConfigs.sourceIP;
    }
    if(!data["notify_customer"]){
        data["notify_customer"] = 0; //Default does not sends message
    }
    if(!data["pipe"]){
        data["pipe"] = 0;
    }
    network.send(Object.assign({}, apiConfigs, { contentType: 'application/json' }), {
        path: '/ekoapi/v2/aeps',
        method: 'POST',
        requestHashSuffix: data.aadhar + data.amount + data.user_code //a request identifier string that will be needed to create request_hash
    }, data, function(err, resultJson){
        /**
         * On success i.e. 200 status
         * 
            {
                "response_status_id": 2,
                "data": {
                    "tx_status": "2",
                    "transaction_date": "07-07-21 13:29:35",
                    "reason": "Transaction Pending",
                    "amount": "100",
                    "merchant_code": "",
                    "shop": "Nirmal Maheshwari",
                    "fee": "",
                    "sender_name": "John Cena",
                    "tid": "2157059989",
                    "auth_code": "00",
                    "shop_address_line1": "Eko India, Haryana, Gurgaonr,-122001",
                    "user_code": "20810200",
                    "service_tax": "0.0",
                    "totalfee": "0.0",
                    "merchantname": "Customer Name",
                    "stan": "443434",
                    "aadhar": "XXXX XXXX 9999",
                    "customer_balance": "",
                    "transaction_time": "07-07-21 13:29:35",
                    "comment": "Transaction Pending",
                    "bank_ref_num": "RRN1989123435555",
                    "terminal_id": ""
                },
                "response_type_id": 1465,
                "message": "Transaction Pending",
                "status": 0
            }
         */
        cb(err, resultJson ? resultJson.data : null);
    })
}