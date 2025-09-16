import { useEffect } from "react";
import { useServer } from "../../../context/Server";
import { useTheme } from "../../../context/Theme_toggle";
import { handleTouchMove } from "../touch_move";

import type { GachaModalProps } from "./GachaModalTypes";
import { ImageLoader } from "../../../hooks/imageLoader";
import CardIcon from "../../Icons/Icon";
import { useProsekaData } from "../../../context/Data";

const allowedBannerTypes = [
  "Event",
  "Limited Event",
  "Limited Event Rerun",
  "Collab",
  "Unit Limited Event",
  "Bloom Festival",
  "Colorful Festival",
  "Recollection",
  "World Link Support",
];

export default function GachaModal({
  gachaId,
  isGachaOpen,
  onClose,
  sekaiId,
}: GachaModalProps) {
  const { theme } = useTheme();
  const { server } = useServer();
  const { jpBanners, enBanners, allCards } = useProsekaData();
  // Prevent parent scroll
  useEffect(() => {
    if (!isGachaOpen) return;
    iconsLoader.reset();
    document.body.style.overflow = "hidden";

    // cleanup
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isGachaOpen, gachaId]);
  const AllGacha =
    server === "global" || server === "saved" ? enBanners : jpBanners;

  const gachaObj = AllGacha.find((gacha) => gacha.id === gachaId);

  const sortedAndFilteredCards = allCards
    .filter((card) => {
      // const releaseDate =
      //   server === "global" ? card.en_released : card.jp_released;
      if (gachaObj) {
        return (
          gachaObj.gachaDetails.includes(card.id) ||
          gachaObj.cards.includes(card.id)
        );
      }
    })
    .sort((a, b) => b.id - a.id)
    .sort((a, b) => {
      const isRateUpA = gachaObj?.cards.includes(a.id);
      const isRateUpB = gachaObj?.cards.includes(b.id);
      if (isRateUpA && !isRateUpB) return -1;
      if (!isRateUpA && isRateUpB) return 1;
      return 0;
    });
  const iconsLoader = ImageLoader(sortedAndFilteredCards?.length ?? 0);

  let total4starChance = 0;
  let featured4starChance = 0;

  switch (gachaObj?.banner_type) {
    case "Limited Event":
    case "Event":
    case "Limited Event Rerun":
    case "Unit Limited Event":
    case "Collab":
      total4starChance = 3;
      featured4starChance = 0.4;
      break;
    case "Bloom Festival":
    case "Colorful Festival":
      total4starChance = 6;
      featured4starChance = 0.4;
      break;
    case "Recollection":
      total4starChance = 6;
      break;
    case "World Link Support":
      if (gachaObj.keywords) {
        if (gachaObj.keywords.length === 0) {
          total4starChance = 3;
        } else {
          total4starChance = 3;
          featured4starChance = 0.4;
        }
      }
      break;
  }

  const featured4 = gachaObj?.cards;

  const nonFeatured4 = gachaObj?.gachaDetails.filter((card) => {
    if (gachaObj.keywords) {
      if (
        gachaObj.banner_type === "World Link Support" &&
        gachaObj.keywords.length === 0
      ) {
        return (
          featured4?.includes(card) || gachaObj.gachaDetails.includes(card)
        );
      } else {
        return !featured4?.includes(card);
      }
    }
  });
  const totalFeatured4chance =
    featured4 && Number((featured4starChance * featured4.length).toFixed(1));
  const totalNonFeatured4chance = Number(
    (total4starChance - (totalFeatured4chance || 0)).toFixed(3)
  );

  const nonF4Chance =
    nonFeatured4 &&
    totalNonFeatured4chance &&
    Number((totalNonFeatured4chance / nonFeatured4?.length).toFixed(3));

  if (!isGachaOpen) return null;

  return (
    <>
      {gachaObj && sortedAndFilteredCards ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-2 sm:p-4"
          onClick={onClose}
          onTouchMove={handleTouchMove}
        >
          {" "}
          <div
            className={`relative w-full max-w-4xl max-h-[90vh] sm:max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl border transition-all duration-300 ${
              theme === "dark"
                ? "bg-gray-800 border-gray-600"
                : "bg-white border-gray-200"
            }`}
            onClick={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            <div className="sticky top-0 z-10 p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 bg-inherit rounded-t-xl">
              {/* CLOSE BUTTON*/}
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

              {/* GACHA NAME*/}
              <div className="flex flex-col items-center space-y-3 mb-4">
                <div
                  className={`text-center px-4 py-2 rounded-lg max-w-full ${
                    theme === "dark"
                      ? "bg-gray-700/50 text-gray-300"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <p className="text-sm sm:text-base font-medium italic break-words">
                    {gachaObj.name}
                  </p>
                </div>
              </div>

              {/* VIEW ON SEKAI BEST BUTTON */}
              <div className="flex flex-row justify-center items-center">
                {" "}
                <a
                  href={`https://sekai.best/gacha/${sekaiId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    theme === "dark"
                      ? "bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20"
                      : "bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200"
                  }`}
                >
                  <span>View on Sekai Best</span>

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
              </div>
            </div>

            <div className="p-4 pt-0 sm:p-6 space-6-y">
              {" "}
              <div className="space-y-4">
                <h3
                  className={`text-base sm:text-lg font-semibold text-center sm:text-left ${
                    theme === "dark" ? "text-gray-300" : "text-gray-800"
                  } `}
                >
                  4★ Rates
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3 sm:gap-4">
                  {!iconsLoader.isLoaded && (
                    <>
                      {gachaObj.gachaDetails.map((_, i) => (
                        <div
                          key={`skeleton-${i}`}
                          className="animate-pulse bg-gray-300 dark:bg-gray-600 aspect-square rounded-xl"
                        />
                      ))}
                    </>
                  )}
                  <div
                    className={`${
                      iconsLoader.isLoaded ? "contents" : "hidden"
                    }`}
                  >
                    {" "}
                    {sortedAndFilteredCards.map((card) => {
                      const cardName = `/images/card_icons/${card.id}_t.webp`;
                      return (
                        <div
                          key={card.id}
                          className="group cursor-pointer transition-transform duration-200 hover:scale-105 flex flex-col items-center space-y-2"
                        >
                          <a
                            href={`https://sekai.best/card/${card.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center space-y-2 w-full"
                          >
                            <CardIcon
                              imgUrl={cardName}
                              cardId={card.id}
                              iconsLoader={iconsLoader}
                            />
                            {/* RATE */}
                            {allowedBannerTypes.includes(
                              gachaObj.banner_type
                            ) && (
                              <div
                                className={`w-full px-2 py-1 rounded-md text-center ${
                                  theme === "dark"
                                    ? "bg-gray-700/80 text-gray-200"
                                    : "bg-gray-100/80 text-gray-700"
                                }`}
                              >
                                <div className="text-xs sm:text-sm font-medium">
                                  {(gachaObj.cards.includes(card.id) &&
                                    gachaObj.banner_type !== "Recollection" &&
                                    gachaObj.banner_type !==
                                      "World Link Support") ||
                                  (gachaObj.banner_type ===
                                    "World Link Support" &&
                                    gachaObj.keywords &&
                                    gachaObj.keywords.length !== 0 &&
                                    gachaObj.cards.includes(card.id)) ? (
                                    <span>{featured4starChance} %</span>
                                  ) : (
                                    <span>{nonF4Chance} %</span>
                                  )}
                                </div>{" "}
                              </div>
                            )}
                          </a>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            <div
              className={`sticky bottom-0 z-10 text-xs px-5 sm:text-sm lg:text-lg ${
                theme === "dark" ? "bg-[#101828]" : "bg-[#d1d5dc]"
              }  flex flex-row justify-end gap-2 items-center px-1 py-4`}
            >
              {" "}
              <button
                onClick={onClose}
                className={`inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-lg  font-medium transition-all duration-200 ${
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
      ) : null}
    </>
  );
}
