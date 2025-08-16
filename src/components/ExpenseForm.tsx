import { useEffect, useState } from "react";
import type { DraftExpense, Value } from "../types";
import { categories } from "../data/Categories";
import DatePicker from "react-date-picker";
import "react-calendar/dist/Calendar.css";
import "react-date-picker/dist/DatePicker.css";
import ErrorMessage from "./ErrorMessage";
import { useBudget } from "../hooks/useBudget";

export default function ExpenseForm() {
  const [expense, setExpense] = useState<DraftExpense>({
    expenseName: "",
    amount: 0,
    category: "",
    date: new Date(),
  });

  const [error, setError] = useState<string | null>(null);
  const { dispatch, state, remainingBudget } = useBudget();

  useEffect(() => {
    if (state.editingId) {
      const editingExpense = state.expenses.find(
        (currentExpense) => currentExpense.id === state.editingId
      );
      if (editingExpense) {
        const { expenseName, amount, category, date } = editingExpense;
        setExpense({ expenseName, amount, category, date });
        setError(null);
      }
    }
  }, [state.editingId, state.expenses]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const isAmountField = name === "amount";
    setExpense((prev) => ({
      ...prev,
      [name]: isAmountField ? Number(value) : value,
    }));
    if (error) setError(null);
  };

  const handleChangeDate = (value: Value) => {
    // react-date-picker puede entregar Date | Date[] | null
    if (value instanceof Date) {
      setExpense((prev) => ({ ...prev, date: value }));
      if (error) setError(null);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validación
    if (
      !expense.expenseName.trim() ||
      !expense.category ||
      !expense.date ||
      Number(expense.amount) <= 0 ||
      Number.isNaN(Number(expense.amount))
    ) {
      setError("Todos los campos son obligatorios y la cantidad debe ser > 0");
      return;
    }

    if (!state.editingId && expense.amount > remainingBudget) {
      setError("La cantidad excede el presupuesto disponible");
      return;
    }

    // Agregar o actualizar el gasto
    if (state.editingId) {
      dispatch({
        type: "update-expense",
        payload: { expense: { ...expense, id: state.editingId } },
      });
    } else {
      dispatch({ type: "add-expense", payload: { expense } });
    }

    // Reiniciar el state y limpiar errores
    setExpense({
      expenseName: "",
      amount: 0,
      category: "",
      date: new Date(),
    });
    setError(null);
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <legend className="uppercase text-center text-2xl font-black border-b-4 py-2 border-blue-500">
        {state.editingId ? "Guardar Cambios" : "Nuevo Gasto"}
      </legend>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <div className="flex flex-col gap-2">
        <label htmlFor="expenseName" className="text-xl">
          Nombre de gasto:
        </label>
        <input
          type="text"
          id="expenseName"
          placeholder="Añade el nombre del gasto"
          className="bg-slate-100 p-2"
          name="expenseName"
          value={expense.expenseName}
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="amount" className="text-xl">
          Cantidad:
        </label>
        <input
          type="number"
          id="amount"
          placeholder="Añade la cantidad del gasto ej:300"
          className="bg-slate-100 p-2"
          name="amount"
          value={expense.amount}
          onChange={handleChange}
          min={0}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="category" className="text-xl">
          Categoría:
        </label>
        <select
          name="category"
          id="category"
          value={expense.category}
          className="bg-slate-100 p-2"
          onChange={handleChange}
        >
          <option value="">--Seleccione--</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="date" className="text-xl">
          Fecha gasto:
        </label>
        <DatePicker
          id="date"
          className="bg-slate-100 p-2 border-2 border-blue-500 rounded-lg"
          value={expense.date}
          onChange={handleChangeDate}
        />
      </div>

      <input
        type="submit"
        className="bg-blue-500 cursor-pointer w-full p-2 text-white uppercase font-bold rounded-lg"
        value={state.editingId ? "Guardar Cambios" : "Registrar Gasto"}
      />
    </form>
  );
}
