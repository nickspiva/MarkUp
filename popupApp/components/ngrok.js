const ngrokUrl =
  process.env.NODE_ENV === "production"
    ? "https://markup-extension.herokuapp.com/"
    : `https://d735b5635bef.ngrok.io/`;

// const herokuUrl = "https://d735b5635bef.ngrok.io/";
// const ngrokUrl = "https://markup-extension.herokuapp.com/";

module.exports = ngrokUrl;
