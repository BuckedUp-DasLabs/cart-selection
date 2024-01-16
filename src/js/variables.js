const storefrontAccessToken = "3f0fe03b9adb374eee07d99b57da77bd";
const fetchUrl = `https://secure.buckedup.com/api/2021-07/graphql.json`;
const apiOptions = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
  },
};

export { apiOptions, fetchUrl }