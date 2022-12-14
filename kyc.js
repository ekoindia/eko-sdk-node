/**
 * KYC related APIs
 */
exports.activatePANApi = activatePANApi;
exports.verifyPAN = verifyPAN;

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
 * @param {Object} apiConfigs 
 * @param {Object} options { panNumber: number, purpose: string, purposeDescription: string }
 * @param {*} cb 
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
