import React from "react";
import PlayerHeaderPixpel from "./PlayerHeaderPixpel";
import DeveloperHeaderPixpel from "./DeveloperHeaderPixpel";
import { useAppContext } from "../../contexts/AppContext";

function PixpelHeader() {
  const context = useAppContext();

  return <div>{context.player ? <PlayerHeaderPixpel /> : <DeveloperHeaderPixpel />}</div>;
}

export default PixpelHeader;
