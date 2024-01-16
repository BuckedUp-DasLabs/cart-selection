import fetchProduct from "./modules/handleProduct/fetchProduct.js";
import toggleLoading from "./modules/toggleLoading.js";
import { dataLayerStart } from "./modules/dataLayer.js";
import { toggleCart, createCart } from "./modules/handleCart.js";

const buyButton = [];
buyButtonsIds.forEach((id) => {
  buyButton.push(document.querySelector(id))
});

const main = async () => {
  toggleLoading();
  const data = await fetchProduct({ ids: productsID });
  dataLayerStart(data);
  const noStock = (el) =>{
    return !el.availableForSale;
  } 
  if (data.some(noStock)) {
    alert("Product not found.");
    window.location.href = "https://buckedup.com";
    return;
  }
  const cartWrapper = createCart(data);
  buyButton.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!btn.hasAttribute("disabled")) {
        toggleCart(cartWrapper);
      }
    });
  });
  toggleLoading();
}

main();
