/*
 * AWS Sdk KMS spike: (assuming node v6.6+)
 * 1 - Create master key at KMS
 * 2 - Copy alias or ARN
 * 3 - run this i.e.
 * $ node spike.js KEY_ALIAS YOUR_PLAINTEXT_TO_ENCRYPT
 */
const AWS = require('aws-sdk');

// aws-sdk is not reading my region info so i'll have to set it here
// maybe you have it working properly
// aws-sdk reads in your aws credentials from ~/.aws/credentials
AWS.config.update({ region:'us-east-1' });

const kms = new AWS.KMS();

// your input args
const KeyId = "this u cant have bro";

// http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/KMS.html#encrypt-property
// @params KeyId String
// @params Plaintext String | Buffer
// @params EncryptionContext object (optional) http://docs.aws.amazon.com/kms/latest/developerguide/encryption-context.html
// @params GrantTokens [Strings] (optional) http://docs.aws.amazon.com/kms/latest/developerguide/concepts.html#grant
const params = {
	KeyId: KeyId, // your key alias or full ARN key
	 Plaintext: "secret", // your super secret.
};

module.exports = {
    executeEncrypt: () => {
        kms.encrypt(params).promise().then(data => {
            const base64EncryptedString = data.CiphertextBlob.toString('base64');
            console.log('base64 encrypted string: ' + base64EncryptedString+ 'FIMFIMFIM');
            return base64EncryptedString;
        })
        .then(base64EncryptedString => {
            // http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/KMS.html#decrypt-property
            // @params KeyId String
            // @params CiphertextBlob Buffer(base64)
            // @params EncryptionContext object (optional) http://docs.aws.amazon.com/kms/latest/developerguide/encryption-context.html
            // @params GrantTokens [Strings] (optional) http://docs.aws.amazon.com/kms/latest/developerguide/concepts.html#grant
            return kms.decrypt({
                CiphertextBlob: Buffer(base64EncryptedString, 'base64')
            }).promise();
        })
        .then(data => {
            console.log('Your super secret is: ' + data.Plaintext.toString('ascii'));
            // do something with it
        })
        .catch(err => console.log(err, err.stack));
    }
}
