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
  lastName,
  firstName,
  cardName,
  cardAttribute,
}: CardModalProps) {
  const { theme } = useTheme();

  const imageHost = "https://r2-image-proxy.zenzenzest.workers.dev/";
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs"
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
        <div
          className={`flex flex-row justify-center items-center gap-3 ${
            theme === "light" ? "text-text-light-mode" : "text-text-dark-mode"
          } text-md font-semibold mb-4 tracking-[3px]`}
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
          <div className="text-3xl font-bold font-serif tracking-wide">
            {lastName} {firstName}
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
              {/* CARD NAME */}
              <div className="w-full text-xs italic rounded-md backdrop-blur-sm absolute top-0 right-0 text-center text-gray-350 [text-shadow:_-1px_-1px_0_#000,_1px_-1px_0_#000,_-1px_1px_0_#000,_1px_1px_0_#000]">
                {cardName}
              </div>
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
                <div className="w-full text-sm italic rounded-md backdrop-blur-sm absolute top-0 right-0 text-center text-mizuki [text-shadow:_-1px_-1px_0_#000,_1px_-1px_0_#000,_-1px_1px_0_#000,_1px_1px_0_#000]">
                  {cardName}
                </div>
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
              <div className="w-full text-sm italic rounded-md backdrop-blur-sm absolute top-0 right-0 text-center text-mizuki [text-shadow:_-1px_-1px_0_#000,_1px_-1px_0_#000,_-1px_1px_0_#000,_1px_1px_0_#000]">
                {cardName}
              </div>
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
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
