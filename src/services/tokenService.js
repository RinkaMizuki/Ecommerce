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

const getTokenGoogleAuth = () => {
  return JSON.parse(localStorage.getItem("google_token"));
};

const setTokenGoogleAuth = (token) => {
  localStorage.setItem("google_token", JSON.stringify(token));
};

const removeTokenGoogleAuth = () => {
  localStorage.removeItem("google_token");
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