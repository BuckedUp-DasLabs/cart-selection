# Scripts for handling shopify api calls with cart

## How to put into instapage

### 1. Place this code into html/css head, change primary and secondary as needed.

```
<style>
  :root{
    --primary: #0038FF;
    --secondary: #E3F5FF;
    --text-color: black;
  }
</style>
<script>
  const getCdnStyle = () =>{
    const cdnStyle = document.createElement("link");
    cdnStyle.rel = "stylesheet";
    const currentTime = Math.floor(+new Date() / (60 * 60 * 1000))
    cdnStyle.href = `https://cdn.jsdelivr.net/gh/BuckedUp-DasLabs/cart-selection@latest/src/scss/style.css?t=${currentTime}`
    document.head.appendChild(cdnStyle)
  }
  getCdnStyle();
</script>
```

### 2. Place this code and change as necessary into html/css footer

```
<script>
  const step_count = "";
  const page_id = "";
  const version_id = "";
  const urlParamsCookies = ["click_id", "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];

  const hasQtty = false;

  const productsID = [999,999];
  const orderBumpIds = { 999: { price: 4.99, discountCode: "test1" } };
  const buyButtonsIds = ["#element-"];
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
  const getCdnScript = () =>{
    const cdnScript = document.createElement("script");
    cdnScript.type = "module";
    const currentTime = Math.floor(+new Date() / (60 * 60 * 1000))
    cdnScript.src = `https://cdn.jsdelivr.net/gh/BuckedUp-DasLabs/cart-selection@latest/src/js/scripts.js?t=${currentTime}`
    document.body.appendChild(cdnScript)
  }
  getCdnScript();
</script>
```

You can add more than one discountCode by using "-".
ex: "code1-code2"

You can specify the variants you want from a product (or variant) by typing "id-variantId", and if every variant should go to the checkout using "whole"
ex:

```
const productsID = ["999-877","999-877-858",""999-whole-877-858""];
```

## How to compile scss

### either install the compiler from the sass website, or install the vscode extension live sass compiler.
