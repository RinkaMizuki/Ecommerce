import { createContext } from 'react';
import useModal from '../hooks/useModal';
import ModalAddress from '../modals/ModalAddress';
import ModalConfirm from "../modals/ModalConfirm"

export const ModalContext = createContext();

function ModalContextProvider({ children }) {
  const [FormAddressModalComponent, handleShowModalFormAddress] = useModal(ModalAddress);
  const [ConfirmModalComponent, handleShowModalConfirm] = useModal(ModalConfirm);
  return (
    <ModalContext.Provider value={{ handleShowModalFormAddress, handleShowModalConfirm }}>
      {children}
      <FormAddressModalComponent />
      <ConfirmModalComponent />
    </ModalContext.Provider>
  );
}
export default ModalContextProvider;
