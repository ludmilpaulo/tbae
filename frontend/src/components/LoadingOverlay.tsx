"use client";
import { Transition } from "@headlessui/react";

interface LoadingOverlayProps {
  show: boolean;
}
const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ show }) => (
  <Transition
    show={show}
    enter="transition-opacity duration-300"
    enterFrom="opacity-0"
    enterTo="opacity-100"
    leave="transition-opacity duration-300"
    leaveFrom="opacity-100"
    leaveTo="opacity-0"
  >
    <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
      <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
    </div>
  </Transition>
);

export default LoadingOverlay;
