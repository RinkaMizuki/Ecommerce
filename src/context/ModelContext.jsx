import { createContext } from 'react';
import useModal from '../hooks/useModal';
import FormAddressModal from '../modals/FormAddressModal';

export const ModalContext = createContext();

function ModalContextProvider({ children }) {
  const [FormAddressModalComponent, handleShowModalFormAddress] = useModal(FormAddressModal);

  return (
    <ModalContext.Provider value={{ handleShowModalFormAddress }}>
      {children}
      <FormAddressModalComponent />
    </ModalContext.Provider>
  );
}
export default ModalContextProvider;
