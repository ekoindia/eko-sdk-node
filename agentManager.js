/**
 * Bill payments related APIs
 */
exports.onboardAgent = onboardAgent;

const network = require('./network');


/**
 * Get list of utility bill operators
 * @param {Object} apiConfigs - An object containing the API configuration details.
 * @param {Object} options - { panNumber: "BFUPM3499K", mobile: 9123354235, firstName: "Tina", lastName: "Chawla", email: "a@gmail.com", address: { "line": "Eko India", "city": "Gurgaon", "state": "Haryana", "pincode": "122002", "district": "Banswara", "area": "Mongol" }, dob: "1992-05-10", shopName: "Akanksha Stores" }
 * @param {string} options.panNumber - PAN number
 * @param {string} options.mobile - Indian mobile no. without country code
 * @param {string} options.firstName - First name
 * @param {string} [options.middleName] - Middle name
 * @param {string} options.lastName - Last name
 * @param {string} options.email - Email
 * @param {Object} options.address - Address { "line": "Eko India", "city": "Gurgaon", "state": "Haryana", "pincode": "122002", "district": "Banswara", "area": "Mongol" }
 * @param {string} options.dob - Date of birth in YYYY-MM-DD format
 * @param {string} options.shopName - Establishmant name
 * @param {function} cb - A callback function to handle the response from the server
 * @param {Error} cb.err - An error object, if an error occurred.
 * @param {Object} cb.onboardedUserInfo - The data from JSON response from the server
 *  {
        "user_code": "20110002",
        "initiator_id": "9962981729"
    }
 */
function onboardAgent(apiConfigs, options, cb) {
    if(!options.panNumber || !options.mobile || !options.firstName || !options.email || !options.address || !options.dob || !options.shopName){
        return cb({ errorMessage: 'Must provide all mandatory inputs - panNumber, mobile, firstName, email, address, dob, shopName', errorCode: 'VALIDATION_ERROR' }, null)
    }
    const data = {};
    data["initiator_id"] = options.initiatorId || apiConfigs.initiatorId;
    data["pan_number"] = options.panNumber;
    data["mobile"] = options.mobile;
    data["first_name"] = options.firstName;
    if(options.middleName) data["middle_name"] = options.middleName;
    data["last_name"] = options.lastName;
    data["email"] = options.email;
    data["residence_address"] = options.address;
    data["dob"] = options.dob; //YYYY-MM-DD format
    data["shop_name"] = options.shopName;
    network.send(Object.assign({}, apiConfigs), {
        path: '/ekoapi/v1/user/onboard',
        method: 'PUT'
    }, data, function(err, resultJson){
        /**
         * On success i.e. 200 status
         * {
                "response_status_id": -1,
                "data": {
                    "user_code": "20110002",
                    "initiator_id": "9962981729"
                },
                "response_type_id": 1290,
                "message": "User onboarding successfull",
                "status": 0
            }
         */
        cb(err, resultJson ? resultJson.data : null);
    })
}