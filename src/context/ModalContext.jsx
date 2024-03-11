import { createContext } from 'react';
import useModal from '../hooks/useModal';
import FormModal from '../modals/FormModal';

export const ModalContext = createContext();

function ModalContextProvider({ children }) {
  const [FormAddressModalComponent, handleShowModalFormAddress] = useModal(FormModal);

  return (
    <ModalContext.Provider value={{ handleShowModalFormAddress }}>
      {children}
      <FormAddressModalComponent />
    </ModalContext.Provider>
  );
}
export default ModalContextProvider;
