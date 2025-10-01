"use client";
import { useState } from "react";
import Image from "next/image";

import DownloadModule from "../components/DownloadModule";
import CutModule from "../components/CutModule";
import LogsPage from "./logs/page";
import Sidebar from "@/components/Sidebar";
import ListIcon from "@/components/Icons";
import FacebookModule from "@/components/FacebookModule";
import YoutubeModule from "@/components/YoutubeModule";
import TiktokModule from "@/components/TiktokModule";

export default function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [selectedModule, setSelectedModule] = useState<string>("youtube");

  const renderModule = () => {
    switch (selectedModule) {
      case "youtube":
        return <YoutubeModule />;

      case "facebook":
        return <FacebookModule />;

      case "tiktok":
        return <TiktokModule />;
      case "cut":
        return <CutModule />;
      case "logs":
        return <LogsPage />;

      default:
        return (
          <div className="p-8 text-center text-gray-500">
            <p>🚧 Tính năng {selectedModule} đang phát triển...</p>
          </div>
        );
    }
  };

  return (
    <main className="relative bg-gray-50 min-h-screen sm:p-10 font-sans text-gray-800">
      {/* on off sidebar */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed top-4 left-4 z-50 p-2 bg-white shadow-md rounded-full hover:bg-gray-100">
        <svg
          className="w-[40px] h-[40px] text-gray-800 dark:text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="none"
          viewBox="0 0 24 24">
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.1"
            d="M5 7h14M5 12h14M5 17h14"
          />
        </svg>
      </button>

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNavigate={(key) => {
          setSelectedModule(key);
          setSidebarOpen(false);
        }}
      />

      {/* main  */}
      <div className="max-w-6xl mx-auto pt-16">{renderModule()}</div>
    </main>
  );
}
