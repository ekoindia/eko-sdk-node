/**
 * API services status and activation related code
 */
exports.getServiceStatus = getServiceStatus;
exports.activateUserService = activateUserService;
const SERVICE_CODES = {
    PAN: 4,
    BBPS: 53
}
exports.SERVICE_CODES = SERVICE_CODES;

const network = require('./network');

/**
 * Get a list of services alongwith their status for a user
 * @param {Object} apiConfigs - API configuration details
 * @param {Object} options - { userCode, initiatorId }
 * @param {string} [options.userCode] - The user/merchant for whom the enquiry needs to be done
 * @param {string} [options.initiatorId] - The unique cell number with which you are onboarded on Eko's platform
 * @param {function} cb - A callback function to handle the response from the server
 * @param {Error} cb.err - An error object, if an error occurred
 * @param {Object} cb.serviceStatusInfo - Object containing status info for various services
 */
function getServiceStatus(apiConfigs, options, cb) {
    if(!apiConfigs && !options){
        return cb({ errorMessage: 'Must provide apiConfigs', errorCode: 'VALIDATION_ERROR' })
    }
    const data = Object.assign({
        user_code: (options && options.userCode) ? options.userCode : apiConfigs.partnerUserCode,
        initiator_id: (options && options.initiatorId) ? options.initiatorId : apiConfigs.initiatorId
    });
    if(!data.user_code || !data.initiator_id){
        return cb({ errorMessage: 'Must provide options {userCode, initiatorId}', errorCode: 'VALIDATION_ERROR' })
    }
    network.send(apiConfigs, {
        path: '/ekoapi/v1/user/services/user_code:'+data.user_code+'?initiator_id='+data.initiator_id,
        method: 'GET'
    }, null, function(err, resultJson){
        /**
         * Sample response
          {
            "response_status_id": 1,
            "data": {
                "user_code":"20110001",
                "initiator_id":"9962981729",
                "service_status_list":[{
                    "status":1,
                    "status_desc":"ACTIVATED",
                    "service_code":"4",
                    "comments":null,
                    "city":null,"user_name":null,"mobile":null,
                    "service_provider":null,
                    "verification_status":0,
                    "createdAt":"2019-09-05 12:50:27.0", "updatedAt":""
                    "user_code":null,
                    "state":null,
                }]
            }
          }
         */
        cb(err, resultJson ? resultJson.data : null);
    })
}


/**
 * Activate a particular service for a user e.g. pan, bbps, aeps, etc.
 * @param {Object} apiConfigs - API configuration details
 * @param {Object} options - { service: 'pan', latlong: '25.309580,83.005692', ...apiConfigs overrides }
 * @param {string} options.service - The name of the service (e.g. pan, bbps) that you want to check status for
 * @param {string} [options.latlong='77.06794760,77.06794760'] - "lattitude,longitude" of the user/merchant from whom the request is coming. To reduce the chances of fraud.
 * @param {string} [options.userCode] - The user/merchant for whom the enquiry needs to be done
 * @param {string} [options.initiatorId] - The unique cell number with which you are onboarded on Eko's platform
 * @param {function} cb - A callback function to handle the response from the server
 * @param {Error} cb.err - An error object, if an error occurred
 * @param {Object} cb.serviceActivationInfo - Service activation response data
 */
function activateUserService(apiConfigs, options, cb) {
    if(!apiConfigs && !options){
        return cb({ errorMessage: 'Must provide apiConfigs', errorCode: 'VALIDATION_ERROR' })
    }
    if(!options.service){
        return cb({ errorMessage: 'Must provide service name in options e.g. { service:"pan" } ', errorCode: 'VALIDATION_ERROR' })
    }
    const data = Object.assign({}, {
        service_code: SERVICE_CODES[options.service.toUpperCase()],
        initiator_id: (options && options.initiatorId) ? options.initiatorId : apiConfigs.initiatorId,
        user_code: (options && options.userCode) ? options.userCode : apiConfigs.partnerUserCode,
        latlong: options.latlong || '77.06794760,77.06794760'
    });
    network.send(apiConfigs, {
        path: '/ekoapi/v1/user/service/activate',
        method: 'PUT'
    }, data, function(err, resultJson){
        /**
         * {
            data: {
            "service_code": 4,
            "initiator_id": "9962981729",
            "user_code": "20810200",
            "latlong": "77.06794760,77.06794760"
            }
           }
        */
        cb(err, resultJson ? resultJson.data : null);
    })
}