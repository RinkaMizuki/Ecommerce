import { createContext } from 'react';
import useModal from '../hooks/useModal';
import ModalAddress from '../modals/ModalAddress';
import ModalConfirm from "../modals/ModalConfirm"
import ModalReview from '../modals/ModalReview';

export const ModalContext = createContext();

function ModalContextProvider({ children }) {
  const [FormAddressModalComponent, handleShowModalFormAddress] = useModal(ModalAddress);
  const [ConfirmModalComponent, handleShowModalConfirm] = useModal(ModalConfirm);
  const [ReviewModalComponent, handleShowModalReview] = useModal(ModalReview);
  return (
    <ModalContext.Provider value={{ handleShowModalFormAddress, handleShowModalConfirm, handleShowModalReview }}>
      {children}
      <FormAddressModalComponent />
      <ConfirmModalComponent />
      <ReviewModalComponent />
    </ModalContext.Provider>
  );
}
export default ModalContextProvider;
