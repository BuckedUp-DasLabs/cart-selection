import buy from "./buy.js";

const createButton = ({ productId, variantId, text, variantPrice = "", plusPrice = false }) => {
  const wrapper = document.createElement("div");
  const label = document.createElement("label");
  const labelText = document.createElement("span");
  const labelBall = document.createElement("span");
  const button = document.createElement("input");
  wrapper.appendChild(button);
  wrapper.appendChild(label);
  label.appendChild(labelBall);
  label.appendChild(labelText);
  labelBall.appendChild(document.createElement("span"));

  wrapper.classList.add("button-wrapper");
  labelText.classList.add("label-text");
  labelBall.classList.add("label-ball");
  label.setAttribute("for", `${variantId}`);
  label.setAttribute("role", "button");
  labelText.innerHTML = text;
  button.id = `${variantId}`;
  button.value = `${variantId}`;
  button.type = "radio";
  button.setAttribute("hidden", "");

  button.name = productId;
  button.setAttribute("price", variantPrice);
  button.setAttribute("label-text", text);

  if (plusPrice) {
    const labelPrice = document.createElement("span");
    labelPrice.classList.add("label-price");
    labelPrice.innerHTML = ` (${plusPrice})`;
    labelText.appendChild(labelPrice);
  }

  return [wrapper, button];
};

const createDropdown = (title) => {
  const dropdown = document.createElement("div");
  const p = document.createElement("p");
  const svg =
    '<svg width="20" height="17" viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.5981 15.5C11.4434 17.5 8.55662 17.5 7.40192 15.5L1.33975 5C0.185047 3 1.62842 0.499998 3.93782 0.499998L16.0622 0.499999C18.3716 0.5 19.815 3 18.6603 5L12.5981 15.5Z" fill="black"/></svg>';
  dropdown.setAttribute("role", "button");
  dropdown.classList.add("cart__dropdown");
  p.innerHTML = title;
  dropdown.appendChild(p);
  dropdown.insertAdjacentHTML("beforeend", svg);
  dropdown.addEventListener("click", (e) => {
    dropdown.classList.remove("shake");
    if (e.target.tagName !== "INPUT") dropdown.classList.toggle("active");
  });
  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target) || e.target.tagName === "INPUT") dropdown.classList.remove("active");
  });
  return dropdown;
};

const handleSimpleProduct = ({ prod, productInfo, img }) => {
  const dropdown = createDropdown(prod.variants[0].title);
  const variantsWrapper = document.createElement("div");
  variantsWrapper.classList.add("cart__dropdown__variants");
  productInfo.appendChild(dropdown);
  prod.variants.forEach((variant) => {
    const [wrapper, button] = createButton({
      productId: prod.id,
      variantId: variant.id,
      text: variant.title,
      variantPrice: variant.price.amount,
    });
    variantsWrapper.appendChild(wrapper);
    variantsWrapper.querySelector("input").checked = true;
    button.addEventListener("change", () => {
      img.src = variant.image.src;
      img.alt = variant.title;
      dropdown.querySelector("p").innerHTML = button.getAttribute("label-text");
    });
  });
  dropdown.appendChild(variantsWrapper);
};

const handleComplexProduct = ({ prod, productInfo, img }) => {
  const primaryOption = prod.options[0];
  const secondaryOption = prod.options[1];
  primaryOption.values = primaryOption.values.filter((value) => {
    for (let variant of prod.variants) {
      if (variant.selectedOptions[0].value === value && variant.availableForSale) return true;
    }
    return false;
  });

  const createBase = (text) => {
    const dropdown = createDropdown(text);
    const variantsWrapper = document.createElement("div");
    variantsWrapper.classList.add("cart__dropdown__variants");
    return [dropdown, variantsWrapper];
  };

  const [primaryDropdown, primaryVariantsWrapper] = createBase(primaryOption.values[0]);
  const secondaryVariantsWrapper = document.createElement("div");
  secondaryVariantsWrapper.classList.add("cart__secondary-wrapper");
  primaryVariantsWrapper.setAttribute("primary", prod.id);
  secondaryVariantsWrapper.setAttribute("secondary", prod.id);

  const findPlusPrice = (value, variants) => {
    for (let variant of variants) {
      if (variant.title.includes(value)) return variant.title.split("(")[1]?.split(")")[0];
    }
  };

  const getNewName = (value) => {
    switch (value) {
      case "Small":
        return "S";
      case "Medium":
        return "M";
      case "Large":
        return "L";
      case "X-Large":
        return "XL";
      default:
        return value;
    }
  };

  const placeHolders = ["S", "M", "L", "XL", "2XL", "3XL", "4XL"].map((size) => {
    const wrapper = document.createElement("div");
    const textWrapper = document.createElement("div");
    const text = document.createElement("span");
    wrapper.classList.add("button-wrapper");
    wrapper.classList.add("button-wrapper--placeholder");
    textWrapper.classList.add("placeholder__text-wrapper");
    text.classList.add("label-text");
    text.innerHTML = size;
    text.setAttribute("size", size);
    wrapper.appendChild(textWrapper);
    textWrapper.appendChild(text);
    return wrapper;
  });

  const updateSecondaryOptions = (primarySelected) => {
    const prevSelected = secondaryVariantsWrapper.querySelector(["input:checked"]);
    secondaryVariantsWrapper.innerHTML = "";
    placeHolders.forEach((placeholder) => secondaryVariantsWrapper.appendChild(placeholder));
    prod.variants.forEach((variant) => {
      const newValue = variant.selectedOptions[1].value;
      const plusPrice = findPlusPrice(newValue, prod.variants);
      if (variant.title.includes(primarySelected) && !secondaryVariantsWrapper.querySelector("label")?.innerHTML.includes(newValue)) {
        const [wrapper, button] = createButton({ productId: secondaryOption.id, variantId: newValue, text: getNewName(newValue), plusPrice: plusPrice });
        button.addEventListener("change", () => {
          secondaryVariantsWrapper.classList.remove("shake");
        });
        if (prevSelected?.id === newValue) {
          button.checked = true;
        }
        const placeholder = placeHolders.find((placeHolder) => placeHolder.querySelector(`[size="${getNewName(newValue)}"]`));
        secondaryVariantsWrapper.insertBefore(wrapper, placeholder);
        placeholder.remove();
      }
    });
  };

  primaryOption.values.forEach((option) => {
    const [wrapper, button] = createButton({
      productId: primaryOption.id,
      variantId: option,
      text: option,
    });
    button.addEventListener("change", () => {
      for (let variant of prod.variants) {
        if (variant.title.includes(button.value)) {
          img.src = variant.image.src;
          img.alt = button.getAttribute("label-text");
          primaryDropdown.querySelector("p").innerHTML = button.getAttribute("label-text");
          break;
        }
      }
      updateSecondaryOptions(button.value);
    });
    primaryVariantsWrapper.appendChild(wrapper);
  });
  primaryVariantsWrapper.querySelector("input").checked = true;
  primaryDropdown.appendChild(primaryVariantsWrapper);

  updateSecondaryOptions(primaryOption.values[0]);

  productInfo.appendChild(primaryDropdown);
  productInfo.appendChild(secondaryVariantsWrapper);
};

const createProduct = ({ prod, isVariant = false, isOrderBump = false, inCartContainer = undefined, data = undefined }) => {
  const productWrapper = document.createElement("div");
  productWrapper.classList.add("cart__product");

  const productInfo = document.createElement("div");
  productInfo.classList.add("cart__product__info");

  const img = document.createElement("img");
  if (isVariant) {
    img.src = prod.image.src;
    img.alt = prod.title;
  } else {
    img.src = prod.variants[0].image.src;
    img.alt = prod.variants[0].title;
  }

  const title = document.createElement("p");
  title.classList.add("cart__product__title");
  title.innerHTML = isVariant || prod.title;
  productInfo.appendChild(title);
  if (isVariant) {
    const variantTitle = document.createElement("p");
    variantTitle.classList.add("cart__product__variant-title");
    variantTitle.innerHTML = prod.title;
    productInfo.appendChild(variantTitle);
  }

  productWrapper.appendChild(img);
  productWrapper.appendChild(productInfo);
  if (!isVariant && prod.variants.length > 1 && !prod.isWhole) {
    if (prod.options.length > 1) handleComplexProduct({ prod, productInfo, img });
    else handleSimpleProduct({ prod, productInfo, img });
  }

  if (isOrderBump) {
    const addButton = document.createElement("button");
    addButton.classList.add("add-button");
    addButton.innerHTML = `Add to cart for only +$${orderBumpIds[prod.id].price}`;
    addButton.addEventListener("click", () => {
      addButton.remove();
      inCartContainer.appendChild(productWrapper);
      data.push(prod);
    });
    productInfo.appendChild(addButton);
  }

  return productWrapper;
};

const createCart = (data, orderBumpData) => {
  const cartWrapper = document.createElement("div");
  const cartOverlay = document.createElement("div");
  const cart = document.createElement("div");
  cartWrapper.classList.add("cart-wrapper");
  cartOverlay.classList.add("cart-overlay");
  cart.classList.add("cart");
  cartWrapper.appendChild(cartOverlay);
  cartWrapper.appendChild(cart);
  document.body.appendChild(cartWrapper);

  const cartHead = document.createElement("div");
  const cartTitle = document.createElement("p");
  const closeCartButton = document.createElement("button");
  cartHead.classList.add("cart__head");
  cartTitle.classList.add("cart__head__title");
  closeCartButton.classList.add("cart__head__close-button");
  cartTitle.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM208-800h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40v-80h130l38 80Z"/></svg>
  Cart`;
  closeCartButton.innerHTML =
    '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>';
  cartHead.appendChild(cartTitle);
  cartHead.appendChild(closeCartButton);
  cart.append(cartHead);

  const productsContainer = document.createElement("div");
  const inCartContainer = document.createElement("div");
  const orderBumpsContainer = document.createElement("div");
  productsContainer.classList.add("cart__prod-container");
  inCartContainer.classList.add("cart__in-cart-container");
  orderBumpsContainer.classList.add("cart__order-bumps-container");
  productsContainer.appendChild(inCartContainer);
  productsContainer.appendChild(orderBumpsContainer);
  cart.appendChild(productsContainer);

  [cartOverlay, closeCartButton].forEach((el) => {
    el.addEventListener("click", () => {
      toggleCart(cartWrapper);
    });
  });

  data.forEach((prod) => {
    if (prod.isWhole) {
      prod.variants.forEach((variant) => {
        inCartContainer.appendChild(createProduct({ prod: variant, isVariant: prod.title }));
      });
    } else inCartContainer.appendChild(createProduct({ prod }));
  });
  orderBumpData.forEach((prod) => {
    orderBumpsContainer.appendChild(createProduct({ prod, isOrderBump: true, inCartContainer, data }));
  });

  const cartFoot = document.createElement("div");
  cartFoot.classList.add("cart__foot");

  const buyButton = document.createElement("button");
  buyButton.classList.add("buy-button");
  buyButton.innerHTML = "BUY NOW";
  buyButton.addEventListener("click", () => {
    buyButton.toggleAttribute("disabled");
    buy(data, buyButton);
  });

  cartFoot.appendChild(buyButton);

  if (hasQtty) {
    const plusBtn = document.createElement("button");
    plusBtn.classList.add("btn-plus");
    plusBtn.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>';

    const minusBtn = document.createElement("button");
    minusBtn.classList.add("btn-minus");
    minusBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M200-440v-80h560v80H200Z"/></svg>';

    const qttyInput = document.createElement("input");
    qttyInput.id = "cart-qtty-input";
    qttyInput.value = 1;
    qttyInput.type = "number";
    qttyInput.addEventListener("input", () => {
      if (qttyInput.value <= 0) qttyInput.value = 1;
    });

    plusBtn.addEventListener("click", () => {
      qttyInput.value = +qttyInput.value + 1;
    });
    minusBtn.addEventListener("click", () => {
      if (qttyInput.value > 1) qttyInput.value = +qttyInput.value - 1;
    });

    const qttyWrapper = document.createElement("div");
    qttyWrapper.classList.add("qtty-wrapper");
    qttyWrapper.appendChild(minusBtn);
    qttyWrapper.appendChild(qttyInput);
    qttyWrapper.appendChild(plusBtn);
    cartFoot.appendChild(qttyWrapper);
  }

  cart.appendChild(cartFoot);

  return cartWrapper;
};

const toggleCart = (cartWrapper) => {
  cartWrapper.classList.toggle("active");
  document.body.classList.toggle("no-scroll");
};

export { toggleCart, createCart };
