import stl from "./Main.module.css";
import { useState } from "react";
import { IoArrowBackOutline } from "react-icons/io5";

import IncomeBased from "./incomeBased/IncomeBased";
import CapitalBased from "./capitalBased/CapitalBased";

const Main = () => {
  const [option, setOption] = useState("");

  const handleOptionChange = (selected) => {
    setOption(selected);
  };

  return (
    <main className={stl.main}>
      <div className={stl.modal}>
        <div className={stl.backWrapper}>
          {option !== "" && (
            <IoArrowBackOutline
              className={stl.backArrow}
              onClick={() => setOption("")}
            />
          )}
        </div>
        <h1 className={stl.hero}>
          Bereken eenvoudig uw <br />
          maximale hypotheek
        </h1>
        {option === "" && (
          <div className={stl.contentWrap}>
            <span className={stl.basedOn}>Op basis van uw</span>
            <button
              className={stl.cta}
              onClick={() => handleOptionChange("Inkomen")}
            >
              Inkomen
            </button>
            <button
              className={stl.cta}
              onClick={() => handleOptionChange("Woning")}
            >
              Huidige woning
            </button>
          </div>
        )}
        {option === "Inkomen" && <IncomeBased />}
        {option === "Woning" && <CapitalBased />}
      </div>
    </main>
  );
};

export default Main;
