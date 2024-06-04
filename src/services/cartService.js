const changeQuantity = (products, id, quantity, type, color) => {
  const product = products.find(function (p) {
    return p.id === id;
  });
  // Nếu tìm thấy đối tượng, thay đổi thuộc tính
  if (product && type === "add") {
    product.quantity += 1;
    product.color = color;
  }
  else if (product && type == "addMany") {
    product.quantity += quantity;
    product.color = color;
  }
  else if (product && type !== "add") {
    product.quantity -= 1;
    product.color = color;
    if (product.quantity == 0) {
      products = products.filter(p => p.id != id);
    }
  }
  else {
    products.push({
      id,
      quantity,
      active: true,
      color
    })
  }
  return products;
}

const setLocalProductColor = (userId, productId, color) => {
  const listProduct = getLocalProductQuantity(userId);
  localStorage.setItem(`cart_${userId}`, JSON.stringify(listProduct.map(p => {
    if (p.id === productId) {
      return {
        ...p,
        color: color
      }
    }
    return p;
  })));
}

const setLocalProductQuantity = (productId, userId = "", quantity = 1, type = "add", remove = false, color = "") => {
  let listProduct = getLocalProductQuantity(userId);
  let productsFilter;
  if (remove) {
    productsFilter = listProduct.filter(p => p.id != productId);
  } else {
    productsFilter = changeQuantity(listProduct, productId, quantity, type, color);
  }

  localStorage.setItem(`cart_${userId}`, JSON.stringify(productsFilter));
  window.dispatchEvent(new Event(`CartDataEvent_${userId}`));
}

const getLocalProductQuantity = (userId = "") => {
  const listProduct = JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];
  return listProduct;
}

const deleteLocalProduct = (userId) => {
  localStorage.removeItem(`cart_${userId}`)
  window.dispatchEvent(new Event(`CartDataEvent_${userId}`));
}

export { setLocalProductQuantity, getLocalProductQuantity, setLocalProductColor, deleteLocalProduct };