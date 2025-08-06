import { cardFilterCategories,grouped } from "../Categories";
import type { CardFilterComponentTypes } from "../FilterTabTypes";
export default function CardFilters({isOpen, tempCardFilters, handleCardFilters, handleReset, handleApply}:CardFilterComponentTypes) {
    return    <div
          className={`transition-all duration-500 ease-in-out overflow-hidden max-w-[500px] ${
            isOpen ? "max-h-[800px]  opacity-100" : "max-h-0 opacity-0"
          } bg-gray-600 rounded-lg p-1.5`}
        >
          {Object.entries(cardFilterCategories).map(([category, options]) => {
            const isVs = tempCardFilters.Character.some((char: string) =>
              grouped["Virtual Singers"].includes(char)
            );

            return (
              <div
                key={category}
                className={`mb-2 "hidden" ${
                  category === "sub_unit" &&
                  `${
                    grouped["Virtual Singers"].some((vs) =>
                      tempCardFilters.Character.includes(vs)
                    )
                      ? "contents"
                      : "hidden"
                  }`
                }`}
              >
                {category != "sub_unit" && (
                  <h3 className="text-lg text-gray-200 font-semibold mb-1">
                    {category}
                  </h3>
                )}

                {category === "sub_unit" && isVs && (
                  <h3 className="text-lg  text-gray-200  font-semibold mb-1">
                    VS Sub Unit
                  </h3>
                )}
                <div className="flex justify-center items-center flex-wrap gap-3">
                  {options.map((option, i) => {
                    const unitIcon = `images/unit_icons/${i + 1}.png`;
                    const characterIcon = `/images/character_icons/${
                      i + 1
                    }.webp`;
                    const subUnitIcon = `images/unit_icons/${i + 2}.png`;
                    const attributeIcon = `/images/attribute_icons/${option}.webp`;
                    const rarityIcon = `images/rarity_icons/${i + 1}.webp`;

                    const isSelected = (() => {
                      switch (category) {
                        case "Characters":
                          return tempCardFilters.Character.includes(
                            option as string
                          );
                        case "Unit":
                          return tempCardFilters.Unit.includes(
                            option as string
                          );
                        case "sub_unit":
                          return tempCardFilters.sub_unit.includes(
                            option as string
                          );
                        case "Attribute":
                          return tempCardFilters.Attribute.includes(
                            option as string
                          );
                        case "Rarity":
                          return tempCardFilters.Rarity.includes(option);
                        case "Type":
                          return tempCardFilters.Type.includes(
                            option as string
                          );
                        default:
                          return false;
                      }
                    })();

                    const isOutsideUnit =
                      category === "Characters" &&
                      tempCardFilters.Unit.length > 0 &&
                      !tempCardFilters.Unit.some((unit: string) =>
                        grouped[unit]?.includes(option as string)
                      ) &&
                      !tempCardFilters.Character.includes(option as string);
                    return (
                      <div key={option as string}>
                        {category !== "Type" ? (
                          <button
                            className={` border-2 aspect-square rounded-full ${
                              isSelected ? "border-white" : "border-gray-600"
                            } ${isOutsideUnit ? "opacity-30" : ""}`}
                            onClick={() => handleCardFilters(category, option)}
                          >
                            {category === "Characters" && (
                              <img
                                src={characterIcon}
                                style={{ width: "2.25rem" }}
                              />
                            )}
                            {category === "Unit" && (
                              <img src={unitIcon} style={{ width: "2rem" }} />
                            )}{" "}
                            {category === "sub_unit" && isVs && (
                              <img
                                src={subUnitIcon}
                                style={{ width: "2rem" }}
                              />
                            )}
                            {category === "Attribute" && (
                              <img
                                src={attributeIcon}
                                style={{ width: "1.75rem" }}
                              />
                            )}
                            {category === "Rarity" && (
                              <img src={rarityIcon} style={{ width: "2rem" }} />
                            )}
                          </button>
                        ) : (
                          <div>
                            {" "}
                            <button
                              key={option as string}
                              onClick={() =>
                                handleCardFilters(category, option)
                              }
                            >
                              {" "}
                              <div
                                className={`px-2 py-1 rounded-full text-xs md:text-sm font-medium transition-colors ${
                                  tempCardFilters["Type"].includes(
                                    option as string
                                  )
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                }`}
                              >
                                {option}
                              </div>
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
          <div className="flex justify-between">
            <button
              onClick={handleReset}
              className="bg-gray-300 text-black px-4 py-2 rounded"
            >
              Reset Filters
            </button>
            <button
              onClick={handleApply}
              className="bg-highlight-dark-mode text-white px-4 py-2 rounded"
            >
              Apply
            </button>
          </div>
        </div>
}