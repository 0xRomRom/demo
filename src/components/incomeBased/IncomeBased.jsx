import stl from "./IncomeBased.module.css";
import { useCallback, useState } from "react";
import { useInView } from "react-intersection-observer";
import NumberCounter from "../../utils/NumberCounter";
import { FiCommand } from "react-icons/fi";

const IncomeBased = () => {
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
        setError("Helaas is uw inkomen te laag voor een hypotheek.");
        return;
      }

      setError("");
      setLoading(true);

      try {
        const APIKEY = process.env.REACT_APP_APIKEY;
        const fetcher = await fetch(
          `https://api.hypotheekbond.nl/calculation/v1/mortgage/maximum-by-income?api_key=${APIKEY}&nhg=false&old_student_loan_regulation=false&private_lease_amount=0&private_lease_duration=0&duration=360&percentage=1.501&rateFixation=10&notDeductible=0&groundRent=0&person%5B0%5D%5Bincome%5D=${inputValue}&person%5B0%5D%5Bage%5D=18&person%5B0%5D%5Balimony%5D=0&person%5B0%5D%5Bloans%5D=0&person%5B0%5D%5BstudentLoans%5D=0&person%5B0%5D%5BstudentLoanMonthlyAmount%5D=0&person%5B1%5D%5Bincome%5D=0&person%5B1%5D%5Bage%5D=18&person%5B1%5D%5Balimony%5D=0&person%5B1%5D%5Bloans%5D=0&person%5B1%5D%5BstudentLoans%5D=0&person%5B1%5D%5BstudentLoanMonthlyAmount%5D=0`
        );

        if (!fetcher.ok) {
          throw new Error(`Failed to fetch: ${fetcher.status}`);
        }

        const result = await fetcher.json();
        const finalRes = Math.ceil(result.data.result);

        setMaxLoan(finalRes);
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
    <form className={stl.incomebased}>
      {!maxLoan && (
        <>
          <label htmlFor="name" className={stl.formLabel}>
            Hoeveel bedraagt uw bruto jaarinkomen?
            <div className={stl.inputWrap}>
              <input
                type="number"
                id="name"
                name="name"
                className={stl.amountInput}
                placeholder="Voorbeeld: 30000"
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
              € {inView && <NumberCounter n={maxLoan} />}
            </span>
          </div>
          <div className={stl.row}>
            <span className={stl.resultSpan}>Op basis van:</span>
            <span className={stl.valueSpan}>
              1.501 <span className={stl.miniSpan}>% rente</span>
            </span>
          </div>
          <div className={stl.row}>
            <span className={stl.resultSpan}>Met een looptijd van:</span>
            <span className={stl.valueSpan}>
              {inView && <NumberCounter n={360} />}{" "}
              <span className={stl.miniSpan}>maanden</span>
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

export default IncomeBased;
