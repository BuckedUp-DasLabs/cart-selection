import { fetchUrl, apiOptions } from "../variables.js";
import toggleLoading from "./toggleLoading.js";
import { dataLayerRedirect } from "./dataLayer.js";

const getVariantId = (data) => {
  const primaryWrapper = document.querySelector(`[primary="${data.id}"]`);
  if (primaryWrapper) {
    const secondaryWrapper = document.querySelector(`[secondary="${data.id}"]`);
    const primary = Array.from(primaryWrapper.querySelectorAll("input")).filter((el) => el.checked)[0];
    const secondary = Array.from(secondaryWrapper.querySelectorAll("input")).filter((el) => el.checked)[0];
    if (!secondary) return { result: false, wrapper: secondaryWrapper };
    return { result: data.variants.filter((variant) => variant.title.includes(primary.value) && variant.title.includes(secondary.value))[0].id };
  } else {
    const input = Array.from(document.querySelectorAll(`[name="${data.id}"]`)).filter((el) => el.checked)[0];
    if (!input) return { result: false, wrpper: false };
    return { result: input.value };
  }
};

const addDiscount = async (checkoutId, code) => {
  const input = {
    checkoutId: checkoutId,
    discountCode: code,
  };
  const query = `
    mutation checkoutDiscountCodeApplyV2($checkoutId: ID!, $discountCode: String!) {
      checkoutDiscountCodeApplyV2(checkoutId: $checkoutId, discountCode: $discountCode) {
        checkout {
          id
          webUrl
        }
      }
    }
  `;
  const body = {
    query: query,
    variables: input,
  };
  const response = await fetch(fetchUrl, {
    ...apiOptions,
    body: JSON.stringify(body),
  });
  return response;
};

const addCustomAttributes = async (attributes, id) => {
  const input = {
    checkoutId: id,
    input: {
      customAttributes: attributes,
    },
  };
  const query = `
    mutation checkoutAttributesUpdateV2($checkoutId: ID!, $input: CheckoutAttributesUpdateV2Input!) {
      checkoutAttributesUpdateV2(checkoutId: $checkoutId, input: $input) {
        checkout {
          id
          customAttributes {
            key
            value
          }
        }
      }
    }
  `;
  const body = {
    query: query,
    variables: input,
  };
  const response = await fetch(fetchUrl, {
    ...apiOptions,
    body: JSON.stringify(body),
  });
  return response;
};

const startPopsixle = (id) => {
  if (typeof a10x_dl != "undefined") {
    a10x_dl.unique_checkout_id = id;
    session_sync(a10x_dl.s_id, "unique_checkout_id", a10x_dl.unique_checkout_id);
  } else {
    console.log("Popsixcle script not found.");
  }
};

//updates order
const buy = async (data, button) => {
  //if equals 0, then the data hasnt been fetched yet.
  if (data.length === 0) {
    return;
  }
  //if null, the api wasnt able to return the data.
  if (data == null) {
    return;
  }

  const variantId = [];

  for (let product of data) {
    if (product.isWhole) {
      variantId.push(...product.variants.map((variant) => variant.id));
    } else if (product.variants.length > 1) {
      const selectedVariant = getVariantId(product);
      if (!selectedVariant.result && !selectedVariant.wrapper) {
        alert("Sorry, there was a problem.");
        return;
      }
      if (!selectedVariant.result) {
        selectedVariant.wrapper.classList.add("shake");
        button.toggleAttribute("disabled");
        alert("Select your size.");
        return;
      }
      variantId.push(selectedVariant.result);
    } else variantId.push(product.variants[0].id);
  }

  toggleLoading();

  const quantity = +document.getElementById("cart-qtty-input")?.value || 1;

  const obj = variantId.map((variant) => {
    return { variantId: variant, quantity: quantity };
  });
  const input = {
    input: {
      lineItems: [...obj],
    },
  };
  const query = `
    mutation checkoutCreate($input: CheckoutCreateInput!) {
      checkoutCreate(input: $input) {
        checkout {
          webUrl
          id
          currencyCode
        }
      }
    }
  `;
  const body = {
    query: query,
    variables: input,
  };
  try {
    const response = await fetch(fetchUrl, {
      ...apiOptions,
      body: JSON.stringify(body),
    });
    const apiData = await response.json();
    console.log(apiData);
    if (!response.ok) throw new Error("Api Error.");
    const checkoutId = apiData.data.checkoutCreate.checkout.id;
    if (discountCode !== "") {
      const responseDiscount = await addDiscount(checkoutId, discountCode);
      if (!responseDiscount.ok) throw new Error("Api Discount Error.");
      const bumpDiscount = orderBumpIds[data.find((prod) => prod.id in orderBumpIds)?.id]?.discountCode;
      if (bumpDiscount) {
        const responseBumpDiscount = await addDiscount(checkoutId, bumpDiscount);
        if (!responseBumpDiscount.ok) throw new Error("Api Bump Discount Error.");
      }
    }

    startPopsixle(checkoutId.split("?key=")[1]);
    const attributesResponse = await addCustomAttributes(
      [
        {
          key: "unique_checkout_id",
          value: `${checkoutId.split("?key=")[1]}`,
        },
      ],
      checkoutId
    );
    if (!attributesResponse.ok) throw new Error("Attributes Error.");

    dataLayerRedirect(data);
    window.location.href = apiData.data.checkoutCreate.checkout.webUrl;
  } catch (error) {
    alert("There was a problem. Please try again later.");
    console.log(error);
  }
};

export default buy;
