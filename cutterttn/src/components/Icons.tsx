export default function ListIcon({ props }) {
  return (
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
}

export const LinkIcon = (props) => {
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
    />
  </svg>;
};

export const SpinnerIcon = (props) => {
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    {...props}>
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>;
};

export const VideoIcon = (props) => {
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}>
    <path d="M4.5 4.5a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3v-9a3 3 0 0 0-3-3h-15Zm-1.5 3a1.5 1.5 0 0 1 1.5-1.5h15a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-1.5 1.5h-15a1.5 1.5 0 0 1-1.5-1.5v-9Zm8.25-1.5a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3ZM9 12a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm1.5-1.5a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
  </svg>;
};

export const AudioIcon = (props) => {
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}>
    <path d="M11.25 4.533A9.708 9.708 0 0 0 3.75 3v10.5a3.75 3.75 0 0 0 5.122 3.424A9.72 9.72 0 0 0 11.25 18a9.713 9.713 0 0 0 2.378-.424A3.75 3.75 0 0 0 18.75 13.5V6.311A9.714 9.714 0 0 0 11.25 4.533Z" />
  </svg>;
};

export const FacebookIcon = (props) => {
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}>
    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
  </svg>;
};

export const DownloadIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}>
    <path
      fillRule="evenodd"
      d="M12 2.25a.75.75 0 0 1 .75.75v11.689l3.44-3.328a.75.75 0 1 1 1.026 1.06l-4.5 4.368a.75.75 0 0 1-1.026 0l-4.5-4.368a.75.75 0 1 1 1.026-1.06l3.44 3.328V3a.75.75 0 0 1 .75-.75Zm-9 13.5a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-2.25a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H4.5a3 3 0 0 1-3-3v-2.25a.75.75 0 0 1 .75-.75Z"
      clipRule="evenodd"
    />
  </svg>
);

export const VideoQualityIcon = (props) => (
  <svg
    className="w-7 h-7" // Điều chỉnh kích thước icon cho phù hợp
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
    {...props}>
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5" // Tăng strokeWidth để icon dễ nhìn hơn
      d="M14 6H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1Zm7 11-6-2V9l6-2v10Z"
    />
  </svg>
);

export const AudioQualityIcon = (props) => (
  <svg
    className="w-7 h-7" // Điều chỉnh kích thước icon cho phù hợp
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
    {...props}>
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5" // Tăng strokeWidth để icon dễ nhìn hơn
      d="M17 15.5V5s3 1 3 4m-7-3H4m9 4H4m4 4H4m13 2.4c0 1.326-1.343 2.4-3 2.4s-3-1.075-3-2.4 1.343-2.4 3-2.4 3 1.075 3 2.4Z"
    />
  </svg>
);

export const YoutubeIcon = (props) => (
  <svg
    className="h-10 w-auto sm:h-12 text-[#FF0000]" // Kích thước logo responsive
    viewBox="0 0 120 84"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <path d="M117.5 13.1C116 7.6 111.5 3.1 106.1 1.6C96.8 0 60 0 60 0C60 0 23.2 0 13.9 1.6C8.5 3.1 4 7.6 2.5 13.1C0 22.4 0 42 0 42C0 42 0 61.6 2.5 70.9C4 76.4 8.5 80.9 13.9 82.4C23.2 84 60 84 60 84C60 84 96.8 84 106.1 82.4C111.5 80.9 116 76.4 117.5 70.9C120 61.6 120 42 120 42C120 42 120 22.4 117.5 13.1Z" />
    <path d="M48 60L79.5 42L48 24V60Z" fill="white" />
  </svg>
);
