import classNames from "classnames/bind";
import styles from "./Link.module.scss";
import Avatar from "../../components/Avatar";
import Button from "../../components/Button";

const cx = classNames.bind(styles);

const Link = () => {
  return (
    <div className={cx("link-account-container")}>
      <div className={cx("link-account-wrapper")}>
        <h1 className={cx("link-title")}>Link Your Sign-in Account</h1>
        <div className={cx("link-info-wrapper")}>
          <div className={cx("link-info-item")}>
            <h2 className={cx("provider-title")}>Link Google</h2>
            <div className={cx("provider-info-wrapper")}>
              <div className={cx("provider-info")}>
                <Avatar src="https://lh3.googleusercontent.com/a/ACg8ocJWH7br4Eq8uK0jp54csrrO84TjiBSUre_HUZl0WVmTc2E=s96-c" alt="Google Avatar" />
                <p className={cx("account-name")}>nguyenduc09012003@gmail.com</p>
              </div>
              {true ? <Button className={cx("btn-link-provider")}>Unlink</Button> : <Button className={cx("btn-link-provider")}>
                <img src="https://fullstack.edu.vn/static/media/google-18px.c3ebfe2090fd87e02dbb9660dee0b031.svg" alt="" />
                <span>Link Google</span>
              </Button>}
            </div>
          </div>
          <div className={cx("link-info-item")}>
            <h2 className={cx("provider-title")}>Link Facebook</h2>
            <div className={cx("provider-info-wrapper")}>
              <div className={cx("provider-info")}>
                {false ? <>
                  <Avatar src="https://lh3.googleusercontent.com/a/ACg8ocJWH7br4Eq8uK0jp54csrrO84TjiBSUre_HUZl0WVmTc2E=s96-c" alt="Google Avatar" />
                  <p className={cx("account-name")}>Nguyễn Bin</p>
                </> : <p className={cx("account-name")}>Haven't linked Facebook account yet</p>}
              </div>
              {false ? <Button className={cx("btn-link-provider")}>Unlink</Button> : <Button className={cx("btn-link-provider")}>
                <img src="https://fullstack.edu.vn/static/media/facebook-18px.f8cbbfa43b6a279006c9d53266b2c3e8.svg" alt="" />
                <span>Link Facebook</span>
              </Button>}
            </div>
          </div>
          <div className={cx("link-info-item")}>
            <h2 className={cx("provider-title")}>Link Phone Number</h2>
            <div className={cx("provider-info-wrapper")}>
              <div className={cx("provider-info")}>
                <Avatar src="https://lh3.googleusercontent.com/a/ACg8ocJWH7br4Eq8uK0jp54csrrO84TjiBSUre_HUZl0WVmTc2E=s96-c" alt="Google Avatar" />
                <p className={cx("account-name")}>Haven't linked Phone Number yet</p>
              </div>
              {false ? <Button className={cx("btn-link-provider")}>Unlink</Button> : <Button className={cx("btn-link-provider")}>
                <svg ariaHidden="true" width="16" height="16" focusable="false" dataPrefix="fas" dataIcon="phone" class="svg-inline--fa fa-phone " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M511.2 387l-23.25 100.8c-3.266 14.25-15.79 24.22-30.46 24.22C205.2 512 0 306.8 0 54.5c0-14.66 9.969-27.2 24.22-30.45l100.8-23.25C139.7-2.602 154.7 5.018 160.8 18.92l46.52 108.5c5.438 12.78 1.77 27.67-8.98 36.45L144.5 207.1c33.98 69.22 90.26 125.5 159.5 159.5l44.08-53.8c8.688-10.78 23.69-14.51 36.47-8.975l108.5 46.51C506.1 357.2 514.6 372.4 511.2 387z"></path></svg>
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
    </div>
  )
};

export default Link;
