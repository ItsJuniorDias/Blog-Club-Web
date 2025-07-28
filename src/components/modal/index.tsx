import "./styles.css";

import { IoIosClose } from "react-icons/io";
import { FaCircleCheck } from "react-icons/fa6";

import success from "../../assets/success.svg";

export default function Modal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <IoIosClose className="w-10 h-10" />
        </button>

        <div className="w-full flex items-center justify-center pt-5 pb-5">
          <FaCircleCheck color="#4bae4f" className="w-13 h-13" />
        </div>

        <h2 className="text-xl font-bold text-center mb-2">
          Thanks for contacting us!
        </h2>
        <p className="text-center text-gray-600">
          We will return your message shortly.
        </p>

        <button
          onClick={onClose}
          className="mt-4 w-full bg-[#376AED] text-white py-2 rounded-2xl"
        >
          OK
        </button>
      </div>
    </div>
  );
}
