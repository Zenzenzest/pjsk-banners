import { useTheme } from "../../context/Theme_toggle";
import type { CardModalProps } from "./types";

export default function CardModal({
  isOpen,
  onClose,
  cardId,
  rarity,
  trainedUrl,
  untrainedUrl,
  lastName,
  firstName,
  cardName,
  cardAttribute,
}: CardModalProps) {
  const { theme } = useTheme();

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
              <img
                src={`/images/cards/${cardId}_bd.webp`}
                style={{
                  maxWidth: "500px",
                  height: "auto",
                }}
                className="w-full transition-opacity duration-300"
              />
              {/* CARD NAME */}
              <div className="w-full text-sm italic rounded-md backdrop-blur-sm absolute top-0 right-0 text-center text-mizuki [text-shadow:_-1px_-1px_0_#000,_1px_-1px_0_#000,_-1px_1px_0_#000,_1px_1px_0_#000]">
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
              <div className="relative">
                <img
                  src={untrainedUrl}
                  style={{
                    width: "500px",
                    height: "auto",
                    marginBottom: "10px",
                  }}
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
              </div>
              <div className="relative">
                <img
                  src={trainedUrl}
                  style={{
                    maxWidth: "500px",
                    height: "auto",
                  }}
                  className="w-full transition-opacity duration-300"
                />
                <div className="w-full text-lg italic rounded-md backdrop-blur-sm absolute top-0 right-0 text-center text-mizuki [text-shadow:_-1px_-1px_0_#000,_1px_-1px_0_#000,_-1px_1px_0_#000,_1px_1px_0_#000]">
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
              <div className="relative">
                <img
                  src={`/images/cards/${cardId}.webp`}
                  style={{
                    maxWidth: "500px",
                    height: "auto",
                  }}
                  className="w-full transition-opacity duration-300"
                />
                <div className="w-full text-lg italic rounded-md backdrop-blur-sm absolute top-0 right-0 text-center text-mizuki [text-shadow:_-1px_-1px_0_#000,_1px_-1px_0_#000,_-1px_1px_0_#000,_1px_1px_0_#000]">
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
