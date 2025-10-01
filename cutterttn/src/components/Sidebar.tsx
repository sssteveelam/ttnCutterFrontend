"use client";
import React from "react";
// Import thêm icon cho nút đóng và các icon mạng xã hội
import { FaYoutube, FaFacebook, FaTiktok, FaCut, FaList } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

// Thêm prop `activeKey` để biết mục nào đang được chọn
export default function Sidebar({ isOpen, onClose, onNavigate, activeKey }) {
  const links = [
    // Thêm màu sắc đặc trưng cho các icon để sinh động hơn
    {
      icon: <FaYoutube className="text-red-500" />,
      label: "YouTube",
      key: "youtube",
    },
    { icon: <FaTiktok />, label: "TikTok", key: "tiktok" },
    {
      icon: <FaFacebook className="text-blue-600" />,
      label: "Facebook",
      key: "facebook",
    },
    { icon: <FaCut />, label: "Cắt video", key: "cut" },
    { icon: <FaList />, label: "Nhật ký", key: "logs" },
  ];

  return (
    // Sử dụng React Fragment để chứa cả Sidebar và lớp phủ overlay
    <>
      {/* Container chính của Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 shadow-xl z-50 
                   transform transition-transform duration-300 ease-in-out
                   ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        {/* Phần Header của Sidebar */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">🎬 Menu</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors"
            aria-label="Đóng menu">
            <IoClose size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Danh sách các liên kết điều hướng */}
        <nav className="flex flex-col space-y-2 p-4">
          {links.map((link) => {
            const isActive = link.key === activeKey;
            return (
              <button
                key={link.key}
                onClick={() => onNavigate(link.key)}
                className={`flex items-center space-x-4 text-left px-4 py-3 rounded-lg transition-all duration-200
                  ${
                    isActive
                      ? "bg-blue-600 text-white font-semibold shadow-md" // Style khi active
                      : "text-gray-700 hover:bg-gray-100" // Style mặc định
                  }
                `}>
                <span className={isActive ? "text-white" : "text-gray-500"}>
                  {link.icon}
                </span>
                <span>{link.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Phần Footer (Tùy chọn) */}
        <div className="absolute bottom-0 left-0 w-full p-4 border-t border-gray-200">
          <p className="text-xs text-center text-gray-500">© 2025 Your App</p>
        </div>
      </aside>

      {/* Lớp phủ (Overlay) làm mờ nền khi sidebar mở */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}
    </>
  );
}
