const setLocalFavoriteProductId = (newId) => {
  let listIds = getLocalFavoriteProductId();
  const isExistId = listIds.some(oldId => oldId == newId);
  if (isExistId) {
    listIds = listIds.filter(oldId => oldId !== newId);
  } else {
    listIds.push(newId);
  }
  localStorage.setItem("favorites", JSON.stringify(listIds));
}

const getLocalFavoriteProductId = () => {
  const ids = JSON.parse(localStorage.getItem("favorites")) || [];
  return ids;
}

export { setLocalFavoriteProductId, getLocalFavoriteProductId };