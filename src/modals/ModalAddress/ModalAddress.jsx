import classNames from "classnames/bind";
import styles from "./ModalAddress.module.scss";
import Button from "../../components/Button"
import { useEffect, useRef, useState } from "react";
import { getAddress } from "../../services/addressService";
import { useClickOutside } from "../../hooks/useClickOutside";
import initMap from "../../lib/map";
import { GeocoderAutocomplete } from '@geoapify/geocoder-autocomplete';
import { useDispatch, useSelector } from "react-redux";
import { saveUserAddress } from "../../redux/addressSlice";
import useCustomFetch from "../../hooks/useCustomFetch";
import "@geoapify/geocoder-autocomplete/styles/minimal.css";
import Map from "../../components/Map"

const cx = classNames.bind(styles)

const ModalAddress = ({ onHideModal, data = null }) => {
  const addressBinding = data?.district && data?.city && data?.state ? `${data?.state}, ${data?.city}, ${data?.district}` : "";

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [searchAddress, setSearchAddress] = useState(addressBinding);
  const [fullname, setFullname] = useState(data?.name || "");
  const [numberphone, setNumberphone] = useState(data?.phone || "");
  const [detailAddress, setDetailAddress] = useState(data?.address || "");
  const [tabActive, setTabActive] = useState("province");
  const [toggleInput, setToggleInput] = useState(true);
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState([
    10.7514687,
    106.6946574
  ])
  const addressPlaceholderRef = useRef(null);
  const addressListRef = useRef(null);
  const addressWrapperRef = useRef(null);
  const addressInputRef = useRef(null);
  const wrapperRef = useRef(null);
  const wrapperNameRef = useRef(null);
  const wrapperPhoneRef = useRef(null);
  const labelFullnameRef = useRef(null);
  const labelNumberphoneRef = useRef(null);
  const alertFullnameRef = useRef(null);
  const alertNumberphoneRef = useRef(null);
  const fullnameInputRef = useRef(null);
  const defaultCheckRef = useRef(null);
  const returnCheckRef = useRef(null);
  const pickupCheckRef = useRef(null);
  const userLogin = useSelector(state => state.auth.login.currentUser.user);
  const isFetching = useSelector(state => state.address.isFetching);
  const listAddress = useSelector(state => state.address.listAddress);
  const [, postUserAddress, updateUserAddress] = useCustomFetch();
  const dispatch = useDispatch();

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
        setSearchAddress(preAddress => `${preAddress.split(",")[0]}, ${districtName}`)
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
    setSearchAddress(preAddress => `${preAddress.split(",")[0]}, ${preAddress.split(",")[1]}, ${wardName}`);
    handleRemoveList();
  }

  const handleSaveAddress = async () => {
    try {
      const localAddress = JSON.parse(localStorage.getItem("address")).split(",");
      const country = "Việt Nam";
      const state = searchAddress.split(",")[0].trim();
      const city = searchAddress.split(",")[1].trim();
      const district = searchAddress.split(",")[2].trim();

      const data = {
        name: fullname,
        phone: numberphone,
        country,
        state,
        city,
        district,
        address: detailAddress || address,
        town: "",
        IsDeliveryAddress: defaultCheckRef.current.checked,
        IsPickupAddress: pickupCheckRef.current.checked,
        IsReturnAddress: returnCheckRef.current.checked,
      }

      await postUserAddress(`/Address/post/${userLogin.id}`, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      dispatch(saveUserAddress(!isFetching));
      defaultCheckRef.current.checked = false;
      pickupCheckRef.current.checked = false;
      returnCheckRef.current.checked = false;
      addressPlaceholderRef.current.innerHTML = "Tỉnh/ Thành phố, Quận/Huyện, Phường/Xã";
      setDetailAddress("");
      setSearchAddress("");
      setFullname("");
      setNumberphone("");
      onHideModal();

    } catch (error) {
      console.log(error);
    }
  }

  const handleUpdateAddress = async (addressId) => {
    try {
      const localAddress = JSON.parse(localStorage.getItem("address")).split(",");
      const country = "Việt Nam";
      const state = searchAddress.split(",")[0].trim();
      const city = searchAddress.split(",")[1].trim();
      const district = searchAddress.split(",")[2].trim();

      const data = {
        name: fullname,
        phone: numberphone,
        country,
        state,
        city,
        district,
        address: localAddress[0].trim() || detailAddress,
        town: "",
        IsDeliveryAddress: defaultCheckRef.current.checked,
        IsPickupAddress: pickupCheckRef.current.checked,
        IsReturnAddress: returnCheckRef.current.checked,
      }

      await updateUserAddress(`/Address/update/${addressId}`, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      dispatch(saveUserAddress(!isFetching));
      defaultCheckRef.current.checked = false;
      pickupCheckRef.current.checked = false;
      returnCheckRef.current.checked = false;
      addressPlaceholderRef.current.innerHTML = "Tỉnh/ Thành phố, Quận/Huyện, Phường/Xã";
      setDetailAddress("");
      setSearchAddress("");
      setFullname("");
      setNumberphone("");
      onHideModal();

    } catch (error) {
      console.log(error);
    }
  }

  const handleClearInput = () => {
    setSearchAddress("");
    setDetailAddress("");
    setDistricts([]);
    setWards([]);
    setTabActive("province");
  }

  const validatePhoneNumber = (phone) => {
    const regexPhoneNumber = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;
    return phone.match(regexPhoneNumber) ? true : false;
  }

  // useEffect(() => {
  //   const script = document.createElement('script');

  //   window.initMap = initMap

  //   script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyCn5pK0jhrg1b28rR-J_PpIxrZGejuRIQU&callback=initMap&libraries=places&v=weekly&solution_channel=GMP_CCS_autocomplete_v1";
  //   script.async = true;

  //   document.body.appendChild(script);

  //   return () => {
  //     document.body.removeChild(script);
  //   }
  // }, []);

  useEffect(() => {
    const autocomplete = new GeocoderAutocomplete(
      document.getElementById("autocomplete"),
      import.meta.env.VITE_ECOMMERCE_GEOAPIFY_APIKEY,
      {
        placeholder: "Enter your address",
        lang: 'vi'
      });
    autocomplete.setValue(detailAddress || "");
    autocomplete.on('select', (location) => {
      autocomplete.setValue(location?.properties?.address_line1?.split(",")[0] || "");
      handleMapAddressChange(location?.properties?.address_line1?.split(",")[0]);
      setAddress(location?.properties?.name)
      setCoordinates([
        location?.properties?.lat || 10.7514687,
        location?.properties?.lon || 106.6946574,
      ])
    });

    //autocomplete.on('suggestions', (suggestions) => {
    //});
  }, [])

  useEffect(() => {
    fullnameInputRef.current.focus();
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

  useEffect(() => {
    const handleAddressChange = () => {
      const addressChange = JSON.parse(localStorage.getItem("address"));
      setDetailAddress(addressChange);
    }
    localStorage.setItem("address", JSON.stringify(`${data?.district}, ${data?.city}, ${data?.state}, ${data?.country}`));
    window.addEventListener("AddressDataEvent", handleAddressChange);

    defaultCheckRef.current.checked = data?.isDeliveryAddress;
    pickupCheckRef.current.checked = data?.isPickupAddress;
    returnCheckRef.current.checked = data?.isReturnAddress;

    return () => {
      window.removeEventListener("AddressDataEvent", handleAddressChange)
    }
  }, [])

  const handleClickProvinceHeader = () => {
    setTabActive("province");
  };

  const fetchDistrict = async (addressArr, setState = true) => {
    const currentProvince = provinces.find(p => p.ProvinceName.toLowerCase() == addressArr[0].trim().toLowerCase());

    try {
      const response = await getAddress("/district", {
        params: {
          province_id: currentProvince?.ProvinceID
        }
      });
      setState && setDistricts(response.data);
      return response.data;
    }
    catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const fetchWard = async (addressArr, listDistrict = []) => {
    const currentDistrict = listDistrict.length ? listDistrict.find(d => d.DistrictName.toLowerCase() == addressArr[1].trim().toLowerCase()) : districts.find(d => d.DistrictName.toLowerCase() == addressArr[1].trim().toLowerCase());

    try {
      const response = await getAddress("/ward", {
        params: {
          district_id: currentDistrict.DistrictID
        }
      });
      setWards(response.data);
    }
    catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const handleClickDistrictHeader = async () => {
    const addressArr = searchAddress.split(",");
    if (districts.length || addressArr.length >= 2) {
      setTabActive("district");
      if (!districts.length) {
        await fetchDistrict(addressArr);
      }
    }
  };

  const handleClickWardHeader = async () => {
    const addressArr = searchAddress.split(",");
    if (wards.length || addressArr.length >= 3) {
      setTabActive("ward");
      let listDistrict = [];
      if (!districts.length) {
        listDistrict = await fetchDistrict(addressArr, false);
      }
      if (!wards.length) {
        await fetchWard(addressArr, listDistrict);
        setDistricts(listDistrict)
      }
    }
  };

  const handleValidateFullname = () => {
    if (!fullname || !(fullname.split(" ").length >= 2) || (fullname.split(" ")[1] === "")) {
      alertFullnameRef.current.style.display = "block";
      wrapperNameRef.current.style.border = "1px solid var(--primary)";
      labelFullnameRef.current.style.color = "var(--primary)";
    }
  }

  const handleRevalidateFullname = () => {
    labelFullnameRef.current.style.color = "unset";
    alertFullnameRef.current.style.display = "none";
    wrapperNameRef.current.style.border = "1px solid rgba(0, 0, 0, 0.14)";
  }

  const handleValidateNumberphone = () => {
    if (!numberphone || !validatePhoneNumber(numberphone)) {
      alertNumberphoneRef.current.style.display = "block";
      wrapperPhoneRef.current.style.border = "1px solid var(--primary)";
      labelNumberphoneRef.current.style.color = "var(--primary)";
    }
  }

  const handleRevalidateNumberphone = () => {
    labelNumberphoneRef.current.style.color = "unset";
    alertNumberphoneRef.current.style.display = "none";
    wrapperPhoneRef.current.style.border = "1px solid rgba(0, 0, 0, 0.14)";
  }

  const handleFullnameChange = (e) => {
    if (e.target.value) {
      labelFullnameRef.current.style.display = "block";
    }
    else {
      labelFullnameRef.current.style.display = "none";
    }
    setFullname(e.target.value)
  }

  const handleMapAddressChange = (addressDetail) => {
    localStorage.setItem("address", JSON.stringify(addressDetail));
  }
  const handleCheckDefault = () => {
    return listAddress.some(p => p.isDeliveryAddress);
  }

  return (
    <div className={cx("modal-mask")}>
      <div className={cx("modal-address-container")}>
        <p>{!data ? "New Address" : "Update Address"}</p>
        <form>
          <div className={cx("form-container")}>
            <div className={cx("form-info")}>
              <div className={cx("person-info")}>
                <div ref={wrapperNameRef}>
                  <div className={cx("label")} ref={labelFullnameRef}>Full Name</div>
                  <input
                    ref={fullnameInputRef}
                    type="text"
                    placeholder="Full Name"
                    onChange={(e) => handleFullnameChange(e)}
                    value={fullname}
                    onBlur={handleValidateFullname}
                    onFocus={handleRevalidateFullname}
                  />
                  <span ref={alertFullnameRef} className={cx("alert")} role="alert">Vui lòng điền Họ &amp; Tên</span>
                </div>
                <div ref={wrapperPhoneRef}>
                  <div className={cx("label")} ref={labelNumberphoneRef}>Number Phone</div>
                  <input
                    type="text"
                    placeholder="Number Phone"
                    onChange={(e) => {
                      if (e.target.value) {
                        labelNumberphoneRef.current.style.display = "block";
                      } else {
                        labelNumberphoneRef.current.style.display = "none";
                      }
                      setNumberphone(e.target.value)
                    }}
                    value={numberphone}
                    onFocus={handleRevalidateNumberphone}
                    onBlur={handleValidateNumberphone}
                  />
                  <span ref={alertNumberphoneRef} className={cx("alert")} role="alert">Số điện thoại không hợp lệ</span>
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
                          setDetailAddress("");
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
                        cursor: !districts?.length && searchAddress.split(",").length < 2 ? "not-allowed" : "pointer"
                      }}
                    >
                      Quận/Huyện
                    </span>
                    <span
                      onClick={handleClickWardHeader}
                      style={{
                        cursor: !wards?.length && searchAddress.split(",").length < 3 ? "not-allowed" : "pointer"
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
                  <div className={cx("address-list")} ref={addressWrapperRef}>
                    {!districts?.length || tabActive === "province" ? provinces?.map(province => (
                      <div key={province.ProvinceID} className={cx("address-item", {
                        "selected": searchAddress.toLowerCase().includes(province.ProvinceName.toLowerCase())
                      })} onClick={() => handleChooseProvince(province.ProvinceID, province.ProvinceName)}>{province.ProvinceName}</div>
                    )) :
                      !wards.length || tabActive === "district" ?
                        districts?.map(district => (
                          <div key={district.DistrictID} className={cx("address-item", {
                            "selected": searchAddress.toLowerCase().includes(district.DistrictName.toLowerCase())
                          })} onClick={() => handleChooseDistrict(district.DistrictID, district.DistrictName)}>{district.DistrictName}</div>
                        ))
                        : wards?.map(ward => (
                          <div key={ward.WardName} className={cx("address-item", {
                            "selected": searchAddress.toLowerCase().includes(ward.WardName.toLowerCase())
                          })} onClick={() => handleChooseWard(ward.WardName)}>{ward.WardName}</div>
                        ))
                    }
                  </div>
                </div>
              </div>
              <div className={cx("address-detail")}>
                {/* <input id="pac-input" className={cx("address-detail-area")} placeholder="Address Detail" autoComplete="user-street-address" disabled={searchAddress.split(",").length < 3 && !detailAddress}
                  onChange={handleMapAddressChange}
                  value={detailAddress}
                /> */}
                <div id="autocomplete" className={cx("autocomplete-container")}></div>
              </div>
              <div className={cx("map-wrapper")}>
                {/* <div className={cx("not-allowed")}>
                  <div id="map" className={cx("map")}></div>
                  <div id="infowindow-content">
                    <span id="place-address"></span>
                  </div>
                </div> */}
                <Map coordinates={coordinates} address={address} />
              </div>
              <div className={cx("address-options")}>
                <label className={cx("address-default")}>
                  <input className={cx("address-check")} type="checkbox" role="checkbox" aria-checked="false" aria-disabled="false" ref={defaultCheckRef} disabled={handleCheckDefault()} checked={!listAddress.length || data?.IsDeliveryAddress} style={{
                    opacity: !listAddress.length || data?.IsDeliveryAddress ? 0.5 : 1
                  }} />
                  <span>Đặt làm địa chỉ mặc đinh</span>
                </label>
                <label className={cx("address-get")}>
                  <input className={cx("address-check")} type="checkbox" role="checkbox" aria-checked="false" aria-disabled="false" ref={pickupCheckRef} />
                  <span>Đặt làm địa chỉ lấy hàng</span>
                </label>
                <label className={cx("address-return")}>
                  <input className={cx("address-check")} type="checkbox" role="checkbox" aria-checked="false" aria-disabled="false" ref={returnCheckRef} />
                  <span>Đặt làm địa chỉ trả hàng</span>
                </label>
              </div>
            </div>
            <div className={cx("form-action")}>
              <Button type="button" onClick={onHideModal}>Cancel</Button>
              <Button type="button" disable={searchAddress.split(",").length < 3 || !fullname || !numberphone || !validatePhoneNumber(numberphone) || (!detailAddress && !address)} onClick={!data ? handleSaveAddress : () => { handleUpdateAddress(data.id) }}>Save Changes</Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
};

export default ModalAddress;
