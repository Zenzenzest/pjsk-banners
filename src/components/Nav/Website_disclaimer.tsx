import { useTheme } from "../../context/Theme_toggle";

export default function WebsiteDisclaimer() {
  const { theme } = useTheme();

  return (
    <div
      className={`w-full mx-auto p-4 pb-15 ${
        theme == "dark"
          ? "bg-[#101828] text-gray-300"
          : "bg-[#f9fafb] text-gray-800"
      } shadow-sm`}
    >
      <div className="flex items-start max-w-3xl mx-auto gap-4">
      
        <svg
          className="w-6 h-6 flex-shrink-0 text-amber-500 mt-0.5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
            clipRule="evenodd"
          />
        </svg>

        <div className="w-full">
          <h2 className="text-xl font-bold text-blue-400 mb-3">Disclaimer</h2>

          <div className="space-y-3">
            <p>
              This is an independently created fanmade database intended solely
              for reference purpose and has no official affiliation with Sega,
              Colorful Palette, or any related entities. All referenced
              trademarks are property of their owners.
            </p>
          </div>
        {/* SOCIAL */}
          <div
            className={`mt-4 pt-4 border-t ${
              theme == "dark" ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <div className="flex gap-4">
              {/* DISCORD*/}
              <div className="flex">
                <svg
                  className="w-5 h-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M14.82 4.26a10.14 10.14 0 0 0-.53 1.1 14.66 14.66 0 0 0-4.58 0 10.14 10.14 0 0 0-.53-1.1 16 16 0 0 0-4.13 1.3 17.33 17.33 0 0 0-3 11.59 16.6 16.6 0 0 0 5.07 2.59A12.89 12.89 0 0 0 8.23 18a9.65 9.65 0 0 1-1.71-.83 3.39 3.39 0 0 0 .42-.33 11.66 11.66 0 0 0 10.12 0q.21.18.42.33a10.84 10.84 0 0 1-1.71.84 12.41 12.41 0 0 0 1.08 1.78 16.44 16.44 0 0 0 5.06-2.59 17.22 17.22 0 0 0-3-11.59 16.09 16.09 0 0 0-4.09-1.35zM8.68 14.81a1.94 1.94 0 0 1-1.8-2 1.93 1.93 0 0 1 1.8-2 1.93 1.93 0 0 1 1.8 2 1.93 1.93 0 0 1-1.8 2zm6.64 0a1.94 1.94 0 0 1-1.8-2 1.93 1.93 0 0 1 1.8-2 1.92 1.92 0 0 1 1.8 2 1.92 1.92 0 0 1-1.8 2z" />
                </svg>
                <span className="text-sm">zest3429</span>
              </div>
              {/* TWITTER*/}
              <a
                href="https://twitter.com/azuriyale"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <svg
                  className="w-5 h-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span className="text-sm">@azuriyale</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
