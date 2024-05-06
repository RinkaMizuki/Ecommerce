const changeQuantity = (products, id, quantity, type) => {
  const product = products.find(function (p) {
    return p.id === id;
  });
  // Nếu tìm thấy đối tượng, thay đổi thuộc tính
  if (product && type === "add") {
    product.quantity += 1;
  }
  else if (product && type == "addMany") {
    product.quantity += quantity;
  }
  else if (product && type !== "add") {
    product.quantity -= 1;
    if (product.quantity == 0) {
      products = products.filter(p => p.id != id);
    }
  }
  else {
    products.push({
      id,
      quantity,
      active: true,
    })
  }
  return products;
}

const setLocalProductQuantity = (productId, userId = "", quantity = 1, type = "add", remove = false) => {
  let listProduct = getLocalProductQuantity(userId);
  let productsFilter;
  if (remove) {
    productsFilter = listProduct.filter(p => p.id != productId);
  } else {
    productsFilter = changeQuantity(listProduct, productId, quantity, type);
  }

  localStorage.setItem(`cart_${userId}`, JSON.stringify(productsFilter));
  window.dispatchEvent(new Event(`CartDataEvent_${userId}`));
}

const getLocalProductQuantity = (userId = "") => {
  const listProduct = JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];
  return listProduct;
}

export { setLocalProductQuantity, getLocalProductQuantity };