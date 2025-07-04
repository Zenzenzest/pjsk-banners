import { useTheme } from "../../context/Theme_toggle";
import type { CardModalProps } from "./types";
import LoadingComponent from "../Global/Loading";
export default function CardModal({
  isOpen,
  onClose,
  cardId,
  rarity,
  isLoading,
  setIsLoading,
  isLoading2,
  setIsLoading2,
 name,
  cardName,
  cardAttribute,
  sekaiId,
}: CardModalProps) {
  const { theme } = useTheme();

  const imageHost = "https://r2-image-proxy.zenzenzest.workers.dev/";
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs m-2"
      onClick={onClose} // Close modal when clicking outside
    >
      {/* Overlay */}
      <div className="absolute inset-0  bg-opacity-50"></div>

      {/* Modal Content */}
      <div
        className={`${
          theme === "light" ? "bg-bg-light-mode2" : "bg-bg-dark-mode"
        } p-6 rounded-lg shadow-lg border border-gray-300 relative z-10`}
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside the modal from closing it
      >
        <div className="flex flex-col justify-center items-center">
          <div
            className={`flex flex-row justify-center items-center gap-3 ${
              theme === "light" ? "text-text-light-mode" : "text-text-dark-mode"
            } text-md font-semibold mb-2 tracking-[3px]`}
          >
            {/* CARD ATTRIBUTE */}
            <div>
              <img
                src={`/images/attribute_icons/${cardAttribute}.webp`}
                style={{
                  width: "2rem",
                }}
              />
            </div>
            {/* CHARACTER NAME */}
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold font-serif tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
               
                <span className="whitespace-nowrap">{name}</span>
              </h2>
            </div>
          </div>{" "}
          {/* CARD NAME */}
          <div className="w-full text-md italic text-center mb-2 ">
            {cardName}
          </div>
        </div>

        {/* CARDS */}
        <div className="relative">
          {/* BDAY CARD */}
          {rarity === 5 && (
            <div className="flex flex-col justify-center items-center gap-5 mb-3 relative">
              {" "}
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center  z-10 h-15">
                  <LoadingComponent />
                </div>
              )}
              <img
                src={`${imageHost}${cardId}_bd.webp`}
                style={{
                  maxWidth: "500px",
                  height: "auto",
                }}
                onLoad={() => setIsLoading(false)}
                className="w-full transition-opacity duration-300"
              />
              {/* RARITY ICON */}
              <img
                src="/images/rarity_icons/bday.png"
                style={{
                  position: "absolute",
                  bottom: 5,
                  left: 5,
                  width: "2rem",
                }}
              />
            </div>
          )}
          {/* 3 & 4 CARD */}
          {(rarity === 3 || rarity === 4) && (
            <div className="flex flex-col justify-center items-center gap-5 mb-3">
              {" "}
              {isLoading && (
                <div className=" absolute inset-0 flex items-center justify-center  z-10 h-40">
                  <LoadingComponent />
                </div>
              )}
              <div className="relative">
                {" "}
                <img
                  src={`${imageHost}${cardId}_ut.webp`}
                  style={{
                    width: "500px",
                    height: "auto",
                    marginBottom: "10px",
                  }}
                  onLoad={() => setIsLoading(false)}
                  className="w-full transition-opacity duration-300"
                />
                <div className="absolute top-1 left-1">
                  {Array(rarity)
                    .fill(0)
                    .map((_, i) => (
                      <img
                        key={i}
                        src="/images/rarity_icons/untrained_star.png"
                        style={{ width: "30px", display: "inline-block" }}
                      />
                    ))}
                </div>
              </div>{" "}
              {isLoading2 && (
                <div className="absolute inset-0 flex items-center justify-center  z-10 h-40">
                  <LoadingComponent />
                </div>
              )}
              <div className="relative">
                <img
                  src={`${imageHost}${cardId}_t.webp`}
                  style={{
                    maxWidth: "500px",
                    height: "auto",
                  }}
                  onLoad={() => setIsLoading2(false)}
                  className="w-full transition-opacity duration-300"
                />

                <div className="absolute bottom-1 right-1">
                  {Array(rarity)
                    .fill(0)
                    .map((_, i) => (
                      <img
                        key={i}
                        src="/images/rarity_icons/trained_star.png"
                        style={{
                          width: "30px",
                          display: "inline-block",
                        }}
                      />
                    ))}
                </div>
              </div>
            </div>
          )}
          {rarity <= 2 && (
            <div className="flex flex-col justify-center items-center gap-5 mb-3 relative">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center  z-10 h-15">
                  <LoadingComponent />
                </div>
              )}
              <img
                src={`${imageHost}${cardId}.webp`}
                style={{
                  maxWidth: "500px",
                  height: "auto",
                }}
                onLoad={() => setIsLoading(false)}
                className="w-full transition-opacity duration-300"
              />

              <div className="absolute bottom-1 right-1">
                {Array(rarity)
                  .fill(0)
                  .map((_, i) => (
                    <img
                      key={i}
                      src="/images/rarity_icons/untrained_star.png"
                      style={{
                        width: "30px",
                        display: "inline-block",
                      }}
                    />
                  ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-row justify-between items-center">
      <a
  href={`https://sekai.best/card/${sekaiId}`}
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex items-center px-4 py-2 bg-[#152857] hover:bg-[#6e80b8] text-white rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
>
  <span>View on Sekai Viewer</span>
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className="h-4 w-4 ml-1.5" 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
    aria-hidden="true"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
    />
  </svg>
</a>
          <button
            onClick={onClose}
            className="bg-[#152857] text-white px-4 py-2 rounded hover:bg-[#6e80b8]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
