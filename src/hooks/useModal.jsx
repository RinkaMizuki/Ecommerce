import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch } from 'react-redux';

const useModal = (Modal) => {
  const [isShowing, setIsShowing] = useState(false);
  const dispatch = useDispatch();

  const handleHideModalForm = () => {
    setIsShowing(false);
  };
  const handleShowModalForm = () => {
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