const RightPanel = ({ history, categories, setHistoryOpen }) => {
    return (
        <aside className="hidden md:flex col-span-3 row-span-11 border-2 border-black bg-white p-4 overflow-hidden flex-col">
            <h3 className="text-[10px] font-bold uppercase mb-4 bg-black text-white p-2 glow-white">transaction_log</h3>
            <div className="flex-1 pr-4 mb-2 overflow-y-auto space-y-2 text-[11px]">
                {history.slice(0, 10).map((item, i) => (
                    <div key={i} onClick={() => setHistoryOpen(item)} className="border-b border-black/10 pb-1 flex justify-between">
                        <span className="opacity-50">{item.date}</span>
                        <span className={item.type === 'add' ? 'text-green-600' : 'text-red-600'}>
                            {item.type === 'add' ? 'IN' : 'OUT'} ₱{item.amount}
                        </span>
                    </div>
                ))}
            </div>
            <div className="mb-6">
                <h3 className="text-[10px] font-bold uppercase mb-2 bg-black text-white p-2 glow-white">budget_monitoring</h3>
                <div className="space-y-3 overflow-y-auto max-h-[200px] pr-2">
                    {categories.map(cat => (
                        <div key={cat.id}>
                            <div className="flex justify-between text-[9px] font-bold">
                                <span>{cat.name}</span>
                                <span className={cat.spent > cat.limit ? "text-red-600" : ""}>
                                    ₱{cat.spent}/₱{cat.limit}
                                </span>
                            </div>
                            <div className="w-full h-2 border border-black bg-gray-100 mt-1">
                                <div
                                    className={`h-full transition-all duration-500 ${cat.spent > cat.limit ? 'bg-red-500' : 'bg-green-500'}`}
                                    style={{ width: `${Math.min((cat.spent / cat.limit) * 100, 100)}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    );
};

export default RightPanel;
