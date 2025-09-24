import { imgHost } from "../../constants/common";
import { useProsekaData } from "../../context/Data";
type LandingCardsProps = {
  selectedBannerId: number;
  n: number;
};
export default function LandingCards({
  selectedBannerId,
  n,
}: LandingCardsProps) {
  const { allCards, jpBanners, enBanners, jpEvents } = useProsekaData();
  const banners = n === 0 ? jpBanners : enBanners;
  const bannerData = banners.find((banner) => banner.id === selectedBannerId);
  const bannerCardsData = allCards.filter((card) =>
    bannerData?.cards.includes(card.id)
  );
  const eventId = bannerData?.event_id;
  const eventData = jpEvents.find((ev) => ev.id === eventId);
  const eventCardsData = allCards.filter((card) =>
    eventData?.cards.includes(card.id)
  );

  const cardsData = eventId != undefined ? eventCardsData : bannerCardsData;
  return (
    <div className="flex flex-row justify-center items-center gap-1 max-w-[454px] p-1 mx-auto sm:min-h-[116px] min-h-[90px]">
      {cardsData.map((card) => {
        const imgPath =
          card.rarity === 5
            ? "_bd.webp"
            : card.rarity === 4 || card.rarity === 3
            ? "_t.webp"
            : ".webp";
        return (
          <img
            src={`${imgHost}/icons/${card.id}${imgPath}`}
            alt={`${card.id}-${card.character}`}
            className={`${
              cardsData.length <= 3 ? "max-w-[75px]" : "w-full"
            } rounded-xl`}
          />
        );
      })}
    </div>
  );
}
