import { useState } from "react";
import { useTheme } from "../../context/Theme_toggle";

import CreateCard from "./Create_card";
import CreateGacha from "./Create_gacha";

type CreateModeType = "card" | "gacha";

export default function CreateContainer() {
  const [createMode, setCreateMode] = useState<CreateModeType>("card");

  const handleCreateCard = () => {
    setCreateMode("card");
  };
  const handleCreateGacha = () => {
    setCreateMode("gacha");
  };
  return (
    <div className="h-full flex flex-col ">
      <div className="w-full flex flex-row h-8 justify-center items-center text-center">
        <div
          className={`${
            createMode == "card" && "bg-highlight-dark-mode"
          } h-full w-1/2 pt-1`}
          onClick={() => handleCreateCard()}
        >
          Card
        </div>
        <div
          className={`${
            createMode == "gacha" && "bg-highlight-dark-mode"
          } w-1/2 h-full pt-1`}
          onClick={() => handleCreateGacha()}
        >
          Gacha
        </div>
      </div>
      {createMode == "card" ? <CreateCard /> : <CreateGacha />}
    </div>
  );
}
