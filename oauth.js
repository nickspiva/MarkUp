window.onload = function () {
  document.querySelector("button").addEventListener("click", function () {
    console.log("clicked");
    chrome.identity.getAuthToken({ interactive: true }, function (token) {
      console.log("getting token");
      console.log(token);
      let init = {
        method: "GET",
        async: true,
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        contentType: "json",
      };
      fetch(
        "https://people.googleapis.com/v1/contactGroups/all?maxMembers=20&key=AIzaSyCbCu5mdYZoZaLFaZHjxu6m1Oa77-vBo0Q",
        init
      )
        .then((response) => response.json())
        .then(function (data) {
          console.log("data: ", data);
        });
      // .then(function (data) {
      //   let photoDiv = document.querySelector("#friendDiv");
      //   let returnedContacts = data.memberResourceNames;
      //   for (let i = 0; i < returnedContacts.length; i++) {
      //     fetch(
      //       "https://people.googleapis.com/v1/" +
      //         returnedContacts[i] +
      //         "?personFields=photos&key=AIzaSyCbCu5mdYZoZaLFaZHjxu6m1Oa77-vBo0Q",
      //       init
      //     )
      //       .then((response) => response.json())
      //       .then(function (data) {
      //         let profileImg = document.createElement("img");
      //         profileImg.src = data.photos[0].url;
      //         photoDiv.appendChild(profileImg);
      //       });
      //   }
      // });
    });
  });
};
