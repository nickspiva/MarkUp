export default async function getUser() {
  let promise = new Promise(function (resolve, reject) {
    chrome.storage.sync.get("user", function (user) {
      resolve(user);
    });
  });
  const { user } = await promise;
  console.log("get background user: ", user);
  return user;
}
