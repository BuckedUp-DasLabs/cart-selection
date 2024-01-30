const step_count = "";
const page_id = "";
const version_id = "";
const urlParamsCookies = ["click_id", "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];

const hasQtty = false;

const productsID = ["8685145588018-whole-46753449673010-46753449640242-46753449574706-46753449804082", 8685143195954];
const orderBumpIds = { 8858113868082: { price: 4.99, discountCode: "KSUPGRADE" } };
const buyButtonsIds = ["#element-35"];
const discountCode = "";

//stop here.
const urlParams = new URLSearchParams(window.location.search);
const origin = window.location.pathname.replace("/", "").replace("/", "");
const cookieConfig = "path=/; domain=.buckedup.com;max-age=3600";
document.cookie = `offer_id=${discountCode};${cookieConfig}`;
document.cookie = `page_id=${page_id};${cookieConfig}`;
urlParamsCookies.forEach((param) => {
  document.cookie = `${param}=${urlParams.get(param)};${cookieConfig}`;
});
localStorage.setItem("first_page", origin);
