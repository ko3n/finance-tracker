const MobileMenu = ({
    isMenuOpen,
    setIsMenuOpen,
    population,
    withdrawalDebt,
    depositCredit,
    history,
    setMode,
    setModalOpen
}) => {
    if (!isMenuOpen) return null;

    return (
        <div className="wrapper crt fixed inset-0 z-[60] flex">
            {/* Backdrop */}
            <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />

            {/* Drawer Content */}
            <div className="w-[80%] max-w-[300px] bg-white border-l-4 border-black h-full flex flex-col p-4 overflow-y-auto no-scrollbar">
                <button
                    onClick={() => setIsMenuOpen(false)}
                    className="self-end text-black mb-4 font-bold border-2 border-black px-2 py-1 text-xs"
                >
                    CLOSE [X]
                </button>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={() => { setMode('add'); setModalOpen(true); }}
                        className="bg-white text-black border-2 border-black p-3 font-bold text-[10px] shadow-[2px_2px_0px_black] active:translate-y-0.5 active:shadow-none transition-all"
                    >
                        + DEPOSIT
                    </button>
                    <button
                        onClick={() => { setMode('sub'); setModalOpen(true); }}
                        className="bg-white text-black border-2 border-black p-3 font-bold text-[10px] shadow-[2px_2px_0px_black] active:translate-y-0.5 active:shadow-none transition-all"
                    >
                        - WITHDRAW
                    </button>
                </div>
                <div className="mt-2 space-y-4">
                    <div className="bg-blue-600 text-white text-[10px] p-1 inline-block font-bold mt-1">POP: {population}</div>
                    {/* Progress Bars */}
                    <div className="space-y-3">
                        <div>
                            <div className="text-[8px] text-black font-bold">WITHDRAWAL DEBT</div>
                            <div className="w-full bg-black/10 h-2 border border-black mt-1">
                                <div className="bg-gray-600 h-full transition-all" style={{ width: `${(withdrawalDebt / 1000) * 100}%` }} />
                            </div>
                        </div>
                        <div>
                            <div className="text-[8px] text-black font-bold">DEPOSIT CREDIT</div>
                            <div className="w-full bg-black/10 h-2 border border-black mt-1">
                                <div className="bg-gray-400 h-full transition-all" style={{ width: `${(depositCredit / 1000) * 100}%` }} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Transaction History Section */}
                <div className="mt-5 flex-1">
                    <h3 className="text-[10px] font-bold uppercase mb-2 bg-black text-white p-1">History_Log</h3>
                    <div className="space-y-2 text-[10px]">
                        {history.slice(0, 10).map((item, i) => (
                            <div key={i} className="border-b border-black/10 pb-1 flex justify-between">
                                <span className="opacity-50 text-black">{item.date.split(' ')[0]}</span>
                                <span className={item.type === 'add' ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                                    {item.type === 'add' ? '+' : '-'}₱{item.amount}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MobileMenu;
