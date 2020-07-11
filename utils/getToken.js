export default async function getToken() {
  let promise = new Promise(function (resolve, reject) {
    chrome.storage.sync.get("markUp", function (token) {
      console.log("promised token: ", token);
      resolve(token);
    });
  });
  const fulfilledPromise = await promise;
  const token = fulfilledPromise.markUp;
  console.log("getToken: ", token);
  console.log("promise: ", promise);
  return token;
}
