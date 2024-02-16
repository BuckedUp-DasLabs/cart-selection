import fetchProduct from "./modules/handleProduct/fetchProduct.js";
import toggleLoading from "./modules/toggleLoading.js";
import { dataLayerStart } from "./modules/dataLayer.js";
import { toggleCart, createCart } from "./modules/handleCart.js";

const buyButton = [];
buyButtonsIds.forEach((id) => {
  buyButton.push(document.querySelector(id));
});

const main = async () => {
  toggleLoading();
  const [data, orderBumpData] = await Promise.all([fetchProduct({ ids: productsID }), fetchProduct({ ids: Object.keys(orderBumpIds), isOrderBump: true })]);
  dataLayerStart(data);
  const noStock = (el) => !el.availableForSale;
  if (data.some(noStock)) {
    alert("Product not found.");
    window.location.href = "https://buckedup.com";
    return;
  }
  const cartWrapper = createCart(data, orderBumpData);
  buyButton.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!btn.hasAttribute("disabled")) {
        toggleCart(cartWrapper);
      }
    });
  });
  toggleLoading();
};

main();
