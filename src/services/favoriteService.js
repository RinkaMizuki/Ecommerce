const setLocalFavoriteProductId = (newId, userId = "") => {
  let listIds = getLocalFavoriteProductId(userId);
  const isExistId = listIds.some(oldId => oldId == newId);
  if (isExistId) {
    listIds = listIds.filter(oldId => oldId !== newId);
  } else {
    listIds.push(newId);
  }
  localStorage.setItem(`favorites_${userId}`, JSON.stringify(listIds));
  window.dispatchEvent(new Event(`FavoriteDataEvent_${userId}`));
  return isExistId;
}

const getLocalFavoriteProductId = (userId = "") => {
  const ids = JSON.parse(localStorage.getItem(`favorites_${userId}`)) || [];
  return ids;
}

export { setLocalFavoriteProductId, getLocalFavoriteProductId };