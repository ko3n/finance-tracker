const JournalModal = ({isOpen, onClose, unlockedJournal = []}) => {
    if (!isOpen) return null;

    const MAX_SPRITES = {
        common: 1,
        rare: 1,
        legendary: 1
    };

    const totalPossible = MAX_SPRITES.common + MAX_SPRITES.rare + MAX_SPRITES.legendary;

    const renderSpriteGrid = (rarity, count) => {
        const sprites = Array.from({ length: count }, (_, i) => `${rarity}-sprites/${i + 1}.png`);

        return (
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 mb-6">
                {sprites.map((path) => {
                    const isUnlocked = unlockedJournal?.includes(path);
                    return (
                        <div key={path} className="flex flex-col items-center gap-1">
                            <div className={`w-14 h-14 border-2 flex items-center justify-center bg-gray-50 shadow-[2px_2px_0px_black] 
                                ${isUnlocked ? 'border-black' : 'border-dashed border-black/20'}`}>
                                {isUnlocked ? (
                                    <img
                                        src={`/sprites/${path}`}
                                        alt="sprite"
                                        className="w-10 h-10 object-contain"
                                        style={{ imageRendering: 'pixelated' }}
                                    />
                                ) : (
                                    <div
                                        className="w-8 h-8 bg-black opacity-10"
                                        style={{
                                            maskImage: `url(/sprites/${path})`,
                                            maskSize: 'contain',
                                            maskRepeat: 'no-repeat',
                                            maskPosition: 'center',
                                            WebkitMaskImage: `url(/sprites/${path})`
                                        }}
                                    />
                                )}
                            </div>
                            <span className={`text-[8px] font-bold ${isUnlocked ? 'text-green-600' : 'text-gray-400'}`}>
                                {isUnlocked ? 'FOUND' : '???'}
                            </span>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white border-4 border-black p-6 w-full max-w-md max-h-[80vh] overflow-y-auto shadow-[8px_8px_0px_black] relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 border-2 border-black bg-white px-2 font-black hover:bg-red-500 hover:text-white transition-colors"
                >
                    X
                </button>

                <h2 className="text-xl font-black mb-2 uppercase italic border-b-4 border-black inline-block">NPC Journal</h2>

                {/* Progress Bar */}
                <div className="mb-6 mt-2">
                    <div className="flex justify-between text-[10px] font-bold mb-1">
                        <span>COLLECTION</span>
                        <span>{unlockedJournal.length} / {totalPossible}</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 border border-black">
                        <div
                            className="bg-green-500 h-full transition-all duration-500"
                            style={{ width: `${(unlockedJournal.length / totalPossible) * 100}%` }}
                        />
                    </div>
                </div>

                <h3 className="text-xs font-black text-gray-500 mb-3 uppercase tracking-widest">Common Sprites</h3>
                {renderSpriteGrid('common', MAX_SPRITES.common)}

                <h3 className="text-xs font-black text-blue-500 mb-3 uppercase tracking-widest">Rare Sprites</h3>
                {renderSpriteGrid('rare', MAX_SPRITES.rare)}

                <h3 className="text-xs font-black text-yellow-600 mb-3 uppercase tracking-widest">Legendary Sprites</h3>
                {renderSpriteGrid('legendary', MAX_SPRITES.legendary)}
            </div>
        </div>
    );
};

export default JournalModal;