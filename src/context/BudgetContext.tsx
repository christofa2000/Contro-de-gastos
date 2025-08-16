import { useReducer, createContext, useMemo } from "react";
import type { Dispatch, ReactNode } from "react";
import { budgetReducer, initialState } from "../reducers/budget-reducer";
import type { BudgetActions, BudgetState } from "../reducers/budget-reducer";

type BudgetContextProps = {
  state: BudgetState;
  dispatch: Dispatch<BudgetActions>;
  totalExpenses: number;
  remainingBudget: number;
};

type BudgetProviderProps = {
  children: ReactNode;
};

export const BudgetContext = createContext<BudgetContextProps>({
  state: initialState,
  dispatch: () => null,
  totalExpenses: 0,     // ✅ valores iniciales seguros
  remainingBudget: 0,   // ✅
});

export const BudgetProvider = ({ children }: BudgetProviderProps) => {
  const [state, dispatch] = useReducer(budgetReducer, initialState);

  const totalExpenses = useMemo(
    () => state.expenses.reduce((total, expense) => total + expense.amount, 0),
    [state.expenses]
  );
  const remainingBudget = state.budget - totalExpenses;

  return (
    <BudgetContext.Provider
      value={{
        state,
        dispatch,
        totalExpenses,
        remainingBudget,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
};
