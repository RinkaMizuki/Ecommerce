const getLocalAccessToken = () => {
  const token = JSON.parse(localStorage.getItem("token")) ?? null;
  return token;
};

const updateLocalAccessToken = (token) => {
  let currentToken = JSON.parse(localStorage.getItem("token"));
  currentToken = token;
  localStorage.setItem("token", JSON.stringify(currentToken));
};


const setToken = (token) => {
  localStorage.setItem("token", JSON.stringify(token));
};

const removeToken = () => {
  localStorage.removeItem("token");
};

const TokenService = {
  getLocalAccessToken,
  updateLocalAccessToken,
  setToken,
  removeToken,
};

export default TokenService;