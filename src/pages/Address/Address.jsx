import classNames from "classnames/bind";
import styles from "./Address.module.scss";
import Button from "../../components/Button";
import AddIcon from '@mui/icons-material/Add';
import { useContext, useEffect, useState } from "react";
import { ModalContext } from "../../context/ModalContext";
import { useDispatch, useSelector } from "react-redux";
import AddressItem from "./AddressItem";
import { getListUserAddress } from "../../services/userAddressServcice";
import { listUserAddress } from "../../redux/addressSlice";
import { useLocation } from "react-router-dom";

const cx = classNames.bind(styles)

const Address = () => {

  const { handleShowModalFormAddress, handleShowModalConfirm } = useContext(ModalContext);
  const [listAddress, setListAddress] = useState([]);
  const isFetching = useSelector(state => state.address.isFetching);
  const userLogin = useSelector(state => state.auth.login.currentUser.user);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getListUserAddress(`/Address/${userLogin.id}`);
        setListAddress(response.data);
        dispatch(listUserAddress(response.data));
      }
      catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [isFetching])

  useEffect(() => {
    if (location?.state?.clicked) {
      handleShowModalFormAddress(null)
    }
  }, [])

  useEffect(() => {
    window.scrollTo({
      behavior: "smooth",
      top: 0,
    })
  }, []);


  return (
    <div className={cx("address-container")}>
      <div className={cx("address-header")}>
        <p className={cx("address-title")}>
          My Address
        </p>
        <Button className={cx("btn-add")} onClick={() => handleShowModalFormAddress(null)}>
          <AddIcon />
          <span>Add New Address</span>
        </Button>
      </div>
      <div className={cx("address-content")}>
        {listAddress.length ? listAddress?.map((address) => (
          <AddressItem addressItem={address} key={address.id} onShowModalAddress={handleShowModalFormAddress} onShowModalConfirm={handleShowModalConfirm} />
        )) : <div className={cx("not-address")}>
          <svg fill="none" viewBox="0 0 121 120" ><path d="M16 79.5h19.5M43 57.5l-2 19" stroke="#BDBDBD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path><path d="M56.995 78.791v-.001L41.2 38.195c-2.305-5.916-2.371-12.709.44-18.236 1.576-3.095 4.06-6.058 7.977-8 5.061-2.5 11.038-2.58 16.272-.393 3.356 1.41 7 3.92 9.433 8.43v.002c2.837 5.248 2.755 11.853.602 17.603L60.503 78.766v.001c-.617 1.636-2.88 1.643-3.508.024Z" fill="#fff" stroke="#BDBDBD" strokeWidth="2"></path><path d="m75.5 58.5 7 52.5M13 93h95.5M40.5 82.5 30.5 93 28 110.5" stroke="#BDBDBD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path><path d="M44.5 79.5c0 .55-.318 1.151-1.038 1.656-.717.502-1.761.844-2.962.844-1.2 0-2.245-.342-2.962-.844-.72-.505-1.038-1.105-1.038-1.656 0-.55.318-1.151 1.038-1.656.717-.502 1.761-.844 2.962-.844 1.2 0 2.245.342 2.962.844.72.505 1.038 1.105 1.038 1.656Z" stroke="#BDBDBD" strokeWidth="2"></path><path fillRule="evenodd" clipRule="evenodd" d="M48.333 68H18.5a1 1 0 1 0 0 2h30.667l-.834-2Zm20.5 2H102a1 1 0 0 0 0-2H69.667l-.834 2Z" fill="#BDBDBD"></path><path d="M82 73h20l3 16H84.5L82 73ZM34.5 97H76l1.5 13H33l1.5-13ZM20.5 58h18l-1 7h-18l1-7Z" fill="#E8E8E8"></path><path clipRule="evenodd" d="M19.5 41a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM102.5 60a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" stroke="#E8E8E8" strokeWidth="2"></path><path fillRule="evenodd" clipRule="evenodd" d="M93.5 22a1 1 0 0 0-1 1v3h-3a1 1 0 1 0 0 2h3v3a1 1 0 1 0 2 0v-3h3a1 1 0 1 0 0-2h-3v-3a1 1 0 0 0-1-1Z" fill="#E8E8E8"></path><circle cx="58.5" cy="27" r="7" stroke="#BDBDBD" strokeWidth="2"></circle></svg>
          <span>You don't have address.</span>
        </div>}
      </div>
    </div>
  )
};

export default Address;
