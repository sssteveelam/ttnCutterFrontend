"use client";
import { useState } from "react";
import Image from "next/image";

import DownloadModule from "../components/DownloadModule";
import CutModule from "../components/CutModule";
import LogsPage from "./logs/page";

const ScissorsIcon = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}>
    <path
      fillRule="evenodd"
      d="M5.478 5.478a.75.75 0 0 1 1.06 0l1.322 1.321-.401-.077c-.504-.097-.98-.235-1.424-.413A5.987 5.987 0 0 1 3.75 7.5c0-.98.243-1.902.67-2.732.178-.444.316-.92.413-1.424l.077-.401 1.322 1.322ZM12 2.25a.75.75 0 0 1 .75.75v6.75a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM15 7.5a.75.75 0 0 1 .75-.75H18a3 3 0 0 1 3 3v.75a.75.75 0 0 1-1.5 0V10.5h-1.895a5.987 5.987 0 0 1-1.424-.413c-.47-.194-.928-.42-1.353-.679L15 7.5Zm-9.75 4.5a.75.75 0 0 1 .75-.75h2.25a.75.75 0 0 1 0 1.5H6a.75.75 0 0 1-.75-.75ZM18 13.5a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 0 1.5h-.75a.75.75 0 0 1-.75-.75ZM12 15a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0v-3.75a.75.75 0 0 1 .75-.75ZM5.478 18.522a.75.75 0 0 1-1.06 0l-1.322-1.321c.097-.504.235-.98.413-1.424A5.987 5.987 0 0 1 6.75 16.5c.98 0 1.902.243 2.732.67.444.178.92.316 1.424.413l.401.077-1.322 1.322a.75.75 0 0 1 0 1.06Z"
      clipRule="evenodd"
    />
  </svg>
);

const ListIcon = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}>
    <path
      fillRule="evenodd"
      d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z"
      clipRule="evenodd"
    />
  </svg>
);

export default function HomePage() {
  return (
    <main className=" bg-gray-50  sm:p-10 flex flex-col items-center font-sans text-gray-800">
      <div className="w-full  ">
        {/* Download Section */}
        <section className=" p-6 sm:p-8 rounded-2xl ">
          <DownloadModule />
        </section>
      </div>
    </main>
  );
}
