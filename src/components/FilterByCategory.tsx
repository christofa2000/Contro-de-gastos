import { categories } from "../data/Categories";
import { useBudget } from "../hooks/useBudget";

export default function FilterByCategory() {
    const { dispatch } = useBudget();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch({
            type: "add-filter-category",
            payload: { id: e.target.value }
        });
    };

    return (
        <div className="bg-white shadow-lg rounded-lg p-10">
            <form>
                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-5">
                    <label htmlFor="category" className="block text-gray-700">
                        Filtrar por categoría
                    </label>
                    <select
                        id="category"
                        className="mt-1 block w-full bg-slate-100"
                        onChange={handleChange}
                    >
                        <option value="">Todas las categorías</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
            </form>
        </div>
    );
}
