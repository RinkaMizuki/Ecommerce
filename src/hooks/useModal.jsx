import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch } from 'react-redux';

const useModal = (Modal) => {
  const [isShowing, setIsShowing] = useState(false);
  const dispatch = useDispatch();

  const handleHideModalForm = () => {
    setIsShowing(false);
    document.body.style.height = "unset";
    document.body.style.overflow = "unset";
  };
  const handleShowModalForm = () => {
    document.body.style.height = "100%";
    document.body.style.overflow = "hidden";
    setIsShowing(true);
  };

  const ModalComponent = () => {
    return isShowing ? (
      createPortal(<Modal isShowing={isShowing} onHideModal={handleHideModalForm} />, document.body)
    ) : (
      <></>
    );
  };
  return [ModalComponent, handleShowModalForm];
};

export default useModal;