import { useTheme } from "../../context/Theme_toggle";
import { IsDeviceIpad } from "../../hooks/isIpad";
import type { CardModalProps } from "../Global/Types";

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
  const isIpad = IsDeviceIpad();
  console.log(isIpad);
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className={`absolute inset-0 ${
          theme === "dark" ? "bg-black/60" : "bg-black/40"
        }`}
      ></div>

      <div
        className={`relative z-10 ${
          isIpad ? "w-2/3" : "w-full"
        } max-w-7xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl border transition-all duration-300 ${
          theme === "dark"
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ATTRIBUTE AND NAME */}
        <div className="p-3 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className={`absolute top-3 right-3 z-20 p-2 rounded-full transition-colors ${
              theme === "dark"
                ? "hover:bg-gray-700 text-gray-400 hover:text-gray-200"
                : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <div className="flex flex-col items-center space-y-4">
            {/* Card Attribute & Character Name */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src={`/images/attribute_icons/${cardAttribute}.webp`}
                  className="w-8 h-8 rounded-lg shadow-sm"
                  alt={`${cardAttribute} attribute`}
                />
              </div>
              <h2
                className={`text-2xl md:text-3xl font-bold font-serif tracking-wide ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  {name}
                </span>
              </h2>
            </div>

            {/* CARD NAME*/}
            <div
              className={`text-center px-4 py-2 rounded-lg ${
                theme === "dark"
                  ? "bg-gray-700/50 text-gray-300"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              <p className="text-sm font-medium italic">{cardName}</p>
            </div>
          </div>
        </div>

        {/* IMAGE*/}
        <div className="p-6 space-y-6">
          {/* Birthday Card (5 star or card ID 669) */}
          {(rarity === 5 || cardId === 669) && (
            <div className="relative w-full">
              <div className="relative overflow-hidden rounded-xl shadow-lg">
                {isLoading && (
                  <div
                    className="animate-pulse bg-gray-300 dark:bg-gray-600 
                  
                  aspect-[1.75/1] w-full rounded-lg"
                  />
                )}
                <div className={`${!isLoading ? "contents" : "hidden"}`}>
                  <img
                    src={`${imageHost}${cardId}_bd.webp`}
                    className={` w-full h-auto transition-opacity duration-300`}
                    onLoad={() => setIsLoading(false)}
                    alt="Birthday card"
                  />
                </div>
                {/* Rarity Badge */}
                <div className="absolute bottom-1 left-1">
                  {cardId === 669 ? (
                    <div className="flex">
                      {Array(rarity - 1)
                        .fill(0)
                        .map((_, i) => (
                          <img
                            key={i}
                            src="/images/rarity_icons/untrained_star.png"
                            className="sm:w-7 sm:h-7 lg:w-10 lg:h-10 w-6 h-6"
                            alt="star"
                          />
                        ))}
                    </div>
                  ) : (
                    <img
                      src="/images/rarity_icons/bday.png"
                      className="sm:w-7 sm:h-7 lg:w-10 lg:h-10 w-6 h-6"
                      alt="birthday"
                    />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 3 & 4 STAR */}
          {(rarity === 3 || rarity === 4) && (
            <div
              className={`grid grid-cols-1 ${
                isIpad ? "md:grid-cols-1" : "md:grid-cols-2"
              } gap-4`}
            >
              {/* Untrained Card */}
              <div className="relative">
                <div className="relative overflow-hidden rounded-xl shadow-lg">
                  {isLoading && (
                    <div
                      className="animate-pulse bg-gray-300 dark:bg-gray-600 
                  
                  aspect-[1.75/1] w-full rounded-lg"
                    />
                  )}
                  <div className={`${!isLoading ? "contents" : "hidden"}`}>
                    <img
                      src={`${imageHost}${cardId}_ut.webp`}
                      className="w-full h-auto transition-opacity duration-300"
                      onLoad={() => setIsLoading(false)}
                      alt="Untrained card"
                    />
                  </div>
                  {/*UNTRAINED */}
                  <div className="absolute top-3 left-3 flex space-x-1">
                    {Array(rarity)
                      .fill(0)
                      .map((_, i) => (
                        <img
                          key={i}
                          src="/images/rarity_icons/untrained_star.png"
                          className="w-6 h-6"
                          alt="star"
                        />
                      ))}
                  </div>
                </div>

                {/*UNTRAINED LABEL */}
                <div
                  className={`mt-2 text-center px-3 py-1 rounded-lg text-sm font-medium ${
                    theme === "dark"
                      ? "bg-gray-700 text-gray-300"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  Untrained
                </div>
              </div>

              {/* TRAINED CARD */}
              <div className="relative">
                <div className="relative overflow-hidden rounded-xl shadow-lg">
                  {isLoading2 && (
                    <div
                      className="animate-pulse bg-gray-300 dark:bg-gray-600 
                  
                  aspect-[1.75/1] w-full rounded-lg"
                    />
                  )}{" "}
                  <div className={`${!isLoading2 ? "contents" : "hidden"}`}>
                    <img
                      src={`${imageHost}${cardId}_t.webp`}
                      className="w-full h-auto transition-opacity duration-300"
                      onLoad={() => setIsLoading2(false)}
                      alt="Trained card"
                    />
                  </div>
                  {/*TRAINED STARS*/}
                  <div className="absolute bottom-3 right-3 flex space-x-1">
                    {Array(rarity)
                      .fill(0)
                      .map((_, i) => (
                        <img
                          key={i}
                          src="/images/rarity_icons/trained_star.png"
                          className="w-6 h-6"
                          alt="star"
                        />
                      ))}
                  </div>
                </div>

                {/* TRAINED LABEL*/}
                <div
                  className={`mt-2 text-center px-3 py-1 rounded-lg text-sm font-medium ${
                    theme === "dark"
                      ? "bg-gray-700 text-gray-300"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  Trained
                </div>
              </div>
            </div>
          )}

          {/* 1 & 2 STAR CARDS*/}
          {rarity <= 2 && (
            <div className="relative">
              <div className="relative overflow-hidden rounded-xl shadow-lg">
                {isLoading && (
                  <div
                    className="animate-pulse bg-gray-300 dark:bg-gray-600 
                  
                  aspect-[1.75/1] w-full rounded-lg"
                  />
                )}
                <div className={`${!isLoading ? "contents" : "hidden"}`}>
                  <img
                    src={`${imageHost}${cardId}.webp`}
                    className="w-full h-auto transition-opacity duration-300"
                    onLoad={() => setIsLoading(false)}
                    alt="Card"
                  />
                </div>
                {/*STARS */}
                <div className="absolute bottom-3 right-3 flex space-x-1">
                  {Array(rarity)
                    .fill(0)
                    .map((_, i) => (
                      <img
                        key={i}
                        src="/images/rarity_icons/untrained_star.png"
                        className="w-6 h-6"
                        alt="star"
                      />
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER BUTTONS */}
        <div
          className={`p-3 border-t ${
            theme === "dark" ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center">
            <a
              href={`https://sekai.best/card/${sekaiId}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                theme === "dark"
                  ? "bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20"
                  : "bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200"
              }`}
            >
              <span>View on Sekai Viewer</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
