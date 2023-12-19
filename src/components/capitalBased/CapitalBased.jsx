import stl from "./CapitalBased.module.css";
import { useCallback, useState } from "react";
import { FiCommand } from "react-icons/fi";

import { useInView } from "react-intersection-observer";
import NumberCounter from "../../utils/NumberCounter";

const CapitalBased = () => {
  // Hook to handle animated numbers
  const [ref, inView] = useInView({
    triggerOnce: false,
  });

  const [inputValue, setInputValue] = useState(0);
  const [error, setError] = useState("");
  const [maxLoan, setMaxLoan] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value > 10000000000) return;

    setInputValue(value);
  };

  const handleRecalculate = (e) => {
    e.preventDefault();
    setMaxLoan(null);
    setInputValue(0);
  };

  const mortgageFetch = useCallback(
    async (e) => {
      e.preventDefault();

      if (!inputValue) {
        setError("Vul een waarde in.");
        return;
      }
      if (inputValue < 10000) {
        setError("Helaas is de waarde te laag voor een hypotheek.");
        return;
      }

      setError("");
      setLoading(true);

      try {
        const APIKEY = process.env.REACT_APP_APIKEY;
        const fetcher = await fetch(
          `https://api.hypotheekbond.nl/calculation/v1/mortgage/maximum-by-value?api_key=${APIKEY}&objectvalue=${inputValue}&duration=360&not_deductible=0&onlyUseIncludedLabels=false`
        );
        const result = await fetcher.json();

        if (!fetcher.ok) {
          throw new Error(`Failed to fetch: ${fetcher.status}`);
        }

        setMaxLoan(result.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
        setError("Verbinding met de server mislukt. Probeer later opnieuw.");
      }
    },
    [inputValue]
  );

  return (
    <form className={stl.capitalbased}>
      {!maxLoan && (
        <>
          <label htmlFor="name" className={stl.formLabel}>
            Hoeveel bedraagt de waarde van uw woning?{" "}
            <div className={stl.inputWrap}>
              <input
                type="number"
                id="name"
                name="name"
                className={stl.amountInput}
                placeholder="Voorbeeld: 380000"
                onChange={handleInputChange}
                value={inputValue || ""}
                autoComplete="off"
              />
            </div>
          </label>
          <button className={stl.cta} onClick={mortgageFetch}>
            {loading ? <FiCommand className={stl.loader} /> : "Bereken"}
          </button>
          <div className={stl.errorBox}>
            {error && <span className={stl.errorSpan}>{error}</span>}
          </div>
        </>
      )}
      {maxLoan && (
        <div className={stl.result}>
          <div className={stl.row}>
            <span className={stl.resultSpan}>Maximale lening:</span>
            <span className={stl.valueSpan} ref={ref}>
              € {inView && <NumberCounter n={maxLoan.result} />}
            </span>
          </div>
          <div className={stl.row}>
            <span className={stl.resultSpan}>Op basis van:</span>
            <span className={stl.valueSpan}>
              {maxLoan.calculationValues.interestRate}{" "}
              <span className={stl.miniSpan}>% rente</span>
            </span>
          </div>
          <div className={stl.row}>
            <span className={stl.resultSpan}>Met een looptijd van:</span>
            <span className={stl.valueSpan}>
              {inView && <NumberCounter n={360} />}{" "}
              <span className={stl.miniSpan}>maanden</span>
            </span>
          </div>
          <div className={stl.row}>
            <span className={stl.resultSpan}>Eerste termijn:</span>
            <span className={stl.valueSpan}>
              € {maxLoan.calculationValues.firstGrossPayment.toLocaleString()}
            </span>
          </div>
          <button className={stl.cta} onClick={handleRecalculate}>
            Bereken opnieuw
          </button>
        </div>
      )}
    </form>
  );
};

export default CapitalBased;
