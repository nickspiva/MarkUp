/*
 * Gets the jwt token from chrome storage.
 * @return {String}  jwt token.
 */

export default async function getToken() {
  let promise = new Promise(function (resolve, reject) {
    chrome.storage.sync.get("markUp", function (token) {
      resolve(token);
    });
  });
  const fulfilledPromise = await promise;
  const token = fulfilledPromise.markUp;
  return token;
}
