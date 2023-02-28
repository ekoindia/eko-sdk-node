/**
 * Bill payments related APIs
 */
exports.getOperators = getOperators;
exports.getOperatorCategories = getOperatorCategories;
exports.getOperatorLocations = getOperatorLocations;

const network = require('./network');


/**
 * Get list of utility bill operators
 * @param {Object} apiConfigs An object containing the API configuration details.
 * @param {Object} options { category: categoryId, location:locationId  }
 * @param {function} cb A callback function to handle the response from the server
 * @param {Error} cb.err - An error object, if an error occurred.
 * @param {Object} cb.operatorsList - The JSON response from the server
 *  [
        {
            "operator_id": 28,
            "name": "Mahanagar Gas",
            "billFetchResponse": 0,
            "high_commission_channel": 1,
            "kyc_required": 0,
            "operator_category": 2,
            "location_id": 27
        },
    ]
 */
function getOperators(apiConfigs, options, cb) {
    const data = {}
    if(options.location){
        data['location'] = options.location;
    }
    if(options.category){
        data['category'] = options.category;
    }
    const queryString = network.transformObjectToQueryParams(data)
    network.send(Object.assign(apiConfigs, { contentType: 'application/json' }), {
        path: '/ekoapi/v2/billpayments/operators'+(queryString ? '?'+queryString : ''),
        method: 'GET'
    }, null, function(err, resultJson){
        /**
         * On success i.e. 200 status
         * {
            "data": [
                {
                    "operator_id": 28,
                    "name": "Mahanagar Gas",
                    "billFetchResponse": 0,
                    "high_commission_channel": 1,
                    "kyc_required": 0,
                    "operator_category": 2,
                    "location_id": 27
                },
                {
                    "operator_id": 50,
                    "name": "Gujarat Gas Limited",
                    "billFetchResponse": 0,
                    "high_commission_channel": 1,
                    "kyc_required": 0,
                    "operator_category": 2,
                    "location_id": 24
                }
              ]
            }
         */
        cb(err, resultJson ? resultJson.data : null);
    })
}


/**
 * Get the list of operators' category id and their category names
 * @param {Object} apiConfigs An object containing the API configuration details.
 * @param {Object} options { status: 'active', operator: operatorId } //Not yet supported
 * @param {function} cb A callback function to handle the response from the server
 * @param {Error} cb.err - An error object, if an error occurred.
 * @param {Object} cb.operatorCategoryList - The JSON response from the server
 *  [
        {
            "operator_category_name": "Broadband Postpaid",
            "operator_category_id": 1,
            "operator_category_group": "0",
            "status": "1"
        },
    ]
 */
function getOperatorCategories(apiConfigs, options, cb) {
    network.send(Object.assign(apiConfigs, { contentType: 'application/json' }), {
        path: '/ekoapi/v2/billpayments/operators_category',
        method: 'GET'
    }, null, function(err, resultJson){
        /**
         * On success i.e. 200 status
         * {
            "data": [
                {
                    "operator_category_name": "Broadband Postpaid",
                    "operator_category_id": 1,
                    "operator_category_group": "0",
                    "status": "1"
                },
            ]
            }
         */
        cb(err, resultJson ? resultJson.data : null);
    })
}

 /**
 * Get the list of operators' location id and their location (geographic state) name
 * @param {Object} apiConfigs An object containing the API configuration details.
 * @param {Object} options { status: 'active', operator: operatorId } //Not yet supported
 * @param {function} cb A callback function to handle the response from the server
 * @param {Error} cb.err - An error object, if an error occurred.
 * @param {Object} cb.operatorLocationList - The JSON response from the server
 *  [
        {
            "operator_location_name": "Andaman & Nicobar Islands",
            "operator_location_id": "35",
            "abbreviation": "AN"
        },
    ]
 */
function getOperatorLocations(apiConfigs, options, cb) {
    network.send(Object.assign(apiConfigs, { contentType: 'application/json' }), {
        path: '/ekoapi/v2/billpayments/operators_location',
        method: 'GET'
    }, null, function(err, resultJson){
        /**
         * On success i.e. 200 status
         * {
            "data": [
                {
                    "operator_location_name": "Andaman & Nicobar Islands",
                    "operator_location_id": "35",
                    "abbreviation": "AN"
                },
            ]
            }
         */
        cb(err, resultJson ? resultJson.data : null);
    })
}