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
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/BuckedUp-DasLabs/cart-selection@latest/src/scss/style.css" />
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
</script>
<script src="https://cdn.jsdelivr.net/gh/BuckedUp-DasLabs/cart-selection@latest/src/js/scripts.js" type="module"></script>
```

## How to compile scss

### either install the compiler from the sass website, or install the vscode extension live sass compiler.
