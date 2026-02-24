const HistoryDetailModal = ({ historyOpen, setHistoryOpen }) => {
    if (!historyOpen) return null;

    return (
        <div className="wrapper crt fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[90]">
            <div className="bg-white border-4 border-black p-6 w-full max-w-xs shadow-[8px_8px_0px_black]">
                <h2 className="bg-black text-white p-2 text-center font-bold mb-4 uppercase text-xs glow-white">
                    Entry_Details
                </h2>

                <div className="space-y-4 font-mono text-sm">
                    <div>
                        <div className="text-[10px] opacity-50 uppercase">Date/Time</div>
                        <div className="font-bold border-b border-black/10 pb-1">{historyOpen.date}</div>
                    </div>

                    <div>
                        <div className="text-[10px] opacity-50 uppercase">Amount</div>
                        <div className={`text-xl font-black ${historyOpen.type === 'add' ? 'text-green-600' : 'text-red-600'}`}>
                            {historyOpen.type === 'add' ? '+' : '-'} ₱{historyOpen.amount.toLocaleString()}
                        </div>
                    </div>

                    <div>
                        <div className="text-[10px] opacity-50 uppercase">Memo/Description</div>
                        <div className="p-2 border-2 border-dashed border-black/20 bg-gray-50 min-h-[60px] break-words">
                            {historyOpen.description || "No description provided."}
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => setHistoryOpen(null)}
                    className="w-full mt-6 bg-black text-white p-2 font-bold text-xs shadow-[2px_2px_0px_#666] active:translate-y-0.5 active:shadow-none transition-all"
                >
                    RETURN_TO_SYSTEM
                </button>
            </div>
        </div>
    );
};

export default HistoryDetailModal;
