import { useState } from "react";

export default function MortgageCalculator() {
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loanTerm, setLoanTerm] = useState("");
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");

  function calculate(e) {
    e.preventDefault();
    setResults(null);
    setError("");
    const p = parseFloat(loanAmount);
    const t = parseFloat(loanTerm);
    const r = parseFloat(interestRate);
    //Validate input fields
    if (isNaN(loanAmount) || isNaN(interestRate) || isNaN(loanTerm)) {
      setError("Invalid Input fields");
      return;
    }
    if (loanAmount <= 0 || interestRate < 0 || loanTerm <= 0) {
      setError("Input values must be greater than 0");
      return;
    }

    const monthly_interest = r / 100 / 12;
    const number_of_payments = t * 12;
    const monthly_payment =
      r === 0
        ? p / number_of_payments
        : (p *
            (monthly_interest *
              Math.pow(1 + monthly_interest, number_of_payments))) /
          (Math.pow(1 + monthly_interest, number_of_payments) - 1);
    const total_amount = number_of_payments * monthly_payment;
    const interest_paid = total_amount - p;
    setResults({ monthly_payment, total_amount, interest_paid });
  }

  //   Build a simple mortgage calculator widget that takes in a loan amount, interest rate, loan term, and calculates the monthly mortgage payment, total payment amount, and total interest paid.RequirementsThe user should be able to enter:1. Loan amount ($)2. Annual interest rate (%). This is also known as the annual percentage rate (APR)3. Loan term (in years)Using the inputs, the calculator should compute the following and display the results to the user:
  //   1. Monthly mortgage payment
  //   2. Total payment amount
  //   3. Total interest paid
  //   If a non-numerical string is entered into any input field, the calculator should display an error message. Additionally, the calculator should handle any other invalid inputs that may arise.
  //   Round the result amounts to 2 decimal places.(The last two requirements might not be given to you during interviews, you're expected to clarify.The formula for calculating the monthly payment is:M = P(i(1+i)n)/((1+i)n - 1)M: Monthly mortgage paymentP: Loan amounti: Monthly interest rate (APR / 12)n: Total number of payments (loan term in years x 12)

  return (
    <div
      style={{ maxWidth: "400px", margin: "0 auto", fontFamily: "sans-serif" }}
    >
      <h2>Mortgage Calculator</h2>
      <form
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        onSubmit={calculate}
      >
        <div>
          <label
            htmlFor="loanAmount"
            style={{ display: "block", marginBottom: "0.5rem" }}
          >
            Loan Amount ($)
          </label>
          <input
            id="loanAmount"
            type="text"
            style={{ width: "100%", padding: "8px" }}
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
          />
        </div>

        <div>
          <label
            htmlFor="interestRate"
            style={{ display: "block", marginBottom: "0.5rem" }}
          >
            Annual Interest Rate (APR %)
          </label>
          <input
            id="interestRate"
            type="text"
            style={{ width: "100%", padding: "8px" }}
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
          />
        </div>

        <div>
          <label
            htmlFor="loanTerm"
            style={{ display: "block", marginBottom: "0.5rem" }}
          >
            Loan Term (Years)
          </label>
          <input
            id="loanTerm"
            type="text"
            style={{ width: "100%", padding: "8px" }}
            value={loanTerm}
            onChange={(e) => setLoanTerm(e.target.value)}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: "10px",
            cursor: "pointer",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Calculate
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {results && (
        <div
          id="results"
          style={{
            display: "flex",
            gap: "1rem",
            marginTop: "24px",
            justifyContent: "space-around",
          }}
        >
          <div>
            <p style={{ display: "block", marginBottom: "0.5rem" }}>
              Total Payable Amount
            </p>
            <p>{results.total_amount.toFixed(2)}</p>
          </div>
          <div>
            <p style={{ display: "block", marginBottom: "0.5rem" }}>
              Monthly mortgage payment
            </p>
            <p>{results.monthly_payment.toFixed(2)}</p>
          </div>
          <div>
            <p style={{ display: "block", marginBottom: "0.5rem" }}>
              Interest Paid
            </p>
            <p>{results.interest_paid.toFixed(2)}</p>
          </div>
        </div>
      )}
    </div>
  );
}
