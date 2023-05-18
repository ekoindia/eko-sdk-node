/**
 * Authenticating APIs
 */
exports.getAuthKeys = getAuthKeys;
exports.getRequestHash = getRequestHash;

const crypto = require('crypto');

/**
 * Mask and generate dynamic auth keys
 * @param {string} staticAuthKey Auth key provided by Eko
 * @returns {Object} { secretKey, secretKeyTimestamp }
 */
function getAuthKeys(staticAuthKey) {
    // Encode authentication key using base64
    const encodedKey = Buffer.from(staticAuthKey).toString('base64');
    const secretKeyTimestamp = getSecretKeyTimestamp();
    // Computes the signature by hashing the salt with the encoded key 
    const secretKey = crypto.createHmac('SHA256', encodedKey).update(secretKeyTimestamp).digest('base64');
    return { secretKey: secretKey, secretKeyTimestamp: secretKeyTimestamp };
}

function getSecretKeyTimestamp() {
    // Get current timestamp in milliseconds since UNIX epoch as STRING
    // Check out https://currentmillis.com to understand the timestamp format
    let timestamp = Math.round(Date.now()).toString();
    return timestamp;
}

/**
 * Creates request_hash, a header needed to authorize some requests
 * @param {string} staticAuthKey Auth key provided by Eko
 * @param {string} secretKeyTimestamp request time in unix
 * @param {string} requestHashSuffix identifier for request that is concatenated to secret_key_timestamp to generate request_hash e.g. for bill payment transaction it is `utility_acc_no + amount + user_code`; for AePS, it is `aadhaar + amount + user_code`
 * @returns {string} requestHash a hashed and base64 encoded output of `secretKeyTimestamp + requestHashSuffix`
 */
function getRequestHash(staticAuthKey, secretKeyTimestamp, requestHashSuffix){
    const encodedKey = Buffer.from(staticAuthKey).toString('base64');
    const data = secretKeyTimestamp + requestHashSuffix;
    const signatureReqHash = crypto.createHmac('SHA256', encodedKey).update(data).digest();
    // Again encode the result using the base64.
    const requestHash = Buffer.from(signatureReqHash).toString('base64');
    return requestHash;
}