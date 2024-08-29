import CryptoJS from 'crypto-js';
import forge from 'node-forge';
import { getEncryptionDetailsThunk } from '../axios/apiService/encryption.apiService';
import { GET_CHAT_ENCRYPT_DETAILS } from '../urls/ApiUrls';
import { ENCRYPTION_AES_ENC_KEY_OPTIONS } from './Constants';
import jsUtils from './jsUtility';

/** @module encryption * */
/**
 * @memberof encryption
 */
/**
 * @function generateAesKey
 * @description To generate aes key
 * @return  {string} aes key
 */
export const generateAesKey = () => {
  const aesSalt = forge.random.getBytesSync(16);
  const keyPassPhrase = forge.random.getBytesSync(16);
  const aesKey = forge.pkcs5.pbkdf2(
    keyPassPhrase,
    aesSalt,
    ENCRYPTION_AES_ENC_KEY_OPTIONS.iterations,
    ENCRYPTION_AES_ENC_KEY_OPTIONS.keySize,
  );
  return aesKey;
};

/**
 * @memberof encryption
 */
/**
 * @function encryptAesKey
 * @param {string} publicKey public key sent from the server
 * @param {string} aesKey generated aes key
 * @description To encrypt aes key using RSA public key
 * @return  {string} encrypted aes key
 */
export const encryptAesKey = (receivedpublicKeyPem, aesKey) => {
  try {
    const publicKey = forge.pki.publicKeyFromPem(receivedpublicKeyPem);
    const encryptedAesKey = publicKey.encrypt(aesKey, 'RSA-OAEP');
    return forge.util.encode64(encryptedAesKey);
  } catch (error) {
    console.error('Encryption error:', error);
    throw error; // You may want to handle the error accordingly
  }
};
/**
 * @memberof encryption
 */
/**
 * @function enryptAesEncryptionData
 * @param {string} data raw request json
 * @param {string} aesKey generated aes key
 * @description To encrypt request data using encrypted aes key and send to server
 * @return  {Object} encrypted request data
 */
export const enryptAesEncryptionData = (data, aesKey) => {
  const responseJsonString = JSON.stringify(data);
  const encryptedData = CryptoJS.AES.encrypt(responseJsonString, aesKey);
  const encryptedDataString = encryptedData.toString();
  console.log('encryptedData ml', encryptedDataString, aesKey);
  return encryptedDataString;
};
/**
 * @memberof encryption
 */
/**
 * @function decryptAesEncryptionData
 * @param {string} data encrypted response from server
 * @param {string} aesKey generated aes key
 * @description To decrypt the encrypted response sent from server
 * @return  {Object} response data
 */
export const decryptAesEncryptionData = (data, aesKey) => {
  const decryptedData = CryptoJS.AES.decrypt(data, aesKey);
  const dataJsonString = decryptedData.toString(CryptoJS.enc.Utf8);
  const dataJson = JSON.parse(dataJsonString);

  return dataJson;
};
/**
 * @memberof encryption
 */
/**
 * @function getChatCredentialAndQueryVariables
 * @param {Object} chatEncryptionDetails chat encryption details
 * @param {string} query
 * @param {Object} variables
 * @description Get chat credential and query variables
 * @return  {Object}
 */
export const getChatCredentialAndQueryVariables = (
  chatEncryptionDetails,
  query,
  variables,
) => {
  if (!jsUtils.isEmpty(chatEncryptionDetails)) {
    return {
      credentials: {
        session_id: chatEncryptionDetails.session_id,
        aes_enc_key: chatEncryptionDetails.aes_enc_key,
      },
      encryptQuery: enryptAesEncryptionData(
        query,
        chatEncryptionDetails.aes_key,
      ),
      encryptVariable: enryptAesEncryptionData(
        variables,
        chatEncryptionDetails.aes_key,
      ),
    };
  }
  return {};
};
/**
 * @memberof encryption
 */
/**
 * @function getChatCredentialWithEncryptQueryVariables
 * @param {Object} chatEncryptionDetails chat encryption details
 * @param {string} query
 * @param {Object} variables
 * @description Get encrypted chat credential and query variables
 * @return  {Object}
 */
export const getChatCredentialWithEncryptQueryVariables = async (
  query,
  variables,
) => {
  const localChatEncryptionDetails = JSON.parse(
    localStorage.getItem('chat_service_encryption_details'),
  );
  if (
    localChatEncryptionDetails &&
    localChatEncryptionDetails.session_id &&
    localChatEncryptionDetails.public_key &&
    localChatEncryptionDetails.aes_key &&
    localChatEncryptionDetails.aes_enc_key
  ) {
    return getChatCredentialAndQueryVariables(
      localChatEncryptionDetails,
      query,
      variables,
    );
  }
  const thunkChatEncryptionDetails = await getEncryptionDetailsThunk(
    GET_CHAT_ENCRYPT_DETAILS,
  );
  return getChatCredentialAndQueryVariables(
    thunkChatEncryptionDetails,
    query,
    variables,
  );
};
/**
 * @memberof encryption
 */
/**
 * @function getChatDecryptionResponseData
 * @param {Object} responseData descrypted server response
 * @description decrypt chat response from server
 * @return  {Object}
 */
export const getChatDecryptionResponseData = (responseData) => {
  const localChatEncryptionDetails = JSON.parse(
    localStorage.getItem('chat_service_encryption_details'),
  );
  if (localChatEncryptionDetails) {
    const clonedResponseData = jsUtils.cloneDeep(responseData);
    return decryptAesEncryptionData(
      clonedResponseData,
      localChatEncryptionDetails.aes_key,
    );
  }
  return responseData;
};
