import { useTheme } from "../../context/Theme_toggle";
import { IsDeviceIpad } from "../../hooks/isIpad";
import type { CardModalProps } from "../Global/Types";
import CardReleases from "./Card_releases";

export default function CardModal({
  isOpen,
  onClose,
  cardId,
  rarity,
  cardType,
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
  const imageHost = "https://r2-image-proxy.zenzenzest.workers.dev/n/";
  const isIpad = IsDeviceIpad();

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
        } max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl border transition-all duration-300 ${
          theme === "dark"
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ATTRIBUTE AND NAME */}
        <div className="p-3 border-b border-gray-200 dark:border-gray-700">
          {/* CLOSE BUTTON */}
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
          <div className="flex flex-col items-center space-y-2">
            {/* CARD ATTRIBUTE AND CHARACTER NAME*/}
            <div className="flex items-center space-x-1">
              <div className="relative">
                <img
                  src={`/images/attribute_icons/${cardAttribute}.webp`}
                  className="w-full h-auto rounded-lg shadow-sm"
                  alt={`${cardAttribute} attribute`}
                />
              </div>
              <h2
                className={`text-xl md:text-3xl font-bold font-serif tracking-wide w-[130px] sm:w-full text-center   ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                <span
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]   
                    "
                >
                  {name}
                </span>
              </h2>
            </div>
            {/* CARD NAME*/}
            <div
              className={`text-center px-3 py-1 rounded-lg ${
                theme === "dark"
                  ? "bg-gray-700/50 text-gray-300"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              <p className="text-sm font-medium italic">{cardName}</p>
            </div>{" "}
            <span
              className="
      px-1.5 py-0.5 rounded-full text-[10px] bg-gray-700 text-gray-300
    "
            >
              {(() => {
                switch (cardType) {
                  case "limited":
                    return "LIMITED";
                  case "bday":
                    return "BDAY";
                  case "bloom_fes":
                    return "BLOOMFES";
                  case "color_fes":
                    return "COLORFES";
                  case "movie_exclusive":
                    return "MOVIE EXCLUSIVE";
                  case "limited_collab":
                    return "COLLAB";
                  case "unit_limited":
                    return "UNIT LIMITED";
                  default:
                    return "PERMANENT";
                }
              })()}
            </span>
          </div>
        </div>

        {/* IMAGE*/}
        <div className="p-4 space-y-4">
          {/* Birthday Card (5 star or card ID 1167) */}
          {/* CARDID 1167 MIKU TOUHOU CARD THAT HAS NO TRAINED IMAGE  */}
          {(rarity === 5 || cardId === 1167) && (
            <div className="relative w-full">
              <div className="relative overflow-hidden rounded-xl shadow-lg">
                {isLoading && (
                  <div
                    className="animate-pulse bg-gray-300 dark:bg-gray-600 
                  
                  aspect-[1.759/1] w-full rounded-lg"
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
                {cardId === 1167 ? (
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
                ) : (
                  <div className="absolute bottom-1 left-1">
                    <img
                      src="/images/rarity_icons/bday.png"
                      className="sm:w-7 sm:h-7 lg:w-10 lg:h-10 w-6 h-6"
                      alt="birthday"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 3 & 4 STAR */}
          {(rarity === 3 || rarity === 4) && cardId != 1167 && (
            <div
              className={`grid grid-cols-1 ${
                isIpad ? "md:grid-cols-1" : "md:grid-cols-2"
              } gap-4`}
            >
              {/* UNTRAINED CARD*/}
              <div className="relative">
                <div className="relative overflow-hidden rounded-xl shadow-lg">
                  {isLoading && (
                    <div
                      className="animate-pulse bg-gray-300 dark:bg-gray-600 
                  
                  aspect-[1.759/1] w-full rounded-lg"
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
                  {/*UNTRAINED ICON*/}
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
              </div>

              {/* TRAINED CARD */}
              {cardId != 1167 && (
                <div className="relative">
                  <div className="relative overflow-hidden rounded-xl shadow-lg">
                    {isLoading2 && (
                      <div
                        className="animate-pulse bg-gray-300 dark:bg-gray-600 
                  
                  aspect-[1.759/1] w-full rounded-lg"
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
                </div>
              )}
            </div>
          )}

          {/* 1 & 2 STAR CARDS*/}
          {rarity <= 2 && (
            <div className="relative">
              <div className="relative overflow-hidden rounded-xl shadow-lg">
                {isLoading && (
                  <div
                    className="animate-pulse bg-gray-300 dark:bg-gray-600 
                  
                  aspect-[1.759/1] w-full rounded-lg"
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

        {/* BANNERS */}
        <CardReleases cardId={cardId} />
        {/* FOOTER BUTTONS */}
        <div className="flex flex-row justify-between items-center p-2">
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
            className={`inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              theme === "dark"
                ? "bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20"
                : "bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200"
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
