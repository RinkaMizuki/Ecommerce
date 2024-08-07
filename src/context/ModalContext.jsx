import { createContext } from "react";
import useModal from "../hooks/useModal";
import ModalAddress from "../modals/ModalAddress";
import ModalConfirm from "../modals/ModalConfirm";
import ModalReview from "../modals/ModalReview";
import ModalDelivery from "../modals/ModalDelivery";
import ModalStrange from "../modals/ModalStrange/ModalStrange";

export const ModalContext = createContext();

function ModalContextProvider({ children }) {
    const [FormAddressModalComponent, handleShowModalFormAddress] =
        useModal(ModalAddress);
    const [ConfirmModalComponent, handleShowModalConfirm] =
        useModal(ModalConfirm);
    const [ReviewModalComponent, handleShowModalReview] = useModal(ModalReview);
    const [DeliveryModalComponent, handleShowModalDelivery] =
        useModal(ModalDelivery);
    const [StrangeModalComponent, handleShowModalStrange] =
        useModal(ModalStrange);

    return (
        <ModalContext.Provider
            value={{
                handleShowModalFormAddress,
                handleShowModalConfirm,
                handleShowModalReview,
                handleShowModalDelivery,
                handleShowModalStrange,
            }}
        >
            {children}
            <FormAddressModalComponent />
            <ConfirmModalComponent />
            <ReviewModalComponent />
            <DeliveryModalComponent />
            <StrangeModalComponent />
        </ModalContext.Provider>
    );
}
export default ModalContextProvider;
