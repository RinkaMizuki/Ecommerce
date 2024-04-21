import classNames from "classnames/bind";
import styles from "./Link.module.scss";
import Avatar from "../../components/Avatar";
import Button from "../../components/Button";
import FacebookIcon from '@mui/icons-material/Facebook';
import useCustomFetch from "../../hooks/useCustomFetch";
import { logoutSuccess } from "../../redux/authSlice";
import { useDispatch, useSelector } from "react-redux"
import queryString from "query-string";
import FacebookLogin from "react-facebook-login";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useEffect } from "react";
import Popup from "../../components/Popup";
import { getToken as revokeToken } from "../../services/googleService";
import tokenService from "../../services/tokenService";

const cx = classNames.bind(styles);
const googleProvider = "Google";
const facebookProvider = "Facebook";
const toastOptions = {
  position: "top-right",
  autoClose: 2000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "colored",
}

const Link = () => {

  const currentUser = useSelector(state => state.auth.login.currentUser.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [, , , deleteUserLogin] = useCustomFetch();

  const handleFindProviderByName = (providerName = "") => {
    return currentUser.userLogins.find(ul => ul.loginProvider.toLowerCase() === providerName.toLowerCase());
  }

  const handleLinkGoogleAccount = () => {
    const queryStringData = queryString.stringify({
      client_id: import.meta.env.VITE_ECOMMERCE_CLIENT_ID,
      redirect_uri: import.meta.env.VITE_ECOMMERCE_GOOGLE_REDIRECT_URI,
      scope: "openid profile email",
      response_type: "code",
      access_type: "offline",
      prompt: "consent",
      nonce: 'n-0S6_WzA2Mj'
    });
    const googleAuthUrl = `${import.meta.env.VITE_ECOMMERCE_GOOGLE_BASE_URL}?${queryStringData}`;
    localStorage.setItem("authType", JSON.stringify("link"))
    window.location.href = googleAuthUrl;
  }

  const responseFacebook = (res) => {
    localStorage.setItem("authType", JSON.stringify("link"))
    navigate("/signin-facebook", {
      state: res,
    })
  }
  const handleUnlinkAccount = async (providerKey, type) => {
    try {
      const res = await deleteUserLogin("/Auth/unlink-account", {
        params: {
          userId: currentUser?.id,
          providerId: providerKey,
        }
      })
      if (type === googleProvider) {
        // await revokeToken("/revoke", null, {
        //   headers: {
        //     "Content-type": "application/x-www-form-urlencoded",
        //   },
        //   params: {
        //     token: tokenService.getTokenGoogleAuth(),
        //   }
        // });
        // tokenService.removeTokenGoogleAuth();
      }
      tokenService.removeRefreshToken();
      tokenService.removeToken();
      dispatch(logoutSuccess(res.data))
      window.location.reload();
      navigate("/login")
    }
    catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    console.log(location.state);
    if (location.state) {
      toast.error(location.state.message, toastOptions);
      window.history.replaceState({}, '')
    }
  }, [location.state])


  return (
    <div className={cx("link-account-container")}>
      <ToastContainer style={{
        marginTop: "110px"
      }}></ToastContainer>
      <div className={cx("link-account-wrapper")}>
        <h1 className={cx("link-title")}>Link Your Sign-in Account</h1>
        <div className={cx("link-info-wrapper")}>
          <div className={cx("link-info-item")}>
            <h2 className={cx("provider-title")}>Link {googleProvider}</h2>
            <div className={cx("provider-info-wrapper")}>
              <div className={cx("provider-info")}>
                {handleFindProviderByName(googleProvider) ? <>
                  <Avatar src={handleFindProviderByName(googleProvider)?.accountAvatar} />
                  <p className={cx("account-name")}>{handleFindProviderByName(googleProvider)?.accountName}</p>
                </> : <p className={cx("account-name")}>Haven't linked Google account yet</p>}
              </div>
              {handleFindProviderByName(googleProvider) ?
                <Popup
                  trigger={handleFindProviderByName(googleProvider)?.isUnlink && <Button className={cx("btn-link-provider")}
                  >Unlink</Button>}
                  contentStyle={{
                    width: "25%",
                    padding: "2px",
                    borderRadius: "5px",
                    border: "0",
                    animation: ".3s cubic-bezier(.38,.1,.36,.9) forwards a"
                  }}
                  header={
                    <svg className={cx("header-icon")} width="32" height="32" viewBox="0 0 16 16"><path d="M0 0h16v16H0V0z" fill="none"></path><path d="M15.2 13.1L8.6 1.6c-.2-.4-.9-.4-1.2 0L.8 13.1c-.1.2-.1.5 0 .7.1.2.3.3.6.3h13.3c.2 0 .5-.1.6-.3.1-.2.1-.5-.1-.7zM8.7 12H7.3v-1.3h1.3V12zm0-2.7H7.3v-4h1.3v4z" fill="currentColor"></path></svg>
                  }
                  content={<p className={cx("content-text")}>You want to unlink the account <span>{handleFindProviderByName(googleProvider)?.accountName}</span>?</p>}
                  action={<>
                    <button className={cx("btn-cancel")} onClick={close}>
                      <div className={cx("btn-content")}>
                        <span className={cx("btn-text-cancel")}>Cancel</span>
                      </div>
                    </button>
                    <button className={cx("btn-agree")} onClick={() => handleUnlinkAccount(handleFindProviderByName(googleProvider)?.providerKey, googleProvider)}>
                      <div className={cx("btn-content")}>
                        <span className={cx("btn-text-agree")}>Agree</span>
                      </div>
                    </button>
                  </>}
                />
                :
                <Button className={cx("btn-link-provider")} onClick={handleLinkGoogleAccount} >
                  <img src="https://fullstack.edu.vn/static/media/google-18px.c3ebfe2090fd87e02dbb9660dee0b031.svg" alt="Google Icon" />
                  <span>Link {googleProvider}</span>
                </Button>
              }
            </div>
          </div>
          <div className={cx("link-info-item")}>
            <h2 className={cx("provider-title")}>Link {facebookProvider}</h2>
            <div className={cx("provider-info-wrapper")}>
              <div className={cx("provider-info")}>
                {handleFindProviderByName(facebookProvider) ? <>
                  <Avatar src={handleFindProviderByName(facebookProvider)?.accountAvatar} />
                  <p className={cx("account-name")}>{handleFindProviderByName(facebookProvider)?.accountName}</p>
                </> : <p className={cx("account-name")}>Haven't linked Facebook account yet</p>}
              </div>
              {handleFindProviderByName(facebookProvider) ?
                <Popup
                  trigger={handleFindProviderByName(facebookProvider)?.isUnlink && <Button className={cx("btn-link-provider")}
                  >Unlink</Button>}
                  contentStyle={{
                    width: "25%",
                    padding: "2px",
                    borderRadius: "5px",
                    border: "0",
                    animation: ".3s cubic-bezier(.38,.1,.36,.9) forwards a"
                  }}
                  header={
                    <svg className={cx("header-icon")} width="32" height="32" viewBox="0 0 16 16"><path d="M0 0h16v16H0V0z" fill="none"></path><path d="M15.2 13.1L8.6 1.6c-.2-.4-.9-.4-1.2 0L.8 13.1c-.1.2-.1.5 0 .7.1.2.3.3.6.3h13.3c.2 0 .5-.1.6-.3.1-.2.1-.5-.1-.7zM8.7 12H7.3v-1.3h1.3V12zm0-2.7H7.3v-4h1.3v4z" fill="currentColor"></path></svg>
                  }
                  content={<p className={cx("content-text")}>Do you want to unlink your account?Do you want to unlink your account?You want to unlink the account <span>{handleFindProviderByName(facebookProvider)?.accountName}</span>?</p>}
                  action={<>
                    <button className={cx("btn-cancel")} onClick={close}>
                      <div className={cx("btn-content")}>
                        <span className={cx("btn-text-cancel")}>Cancel</span>
                      </div>
                    </button>
                    <button className={cx("btn-agree")} onClick={() => handleUnlinkAccount(handleFindProviderByName(facebookProvider)?.providerKey)}>
                      <div className={cx("btn-content")}>
                        <span className={cx("btn-text-agree")}>Agree</span>
                      </div>
                    </button>
                  </>}
                />
                :
                <FacebookLogin
                  appId="1844560925992088"
                  fields="id,name,email,picture"
                  callback={responseFacebook}
                  cssClass={cx("btn-facebook")}
                  textButton="Link Facebook"
                  version="19.0"
                  icon={<FacebookIcon style={{
                    color: "rgb(24, 119, 242)",
                    width: "30px",
                    height: "30px"
                  }} />}
                />}
            </div>
          </div>
          <div className={cx("link-info-item")}>
            <h2 className={cx("provider-title")}>Link Phone Number</h2>
            <div className={cx("provider-info-wrapper")}>
              <div className={cx("provider-info")}>
                {handleFindProviderByName("0987654321") ?
                  <p>0987654321</p>
                  :
                  <p className={cx("account-name")}>Haven't linked Phone Number yet</p>
                }
              </div>
              {handleFindProviderByName("0987654321") ? <Button className={cx("btn-link-provider")}>Unlink</Button> : <Button className={cx("btn-link-provider")}>
                <svg aria-hidden="true" width="16" height="16" focusable="false" dataprefix="fas" dataicon="phone" className="svg-inline--fa fa-phone " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M511.2 387l-23.25 100.8c-3.266 14.25-15.79 24.22-30.46 24.22C205.2 512 0 306.8 0 54.5c0-14.66 9.969-27.2 24.22-30.45l100.8-23.25C139.7-2.602 154.7 5.018 160.8 18.92l46.52 108.5c5.438 12.78 1.77 27.67-8.98 36.45L144.5 207.1c33.98 69.22 90.26 125.5 159.5 159.5l44.08-53.8c8.688-10.78 23.69-14.51 36.47-8.975l108.5 46.51C506.1 357.2 514.6 372.4 511.2 387z"></path></svg>
                <span>Link Phone Number</span>
              </Button>}
            </div>
          </div>
        </div>
      </div>
      <div className={cx("link-social-wrapper")}>
        <h1 className={cx("link-title")}>Social Network</h1>
        <div className={cx("link-info-wrapper")}>
          <div className={cx("link-info-item")}>
            <h2 className={cx("provider-title")}>Facebook</h2>
            <div className={cx("provider-info-wrapper")}>
              <div className={cx("provider-info")}>
                <input type="text" name="facebook" id="facebook" placeholder="Eg. https://www.facebook.com/mtstore" />
              </div>
              {true ? <Button className={cx("btn-link-provider")}>Edit</Button> : <div className={cx("btn-link-change")}>
                <Button className={cx("btn-link-save")}>Save</Button>
                <Button className={cx("btn-link-provider")}>Cancel</Button>
              </div>}
            </div>
          </div>
          <div className={cx("link-info-item")}>
            <h2 className={cx("provider-title")}>Youtube</h2>
            <div className={cx("provider-info-wrapper")}>
              <div className={cx("provider-info")}>
                <input type="text" name="youtube" id="youtube" placeholder="Eg. https://www.youtube.com/mtstore" />
              </div>
              {true ? <Button className={cx("btn-link-provider")}>Edit</Button> : <div className={cx("btn-link-change")}>
                <Button className={cx("btn-link-save")}>Save</Button>
                <Button className={cx("btn-link-provider")}>Cancel</Button>
              </div>}
            </div>
          </div>
          <div className={cx("link-info-item")}>
            <h2 className={cx("provider-title")}>Linkedin</h2>
            <div className={cx("provider-info-wrapper")}>
              <div className={cx("provider-info")}>
                <input type="text" name="linkedin" id="linkedin" placeholder="Eg. https://www.linkedin.com/in/mtstore" />
              </div>
              {true ? <Button className={cx("btn-link-provider")}>Edit</Button> : <div className={cx("btn-link-change")}>
                <Button className={cx("btn-link-save")}>Save</Button>
                <Button className={cx("btn-link-provider")}>Cancel</Button>
              </div>}
            </div>
          </div>
          <div className={cx("link-info-item")}>
            <h2 className={cx("provider-title")}>Instagram</h2>
            <div className={cx("provider-info-wrapper")}>
              <div className={cx("provider-info")}>
                <input type="text" name="instagram" id="instagram" placeholder="Eg. https://www.instagram.com/mtstore" />
              </div>
              {true ? <Button className={cx("btn-link-provider")}>Edit</Button> : <div className={cx("btn-link-change")}>
                <Button className={cx("btn-link-save")}>Save</Button>
                <Button className={cx("btn-link-provider")}>Cancel</Button>
              </div>}
            </div>
          </div>
          <div className={cx("link-info-item")}>
            <h2 className={cx("provider-title")}>Twitter</h2>
            <div className={cx("provider-info-wrapper")}>
              <div className={cx("provider-info")}>
                <input type="text" name="twitter" id="twitter" placeholder="Eg. https://www.twitter.com/mtstore" />
              </div>
              {true ? <Button className={cx("btn-link-provider")}>Edit</Button> : <div className={cx("btn-link-change")}>
                <Button className={cx("btn-link-save")}>Save</Button>
                <Button className={cx("btn-link-provider")}>Cancel</Button>
              </div>}
            </div>
          </div>
        </div>
      </div>
    </div >
  )
};

export default Link;
