/**
 * Common operations related to network requests
 */
exports.send = send;
exports.transformObjectToQueryParams = transformObjectToQueryParams;

const auth = require('./auth');
const https = require('https');

function send(apiConfigs, reqOptions, data, cb){
    let defaultRequestOptions = createDefaultRequestOptions(apiConfigs);
    //Override default request options if needed
    let finalRequestOptions = Object.assign(defaultRequestOptions, reqOptions);
    console.debug("Request OPTIONS: ");
    console.debug(JSON.stringify(finalRequestOptions, null, 4));
    const req = https.request(finalRequestOptions, (res) => {
        res.setEncoding('utf8');
        console.debug('Response STATUS: ' + res.statusCode);
        console.debug('Response HEADERS: ' + JSON.stringify(res.headers, null, 4));
        let result = '';
        res.on('data', chunk => {
            result = result + chunk;
        });
        res.on('end', () => {
            console.debug('STATUS: '+res.statusCode);
            console.debug('Response RESULT: ');
            console.debug(result);
            try {
                if(res.statusCode === 200){
                    const finalResult = JSON.parse(result);
                    cb(null, finalResult);
                } else {
                    cb({ statusCode: res.statusCode, statusMessage: result }, null)
                }
            } catch(err){
                cb(err, null);
            }
        });
    });
    if(data){
        console.debug("Posting data: ");
        console.debug(JSON.stringify(data, null, 4));
        if(finalRequestOptions.headers['Content-Type'] && finalRequestOptions.headers['Content-Type']=="application/x-www-form-urlencoded"){
            let encodedData = transformObjectToQueryParams(data);
            console.debug("Encoded data for : ");
            console.debug(encodedData);
            req.write(encodedData);
        } else {
            req.write(JSON.stringify(data));
        }
    }
    req.end();
    req.on('error', (error) => {
        console.error(error);
        cb(error, null);
    });
}

/**
 * Converts an object into query params that are safe for URI
 * @param {Object} data - the object that needs to be converted
 * @returns {String} query string
 * @example
 * 
 * // Returns key1=value1&key2=value2
 * transformObjectToQueryParams({ key1:value1, key2:value2 })
 */
function transformObjectToQueryParams(data) {
    let encodedData = "";
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            if (encodedData !== "")
                encodedData += "&";
            encodedData += encodeURIComponent(key) + "=" + encodeURIComponent(data[key]);
        }
    }
    return encodedData;
}

/**
 * Creates a basic request options structure required in all requests
 * @param {Object} apiConfigs { developerKey: string, authKey: string }
 */
function createDefaultRequestOptions(apiConfigs){
    let authKeys = auth.getAuthKeys(apiConfigs.authKey);
    return {
        hostname: apiConfigs.hostname,
        port: apiConfigs.port || 443,
        headers: {
            'developer_key': apiConfigs.developerKey,
            'secret-key': authKeys.secretKey,
            'secret-key-timestamp': authKeys.secretKeyTimestamp,
            'Content-Type': apiConfigs.contentType ? apiConfigs.contentType : 'application/x-www-form-urlencoded'
        }
    };
}