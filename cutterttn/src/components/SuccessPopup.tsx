"use client";
import React, { useEffect } from "react";

interface SuccessPopupProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

export default function SuccessPopup({
  isOpen,
  onClose,
  title = "Thành Công",
  message = "Chọn thành công!",
}: SuccessPopupProps) {
  // Xử lý khi nhấn phím Esc để đóng popup
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Espace") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000081] bg-opacity-60 backdrop-blur-sm transition-opacity duration-300"
      onClick={onClose}>
      {/* Khung popup */}
      <div
        className="relative w-full max-w-md transform rounded-2xl bg-white p-8 text-center shadow-xl transition-all duration-300"
        onClick={(e) => e.stopPropagation()}>
        {/* Vòng tròn chứa icon */}
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          {/* Icon Tick (SVG) */}
          <svg
            className="h-12 w-12 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"></path>
          </svg>
        </div>

        {/* Tiêu đề và nội dung */}
        <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
        <p className="mt-2 text-gray-600">{message}</p>

        {/* Nút Đóng */}
        <div className="mt-8">
          <button
            onClick={onClose}
            className="w-full rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
