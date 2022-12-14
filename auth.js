/**
 * Authenticating APIs
 */
exports.getAuthKeys = getAuthKeys;

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
    return Math.round(Date.now()).toString();
}