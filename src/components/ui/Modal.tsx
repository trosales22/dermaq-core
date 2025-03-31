import React, { useRef, useEffect } from "react";

interface ModalProps {
  id: string;
  title: string;
  children: React.ReactNode;
  closeButton?: boolean;
  closeOnBackdrop?: boolean;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "full";
  responsive?: boolean;
  isOpen: boolean;
  onClose: () => void;
  headerColor?: "blue" | "red" | "green" | "gray" | "orange";
}

const Modal: React.FC<ModalProps> = ({
  id,
  title,
  children,
  closeButton = true,
  closeOnBackdrop = true,
  size = "md",
  responsive = false,
  isOpen,
  onClose,
  headerColor = "gray",
}) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isOpen) {
      modalRef.current?.showModal();
    } else {
      modalRef.current?.close();
    }
  }, [isOpen]);

  // New useEffect to handle Escape key or other close actions
  useEffect(() => {
    const handleModalClose = () => {
      if (modalRef.current && !modalRef.current.open) {
        onClose();
      }
    };

    const modalElement = modalRef.current;
    modalElement?.addEventListener("close", handleModalClose);

    return () => modalElement?.removeEventListener("close", handleModalClose);
  }, [onClose]);

  // Define header colors
  const headerBgColor = {
    blue: "bg-blue-500 text-white",
    red: "bg-red-500 text-white",
    green: "bg-green-500 text-white",
    gray: "bg-gray-200 text-gray-900",
    orange: "bg-orange-400 text-white"
  }[headerColor];

  // Define width classes based on size
  const widthClass = {
    'sm': "max-w-sm",
    'md': "max-w-md",
    'lg': "max-w-lg",
    'xl': "max-w-2xl",
    '2xl': "max-w-3xl",
    '3xl': "max-w-4xl",
    '4xl': "max-w-5xl",
    '5xl': "max-w-6xl",
    '6xl': "max-w-7xl",
    'full': "w-full"
  }[size];

  return (
    <dialog
      id={id}
      ref={modalRef}
      className={`modal ${responsive ? "modal-bottom sm:modal-middle" : ""}`}
    >
      <div className={`modal-box ${widthClass} p-0 overflow-hidden`}>
        <div className={`p-4 ${headerBgColor} flex justify-between items-center`}>
          <h3 className="font-bold text-lg">{title}</h3>
          {closeButton && (
            <button className="btn btn-sm btn-circle btn-ghost text-white" onClick={onClose}>
              ✕
            </button>
          )}
        </div>

        <div className="p-4">{children}</div>
      </div>

      {closeOnBackdrop && (
        <form method="dialog" className="modal-backdrop" onClick={onClose}>
          <button>Close</button>
        </form>
      )}
    </dialog>
  );
};

export default Modal;
