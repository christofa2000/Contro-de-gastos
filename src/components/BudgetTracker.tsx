import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { useBudget } from "../hooks/useBudget";
import AmountDisplay from "./AmountDisplay";
import "react-circular-progressbar/dist/styles.css";

export default function BudgetTracker() {
  const { state, totalExpenses, remainingBudget, dispatch } = useBudget();

  // number para el componente; string sólo para mostrar
  const percentage = state.budget > 0 ? (totalExpenses / state.budget) * 100 : 0;
  const percentageLabel = percentage.toFixed(2);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div className="flex justify-center">
        <CircularProgressbar
          value={percentage}                 // ✅ number
          text={`${percentageLabel}% Gastado`} // ✅ string para el centro
          styles={buildStyles({
            pathColor:
              totalExpenses > state.budget ? "#e63946" : "url(#blueGradient)",
            trailColor: "#e0e0e0",
            textColor: totalExpenses > state.budget ? "#e63946" : "#1e40af",
            textSize: "10px",
            strokeLinecap: "round",
          })}
        />

        {/* Degradado azul para el path */}
        <svg style={{ height: 0 }}>
          <defs>
            <linearGradient id="blueGradient" gradientTransform="rotate(90)">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1e3a8a" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="flex flex-col justify-center items-center gap-8">
        <button
          type="button"
          className="bg-pink-600 w-full text-white uppercase font-bold rounded-lg"
          onClick={() => dispatch({ type: "reset-app" })}
        >
          Resetear App
        </button>

        <AmountDisplay label="presupuesto" amount={state.budget} />
        <AmountDisplay label="Disponible" amount={remainingBudget} />
        <AmountDisplay label="Gastado" amount={totalExpenses} />
      </div>
    </div>
  );
}
