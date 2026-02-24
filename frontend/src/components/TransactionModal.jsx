const TransactionModal = ({
    modalOpen,
    mode,
    inputValue,
    description,
    categories,
    selectedCatId,
    setInputValue,
    setDescription,
    setSelectedCatId,
    setModalOpen,
    handleSubmit
}) => {
    if (!modalOpen) return null;

    return (
        <div className="wrapper crt fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-70">
            <div className="bg-white border-4 border-black p-6 w-full max-w-xs shadow-[8px_8px_0px_black]">
                <h2 className="bg-black text-white p-2 text-center font-bold mb-4 uppercase text-xs glow-white">Transaction</h2>
                <form onSubmit={handleSubmit}>
                    <input 
                        autoFocus 
                        type="text" 
                        value={(() => {
                            if(!inputValue) return '';
                            const[whole, decimal] = inputValue.split('.');
                            const formattedWhole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                            return decimal !== undefined ? `${formattedWhole}.${decimal}` : formattedWhole;
                        }) ()} 
                        onChange={e => {
                            const val = e.target.value;
                            const cleanValue = val.replace(/,/g, '');
                            if(/^\d*\.?\d*$/.test(cleanValue)){
                                setInputValue(cleanValue);
                            }
                        }} 
                        className="w-full border-2 border-black p-2 mb-2 bg-white outline-none" 
                        placeholder="0.00" 
                    />
                    <textarea 
                        placeholder="Write something here..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border-2 border-black p-2 bg-white outline-none"
                    />
                    {mode === 'sub' && categories.length > 0 && (
                        <select
                            className="w-full border-2 border-black p-2 mb-4 bg-white font-bold text-xs"
                            onChange={(e) => setSelectedCatId(e.target.value)}
                            value={selectedCatId}
                        >
                            <option value="">SELECT CATEGORY (OPTIONAL)</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    )}
                    <div className="flex gap-2">
                        <button type="submit" className="flex-1 bg-[#daa520] text-white border-2 border-black p-2 font-bold text-xs shadow-[2px_2px_0px_black] glow-white active:translate-y-0.5">CONFIRM</button>
                        <button type="button" onClick={() => {setModalOpen(false); setInputValue(''); setDescription('');}} className="flex-1 bg-white border-2 border-black p-2 font-bold text-xs shadow-[2px_2px_0px_black] active:translate-y-0.5">ABORT</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TransactionModal;
