import classNames from "classnames/bind";
import styles from "./ModalAddress.module.scss";
import Button from "../../components/Button"
import { useEffect, useRef, useState } from "react";
import { getAddress } from "../../services/addressService";
import { useClickOutside } from "../../hooks/useClickOutside";

const cx = classNames.bind(styles)

const ModalAddress = ({ onHideModal }) => {

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [searchAddress, setSearchAddress] = useState("");
  const [tabActive, setTabActive] = useState("province");
  const [toggleInput, setToggleInput] = useState(true);
  const addressPlaceholderRef = useRef(null);
  const addressListRef = useRef(null);
  const addressInputRef = useRef(null);
  const wrapperRef = useRef(null);

  const handleRemoveList = () => {
    addressListRef.current.style.display = "none";
    addressPlaceholderRef.current.style.display = "block";
    setToggleInput(true);
  };

  useClickOutside(wrapperRef, handleRemoveList);

  const handleChooseAddress = () => {
    addressListRef.current.style.display = "flex";
    addressPlaceholderRef.current.style.display = "none";
    addressInputRef.current.focus();
    setToggleInput(false);
  };


  const handleChooseProvince = async (provinceID, provinceName) => {
    const fetchData = async () => {
      try {
        const response = await getAddress("/district", {
          params: {
            province_id: provinceID
          }
        });
        setSearchAddress(provinceName)
        setDistricts(response.data);
        setTabActive("district")
      }
      catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }

  const handleChooseDistrict = async (districtId, districtName) => {
    const fetchData = async () => {
      try {
        const response = await getAddress("/ward", {
          params: {
            district_id: districtId
          }
        });
        setSearchAddress(preAddress => `${preAddress}, ${districtName}`)
        setWards(response.data);
        setTabActive("ward")
      }
      catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }

  const handleChooseWard = (wardName) => {
    setSearchAddress(preAddress => `${preAddress}, ${wardName}`);
    handleRemoveList();
  }

  const handleClearInput = () => {
    setSearchAddress("");
    setDistricts([]);
    setWards([]);
    setTabActive("province");
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAddress("/province");
        setProvinces(response.data);
      }
      catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }, [])

  useEffect(() => {
    if (searchAddress) {
      addressPlaceholderRef.current.innerHTML = searchAddress;
    } else {
      addressPlaceholderRef.current.innerHTML = "Tỉnh/ Thành phố, Quận/Huyện, Phường/Xã";
    }
  }, [toggleInput])

  const handleClickProvinceHeader = () => {
    setTabActive("province");

  };
  const handleClickDistrictHeader = () => {
    if (districts.length) {
      setTabActive("district");
    }
  };
  const handleClickWardHeader = () => {
    if (wards.length) {
      setTabActive("ward")
    }
  };

  return (
    <div className={cx("modal-address-container")}>
      <p>New Address</p>
      <form>
        <div className={cx("form-container")}>
          <div className={cx("form-info")}>
            <div className={cx("person-info")}>
              <div>
                <input type="text" placeholder="Full Name" />
              </div>
              <div>
                <input type="text" placeholder="Number Phone" />
              </div>
            </div>
            <div className={cx("address-info-wrapper")} ref={wrapperRef}>
              <div className={cx("address-info")} onClick={handleChooseAddress}
              >
                <div className={cx("address-placeholder-hide")}>Tỉnh/ Thành phố, Quận/Huyện, Phường/Xã</div>
                <div className={cx("address-placeholder")} ref={addressPlaceholderRef}>Tỉnh/ Thành phố, Quận/Huyện, Phường/Xã</div>
                <input
                  ref={addressInputRef}
                  autoComplete="user-administrative-divisions" className={cx("input-address", {
                    "input-select": toggleInput
                  })} type="text" placeholder="Tỉnh/ Thành phố, Quận/Huyện, Phường/Xã" value={searchAddress} onChange={
                    (e) => {
                      if (!e.target.value) {
                        setTabActive("province")
                        setSearchAddress(e.target.value)
                        setDistricts([]);
                        setWards([]);
                      }
                    }
                  } />
                <div className={cx("address-filter")}>
                  <div className={cx("address-search")}>
                    <svg viewBox="0 0 16 16" fill="none" width="16" height="16" color="rgba(0, 0, 0, 0.54)" ><path fillRule="evenodd" clipRule="evenodd" d="M12.492 7.246A5.246 5.246 0 112 7.246a5.246 5.246 0 0110.492 0zm-1.2 4.758a6.246 6.246 0 11.728-.731l2.998 2.997-.73.73-2.996-2.996z" fill="currentColor"></path>
                    </svg>
                  </div>
                  {searchAddress && <svg onClick={handleClearInput} viewBox="0 0 20 20" fill="none" width="140" height="140" color="rgba(0, 0, 0, 0.26)" className={cx("clear-icon")}><path fillRule="evenodd" clipRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM6.041 7.102L8.94 10l-2.898 2.898 1.06 1.06L10 11.062l2.898 2.898 1.06-1.06-2.896-2.9 2.898-2.898-1.06-1.06L10 8.938 7.102 6.041l-1.06 1.06z" fill="currentColor"></path>
                  </svg>}
                  <div className={cx("address-select")}>
                  </div>
                </div>
              </div>
              <div className={cx("address-select-wrapper")} ref={addressListRef}>
                <div className={cx("address-header")}>
                  <span className={cx({
                    "header-active": tabActive === "province"
                  })}
                    onClick={handleClickProvinceHeader}
                  >
                    Tỉnh/Thành Phố
                  </span>
                  <span
                    onClick={handleClickDistrictHeader}
                    className={cx({
                      "header-active": tabActive === "district"
                    })}
                    style={{
                      cursor: !districts.length ? "not-allowed" : "pointer"
                    }}
                  >
                    Quận/Huyện
                  </span>
                  <span
                    onClick={handleClickWardHeader}
                    style={{
                      cursor: !wards.length ? "not-allowed" : "pointer"
                    }}
                    className={cx({
                      "header-active": tabActive === "ward"
                    })}
                  >
                    Phường/Xã
                  </span>
                </div>
                <div className={cx("address-active")} style={{
                  transform: tabActive === "district" ? "translateX(100%)" : tabActive === "province" ? "translateX(0%)" : "translateX(200%)"
                }}></div>
                <div className={cx("address-list")}>
                  {!districts.length || tabActive === "province" ? provinces?.map(province => (
                    <div key={province.ProvinceID} className={cx("address-item")} onClick={() => handleChooseProvince(province.ProvinceID, province.ProvinceName)}>{province.ProvinceName}</div>
                  )) :
                    !wards.length || tabActive === "district" ?
                      districts?.map(district => (
                        <div key={district.DistrictID} className={cx("address-item")} onClick={() => handleChooseDistrict(district.DistrictID, district.DistrictName)}>{district.DistrictName}</div>
                      ))
                      : wards?.map(ward => (
                        <div key={ward.WardName} className={cx("address-item")} onClick={() => handleChooseWard(ward.WardName)}>{ward.WardName}</div>
                      ))
                  }
                </div>
              </div>
            </div>
            <div className={cx("address-detail")}>
              <textarea className={cx("address-detail-area")} rows="2" placeholder="Address Detail" autoComplete="user-street-address" maxLength="128" disabled={searchAddress.split(",").length < 3}></textarea>
            </div>
            <div className={cx("map-wrapper")}>
              <div className={cx("not-allowed")}>
                <svg fill="none" viewBox="0 0 440 120" preserveAspectRatio="xMidYMid slice" className="HRK22t"><g clipPath="url(#clip0)"><path fill="#F7F8F9" d="M0 0h440v120H0z"></path><g filter="url(#filter0_d)" stroke="#FBFBFC"><path strokeWidth="10" d="M-6.779-.48l123 61"></path><path strokeWidth="12" d="M11.524 124.548l30-67"></path><path strokeWidth="10" d="M-7.796 33.512l112 55"></path><path strokeWidth="12" d="M103.473 88.664l41-97"></path><path strokeWidth="10" d="M322.96 33.054l35-48m5.078 109.853l-51-10M442.064 94l-78 1"></path><path strokeWidth="12" d="M410.037 130.663l-4-36"></path><path strokeWidth="11" d="M73.36 39.047l28-44"></path><path strokeWidth="12" d="M31.552 19.486l12-26"></path><path strokeWidth="10" d="M116.01 60.422l41 18"></path><path strokeWidth="12" d="M140.286 123.17l41-128"></path><path strokeWidth="10" d="M164.244 42.682l-32-12"></path><path strokeWidth="11" d="M256.298 124.068l-89-81"></path><path strokeWidth="10" d="M242.102 24.626l-78-32M273.319-4.26l-80 71m26.348 26.974l-82 29m184.93-91.441l-102 62"></path><path strokeWidth="11" d="M144.386 123.146l-39-34"></path><path strokeWidth="12" d="M79.949 125.762l25-39"></path><path d="M241.5-7c18 8 70.203 32.864 82 39.5 16 9 39.5 35 39.5 61 0 27-18 34.5-28.5 42.5" strokeWidth="10"></path><path d="M240 23.5c31 25.5 74 52 72.5 62s-51.5 28.333-77 41M337.5 13s23.5-7 28-8S445 7.5 445 7.5" strokeWidth="10"></path><path d="M413 4c-1 13-3.4 40.5-5 42.5s-39.667 9-56 12" strokeWidth="11"></path></g></g><defs><clipPath id="clip0"><path fill="#fff" d="M0 0h440v120H0z"></path></clipPath><filter id="filter0_d" x="-14" y="-21.892" width="463.232" height="165.869" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"><feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix><feOffset></feOffset><feGaussianBlur stdDeviation="2"></feGaussianBlur><feComposite in2="hardAlpha" operator="out"></feComposite><feColorMatrix values="0 0 0 0 0.960784 0 0 0 0 0.964706 0 0 0 0 0.968627 0 0 0 1 0"></feColorMatrix><feBlend in2="BackgroundImageFix" result="effect1_dropShadow"></feBlend><feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape"></feBlend></filter></defs>
                </svg>
                <button className={cx("btn-map")} disabled={true}><svg viewBox="0 0 10 10" className="Hn994c"><path stroke="none" d="m10 4.5h-4.5v-4.5h-1v4.5h-4.5v1h4.5v4.5h1v-4.5h4.5z"></path>
                </svg>
                  Thêm vị trí
                </button>
              </div>
            </div>
            <div className={cx("address-options")}>
              <label className={cx("address-default")}>
                <input className={cx("address-check")} type="checkbox" role="checkbox" aria-checked="false" aria-disabled="false" />
                <span>Đặt làm địa chỉ mặc đinh</span>
              </label>
              <label className={cx("address-get")}>
                <input className={cx("address-check")} type="checkbox" role="checkbox" aria-checked="false" aria-disabled="false" />
                <span>Đặt làm địa chỉ lấy hàng</span>
              </label>
              <label className={cx("address-return")}>
                <input className={cx("address-check")} type="checkbox" role="checkbox" aria-checked="false" aria-disabled="false" />
                <span>Đặt làm địa chỉ trả hàng</span>
              </label>
            </div>
          </div>
          <div className={cx("form-action")}>
            <Button onClick={onHideModal}>Cancel</Button>
            <Button>Save Changes</Button>
          </div>
        </div>
      </form>
    </div>
  )
};

export default ModalAddress;
