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

const getTokenGoogleAuth = (token) => {
  return JSON.parse(localStorage.getItem("goole_token"));
};

const setTokenGoogleAuth = (token) => {
  localStorage.setItem("goole_token", JSON.stringify(token));
};

const removeTokenGoogleAuth = () => {
  localStorage.removeItem("goole_token");
};

const removeToken = () => {
  localStorage.removeItem("token");
};

const removeRefreshToken = () => {
  localStorage.removeItem("refresh_token");
}

const tokenService = {
  getLocalAccessToken,
  updateLocalAccessToken,
  setToken,
  removeToken,
  setTokenGoogleAuth,
  removeTokenGoogleAuth,
  getTokenGoogleAuth,
  removeRefreshToken
};

export default tokenService;