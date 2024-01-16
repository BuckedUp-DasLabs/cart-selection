import { apiOptions, fetchUrl } from "../../variables.js";

const filterVariants = (data, ids) => {
  const getVariant = (id) => {
    if (typeof id == "string" && id.includes("-")) return "gid://shopify/ProductVariant/" + id.split("-")[1];
    return null;
  };
  
  const getProdIndex = (data, id) => {
    id = id.split("-")[0];
    for (let i = 0; i < data.length; i++) {
      if (data[i].id.includes(id)) return i;
    }
  };

  ids.forEach((id) => {
    const variant = getVariant(id);
    if (variant) {
      const i = getProdIndex(data, id);
      data[i].variants.edges = data[i].variants.edges.filter((filteredVariant) => filteredVariant.node.id == variant);
      data[i].availableForSale = data[i].variants.edges[0].node.availableForSale
    }
  });
};

const fetchProduct = async ({ ids }) => {
  const query = `
  { 
    nodes(ids: [${ids.map((id) => `"gid://shopify/Product/${id}"`)}]) {
      ... on Product {
        availableForSale
        title
        id
        options{
          ... on ProductOption{
            id
            name
            values
          }
        }
        variants(first: 100) {
          edges{
            node{
              id
              title
              availableForSale
              selectedOptions{
                name
                value
              }
              price{
                amount
              }
              image {
                ... on Image {
                  src
                }
              }
            }
          }
        }
      }
    }
  }
  `;
  try {
    const response = await fetch(fetchUrl, {
      ...apiOptions,
      body: JSON.stringify({ query: query }),
    });
    let data = await response.json();
    if (!response.ok) {
      throw new Error("Error Fetching Api.");
    }
    data = data.data.nodes;
    filterVariants(data, ids);

    data.forEach((obj) => {
      if (!obj.availableForSale) console.log("Out of stock: ", obj.id, obj.title);
      obj.id = obj.id.split("/").slice(-1)[0];

      obj.variants = obj.variants.edges.filter((edge) => edge.node.availableForSale || (!edge.node.availableForSale && edge.node["last-variant"]));
      let minPrice = 99999;
      for (let key in obj.variants) {
        obj.variants[key] = obj.variants[key].node;
        obj.variants[key].title = obj.variants[key].title.split("(")[0];
        if (+obj.variants[key].price.amount < minPrice) minPrice = obj.variants[key].price.amount;
      }
      for (let key in obj.variants) {
        if (+obj.variants[key].price.amount > minPrice) {
          const string = ` (+$${(obj.variants[key].price.amount - minPrice).toFixed(2)})`;
          obj.variants[key].title = obj.variants[key].title + string;
        }
      }
    });
    return data;
  } catch (error) {
    alert("Product not found.");
    console.log(error);
    return null;
  }
};

export default fetchProduct;
