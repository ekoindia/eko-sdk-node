/**
 * Common operations related to network requests
 */
exports.send = send;

const auth = require('./auth');
const https = require('https');

function send(apiConfigs, reqOptions, data, cb){
    let defaultRequestOptions = createDefaultRequestOptions(apiConfigs);
    //Override default request options if needed
    let finalRequestOptions = Object.assign(defaultRequestOptions, reqOptions);
    console.debug("Request OPTIONS: ")
    console.debug(JSON.stringify(finalRequestOptions));
    const req = https.request(finalRequestOptions, (res) => {
        res.setEncoding('utf8');
        console.debug('Response STATUS: ' + res.statusCode);
        console.debug('Response HEADERS: ' + JSON.stringify(res.headers));
        let result = '';
        res.on('data', chunk => {
            result = result + chunk;
        });
        res.on('end', () => {
            console.debug('Response RESULT: ');
            console.debug(result)
            try{
                const finalResult = JSON.parse(result);
                cb(null, finalResult);
            } catch(err){
                cb(err, null);
            }
        });
    });
    if(data){
        console.debug("Posting data: ");
        console.debug(JSON.stringify(data));
        let encodedData = "";
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                if (encodedData !== "") encodedData += "&";
                encodedData += encodeURIComponent(key) + "=" + encodeURIComponent(data[key]);
            }
        }
        console.debug("Encoded data for : ");
        console.debug(encodedData);
        req.write(encodedData);
    }
    req.end();
    req.on('error', (error) => {
        console.error(error);
        cb(error, null);
    });
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
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
}