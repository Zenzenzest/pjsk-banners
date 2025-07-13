import { useTheme } from "../../context/Theme_toggle";
export default function WebsiteDisclaimer() {
  const { theme } = useTheme();
  return (
    <div
      className={`max-w-3xl mx-auto p-4 pb-15 ${
        theme == "dark"
          ? "bg-[#101828]  text-gray-300"
          : "bg-[#f9fafb]  text-gray-800"
      }  shadow-sm`}
    >
      <div className="flex items-start gap-4">
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

        <div>
          <h2 className="text-xl font-bold text-blue-400 mb-3">Disclaimer</h2>

          <div className={`space-y-3 `}>
            <p>
              This is an independently created fanmade database intended solely
              for reference purpose and has no official affiliation with Sega,
              Colorful Palette, or any related entities. All referenced
              trademarks are property of their owners.
            </p>
          </div>

          {/* <div className="mt-4 pt-3 border-t border-amber-100 text-sm text-gray-600">
              <p>
                For inquiries:{" "}
                <a
                  href="mailto:contact@example.com"
                  className="text-amber-600 hover:underline"
                >
                  placeholder@gmail.com
                </a>
              </p>
            </div> */}
        </div>
      </div>
    </div>
  );
}
