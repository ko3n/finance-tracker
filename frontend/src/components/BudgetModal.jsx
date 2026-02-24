const BudgetModal = ({
    budgetModalOpen,
    setBudgetModalOpen,
    categories,
    newCatName,
    setNewCatName,
    newCatLimit,
    setNewCatLimit,
    addCategory,
    deleteCategory
}) => {
    if (!budgetModalOpen) return null;

    return (
        <div className="wrapper crt fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[80]">
            <div className="bg-white border-4 border-black p-6 w-full max-w-md shadow-[8px_8px_0px_black]">
                <h2 className="bg-black text-white p-2 text-center font-bold mb-4 uppercase text-xs">Budget_Setup</h2>

                {/* Add New Category */}
                <div className="flex gap-2 mb-6">
                    <input
                        placeholder="NAME"
                        value={newCatName}
                        onChange={e => setNewCatName(e.target.value)}
                        className="flex-1 border-2 border-black p-1 text-xs uppercase outline-none"
                    />
                    <input
                        placeholder="LIMIT"
                        type="number"
                        value={newCatLimit}
                        onChange={e => setNewCatLimit(e.target.value)}
                        className="w-24 border-2 border-black p-1 text-xs outline-none"
                    />
                    <button onClick={addCategory} className="bg-black text-white px-3 font-bold text-[10px]">+</button>
                </div>

                {/* List of Categories */}
                <div className="max-h-48 overflow-y-auto border-t-2 border-black pt-4">
                    {categories.length === 0 && <div className="text-[10px] italic text-center opacity-50">NO BUDGETS DEFINED</div>}
                    {categories.map(cat => (
                        <div key={cat.id} className="flex justify-between items-center mb-2 border-b border-black/10 pb-1">
                            <span className="text-[10px] font-bold">{cat.name} (₱{cat.limit})</span>
                            <button onClick={() => deleteCategory(cat.id)} className="text-red-600 font-bold text-[10px] hover:underline">[DELETE]</button>
                        </div>
                    ))}
                </div>

                <button
                    onClick={() => setBudgetModalOpen(false)}
                    className="w-full mt-4 border-2 border-black p-2 font-bold text-xs hover:bg-black hover:text-white transition-colors"
                >
                    CLOSE_SYSTEM
                </button>
            </div>
        </div>
    );
};

export default BudgetModal;
