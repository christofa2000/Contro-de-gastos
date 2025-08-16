import { useMemo } from "react";
import type { Expense } from "../types";
import AmountDisplay from "./AmountDisplay";
import { categories } from "../data/Categories";
import {
  LeadingActions,
  SwipeableList,
  SwipeableListItem,
  SwipeAction,
  TrailingActions
} from "react-swipeable-list";
import "react-swipeable-list/dist/styles.css";
import { useBudget } from "../hooks/useBudget";

type ExpenseDetailProps = {
  expense: Expense;
};

export default function ExpenseDetail({ expense }: ExpenseDetailProps) {
  const { dispatch } = useBudget();

  // ✅ depende solo de category; compara como string por si hay números
  const categoryInfo = useMemo(
    () => categories.find(cat => String(cat.id) === String(expense.category)),
    [expense.category]
  );

  const leadingActions = () => (
    <LeadingActions>
      <SwipeAction onClick={() => dispatch({ type: "get-expense-by-id", payload: { id: expense.id } })}>
        Actualizar
      </SwipeAction>
    </LeadingActions>
  );

  const trailingActions = () => (
    <TrailingActions>
      {/* ✅ agregar children para evitar TS2741 */}
      <SwipeAction
        destructive
        onClick={() => dispatch({ type: "remove-expense", payload: { id: expense.id } })}
      >
        Eliminar
      </SwipeAction>
    </TrailingActions>
  );

  // ✅ fallbacks seguros
  const icon = categoryInfo?.icon ?? "gastos";
  const name = categoryInfo?.name ?? "Sin categoría";

  // Si expense.date puede ser string/Date, normalizamos para evitar toLocaleString de 'string'
  const dateLabel =
    expense.date instanceof Date
      ? expense.date.toLocaleString()
      : new Date(expense.date as unknown as string).toLocaleString();

  return (
    <SwipeableList>
      <SwipeableListItem
        maxSwipe={1}
        leadingActions={leadingActions()}
        trailingActions={trailingActions()}
      >
        <div className="bg-white shadow-lg p-10 w-full border-b border-gray-200 flex gap-5 items-center">
          <div>
            <img
              src={`/icono_${icon}.svg`}
              alt={`icono ${name}`}
              className="w-20"
            />
          </div>

          <div className="flex-1 space-y-2">
            <p className="text-sm font-bold text-shadow-slate-500">
              {name}
            </p>
            <p>{expense.expenseName}</p>
            <p className="text-slate-600 text-sm">{dateLabel}</p>
          </div>

          <AmountDisplay amount={expense.amount} />
        </div>
      </SwipeableListItem>
    </SwipeableList>
  );
}
