import { useServer } from "../../context/Server";
import { useState } from "react";
import GachaTable from "./Gacha_table";
import CreateData from "./Create_data";
import DateTabs from "./Date_tabs";

export default function HomeContainer() {
  const { server, setServer } = useServer();

  return server == "global" ? <DateTabs /> : <CreateData />;
}
