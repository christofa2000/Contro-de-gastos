import { useContext } from "react"
import { BudgetContext } from "../context/budgetContext"


export const useBudget = () => {
    const context = useContext(BudgetContext)
    if(!context) {
        throw new Error("usebudget must be used with a BudgetProvider");
        
    }
    return context

}