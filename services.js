/**
 * API services status and activation related code
 */
exports.getServiceStatus = getServiceStatus;
exports.SERVICE_CODES = {
    PAN: 4
}

const network = require('./network');

/**
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
         * 
            {
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
         */
        cb(err, resultJson ? resultJson.data : null);
    })
}