import { useState, useEffect } from 'react'

const LeftPanel = ({ balance, population, withdrawalDebt, depositCredit, targetNpc, setTargetNpc, setNpcs, setBudgetModalOpen, setMode, setModalOpen, setJournalOpen }) => {
    const [npcName, setNpcName] = useState(targetNpc?.name || '');

    useEffect(() => {
        setNpcName(targetNpc?.name || '');
    }, [targetNpc]);

    return (
        <aside className="hidden md:flex col-span-3 row-span-11 border-2 border-black bg-white p-4 flex-col gap-4">
            <div>
                <h2 className="bg-[#e7ee4f] text-[12px] text-black p-1 uppercase font-bold inline-block glow-white">Total Assets</h2>
                <div className="text-4xl font-black">₱{balance.toLocaleString()}</div>
            </div>
            <div className="flex flex-col gap-2">
                <button onClick={() => { setMode('add'); setModalOpen(true); }} className="bg-white border-2 border-black p-3 font-bold text-xs shadow-[2px_2px_0px_black] active:translate-y-0.5 transition-all">+ DEPOSIT</button>
                <button onClick={() => { setMode('sub'); setModalOpen(true); }} className="bg-white border-2 border-black p-3 font-bold text-xs shadow-[2px_2px_0px_black] active:translate-y-0.5 transition-all">- WITHDRAW</button>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-4">
                <button onClick={() => setBudgetModalOpen(true)} className="aspect-square border-2 border-black bg-white hover:bg-gray-100 flex flex-col items-center justify-center font-bold text-[10px] shadow-[2px_2px_0px_black] active:translate-y-0.5">
                    <span className="text-xl">▦</span> BUDGET
                </button>
                <button onClick={() => setJournalOpen(true)} className="aspect-square border-2 border-black bg-white hover:bg-gray-100 flex flex-col items-center justify-center font-bold text-[10px] shadow-[2px_2px_0px_black] active:translate-y-0.5">
                    <span className="text-xl">▤</span> JOURNAL
                </button>
                <div className="aspect-square border-2 border-dashed border-black/30 bg-gray-50 flex items-center justify-center opacity-50">
                    <span className="text-[8px] text-center">SLOT<br/>EMPTY</span>
                </div>
            </div>
            <div
                className={
                    `col-span-2 bg-gray-50 p-2 flex items-center justify-center shadow-[2px_2px_0px_black] border-2
                    ${targetNpc
                        ? 'border-black'
                        : 'border-dashed p-6 border-black/30 opacity-50'
                    }`
               }
            >
                {targetNpc ? (
                    <div className="flex items-center gap-3 opacity-100">
                        {/* NPC Image */}
                        <div className="w-12 h-12 bg-white border border-black flex-shrink-0 flex items-center justify-center overflow-hidden">
                            <img
                                src={`/sprites/${targetNpc.spriteSrc}`}
                                alt="npc"
                                className="w-16 h-16 max-w-none"
                                style={{ imageRendering: 'pixelated' }}
                            />
                        </div>

                        {/* NPC Data */}
                        <div className="flex flex-col min-w-0">
                            <div className="text-[10px] font-bold truncate uppercase">
                                {targetNpc.rarity} TYPE
                            </div>
                            <div className="flex items-center gap-1 text-[8px] uppercase">
                                <span className="opacity-60">Name:</span>
                                <input 
                                    type="text"
                                    value={npcName}
                                    onChange={(e) => setNpcName(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            setTargetNpc(prev => ({ ...prev, name: npcName }));
                                            setNpcs(prev => prev.map(npc =>
                                                npc === targetNpc ? { ...npc, name: npcName } : npc
                                            ));
                                            e.target.blur();
                                        }
                                    }}
                                    onBlur={() => {
                                        setNpcs(prev => prev.map(npc =>
                                            npc === targetNpc ? { ...npc, name: npcName } : npc
                                        ));
                                        setTargetNpc(prev => ({ ...prev, name: npcName }));
                                    }}
                                    className="text-[9px] font-bold leading-tight w-full bg-gray-100 border border-black p-0.5 outline-none"
                                    
                                />
                            </div>
                            <div className="flex items-center gap-1 text-[8px] uppercase">
                                <span className="opacity-60">Created:</span>
                                <span className="text-[9px] font-bold leading-tight">
                                    {targetNpc.createdAt
                                        ? new Date(parseInt(targetNpc.createdAt)).toLocaleDateString()
                                        : 'N/A'}
                                </span>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setTargetNpc(null);
                                }}
                                className="text-[8px] mt-1 text-center p-1 text-white bg-black underline"
                            >
                                DESELECT
                            </button>
                        </div>
                    </div>
                ) : (
                    <span className="text-[8px] text-center font-bold">
                        CLICK AN NPC
                    </span>
                )}
            </div>
            <div className="mt-auto">
                <div className="bg-blue-600 text-white text-[10px] p-1 inline-block font-bold">POPULATION: {population}</div>
                <div className="mt-2 w-full bg-black/10 h-2 border border-black">
                    <div
                        className="bg-gray-600 h-full transition-all duration-500"
                        style={{ width: `${(withdrawalDebt / 1000) * 100}%` }}
                    />
                </div>
                <div className="text-[8px] mt-1 font-bold italic">
                    NEXT NPC DELETED AT: ₱{(1000 - withdrawalDebt).toFixed(0)}
                </div>
                <div className="mt-2 w-full bg-black/10 h-2 border border-black">
                    <div
                        className="bg-gray-400 h-full transition-all duration-500"
                        style={{ width: `${(depositCredit / 1000) * 100}%` }}
                    />
                </div>
                <div className="text-[8px] mt-1 font-bold italic">
                    NEXT NPC AT: ₱{(1000 - depositCredit).toFixed(0)}
                </div>
            </div>
        </aside>
    );
};

export default LeftPanel;
