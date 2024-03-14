import { useState } from 'react';
import { createPortal } from 'react-dom';

const useModal = (Modal) => {
  const [isShowing, setIsShowing] = useState(false);
  const [addressData, setAddressData] = useState(null);

  const handleHideModalForm = () => {
    setIsShowing(false);
    document.body.style.height = "unset";
    document.body.style.overflow = "unset";
  };
  const handleShowModalForm = (addressData) => {
    document.body.style.height = "100%";
    document.body.style.overflow = "hidden";
    setIsShowing(true);
    setAddressData(addressData);
  };

  const ModalComponent = () => {
    return isShowing ? (
      createPortal(<Modal isShowing={isShowing} onHideModal={handleHideModalForm} addressData={addressData} />, document.body)
    ) : (
      <></>
    );
  };
  return [ModalComponent, handleShowModalForm];
};

export default useModal;