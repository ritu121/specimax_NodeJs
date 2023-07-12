const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotallySecretKey');//Using AES encryption

//Encrypting text
async function encrypt(text) {
  return await cryptr.encrypt(text)
}

// Decrypting text
async function decrypt(encryptedString) {
  return await cryptr.decrypt(encryptedString);
}

module.exports = {
  encrypt,
  decrypt
}