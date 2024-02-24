const step_count = "";
const page_id = "";
const version_id = "";
const urlParamsCookies = ["click_id", "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];

const hasQtty = false;

const productsID = [9037941342514, "8820417003826-oneCard", 8858111377714, 8768929825074];
const orderBumpIds = { 8820417003826: { title: "Test", price: 10.99, hasQtty: 5 } };
const buyButtonsIds = [
  { id: "#BTN-1", products: '{"8820417003826": {"quantity": 1},"8858111377714": {"quantity": 1}}', discountCode: "1boost" },
  { id: "#BTN-2", products: '{"8820417003826": {"quantity": 2},"8858111377714": {"quantity": 1}}', discountCode: "2boost" },
  { id: "#BTN-3", products: '{"9037941342514": {"quantity": 1}, "8820417003826": {"quantity": 4},"8858111377714": {"quantity": 1}, "8768929825074": {"quantity": 1}}', discountCode: "4boost" },
];
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
