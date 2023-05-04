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
 * @param {Object} apiConfigs 
 * @param {Object} options
 * @param {*} cb 
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
 * @param {Object} apiConfigs 
 * @param {Object} options { service: 'pan', latlong: '25.309580,83.005692', ...apiConfigs overrides }
 * @param {*} cb 
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
        cb(err, resultJson ? resultJson.data : null);
    })
}