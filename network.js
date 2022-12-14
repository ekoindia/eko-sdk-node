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
    const req = https.request(finalRequestOptions, (res) => {
        console.log(`statusCode: ${res.statusCode}`);
        let result = [];
        res.on('data', chunk => {
            result.push(chunk);
        });
        res.on('end', () => {
            console.log('Response ended: ');
            const finalResult = JSON.parse(Buffer.concat(result).toString());
            cb(null, finalResult);
        });
    });
    if(data){
        req.write(JSON.stringify(data));
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
        port: apiConfigs.port,
        headers: {
            'developer_key': apiConfigs.developerKey,
            'secret-key': authKeys.secretKey,
            'secret-key-timestamp': authKeys.secretKeyTimestamp
        }
    };
}