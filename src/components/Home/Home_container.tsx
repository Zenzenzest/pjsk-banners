import { useServer } from "../../context/Server";
import { useState } from "react";
import GachaTable from "./Gacha_table";
import CreateData from "./Create_data";

export default function HomeContainer() {
  const { server, setServer } = useServer();

  return server == "global" ? <GachaTable /> : <CreateData />;
}
