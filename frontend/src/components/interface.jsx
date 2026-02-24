import { useState, useRef } from 'react'
import { Camera } from '../utils/camera.js'
import LeftPanel from './LeftPanel.jsx'
import RightPanel from './RightPanel.jsx'
import CentralViewport from './CentralViewport.jsx'
import TransactionModal from './TransactionModal.jsx'
import HistoryDetailModal from './HistoryDetailModal.jsx'
import BudgetModal from './BudgetModal.jsx'
import MobileMenu from './MobileMenu.jsx'
import JournalModal from './JournalModal.jsx'

const Interface = ({balance, history, onAdd, population, withdrawalDebt, depositCredit, npcsRef, categories, setCategories, unlockedJournal = []}) => {
    const viewPortRef = useRef(null);
    const canvasRef = useRef(null);

    const{
        camera,
        dimensions,
        followNpc,
        targetNpc,
        setTargetNpc,
        handleCameraDown,
        handleCameraMove,
        handleCameraUp,
        handleTouchStart,
        handleTouchEnd,
        handleTouchMove
    } = Camera(viewPortRef);

    const [modalOpen, setModalOpen] = useState(false);
    const [mode, setMode] = useState('add');
    const [inputValue, setInputValue] = useState('');
    const [description, setDescription] = useState('');
    const [historyOpen, setHistoryOpen] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [budgetModalOpen, setBudgetModalOpen] = useState(false);
    const [newCatName, setNewCatName] = useState('');
    const [newCatLimit, setNewCatLimit] = useState('');
    const [selectedCatId, setSelectedCatId] = useState('');
    const [_, setNpcs] = useState(npcsRef.current);
    const [journalOpen, setJournalOpen] = useState(false);

    const updateNpcs = (newNpcs) => {
        const actualNpcs = typeof newNpcs === 'function' ? newNpcs(npcsRef.current) : newNpcs;
        npcsRef.current = actualNpcs;
        setNpcs(actualNpcs);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const val = Math.abs(parseFloat(inputValue));

        if(isNaN(val) || val === 0) return;

        onAdd(val, mode, description, selectedCatId);
        setInputValue('');
        setSelectedCatId('');
        setDescription('');
        setModalOpen(false);
    };

    const addCategory = () => {
        if(!newCatName || !newCatLimit) return;

        const newCat = {
            id: Date.now().toString(),
            name: newCatName.toUpperCase(),
            limit: parseFloat(newCatLimit),
            spent: 0
        };

        setCategories([ ...categories, newCat ]);
        setNewCatName(''); setNewCatLimit('');
    };

    const deleteCategory = (id) => {
        setCategories(categories.filter(c => c.id !== id));
    };

    const handleCanvasClick = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const worldX = (mouseX - camera.x) / camera.scale;
        const worldY = (mouseY - camera.y) / camera.scale;

        const worldWidth = dimensions.width * 3;
        const worldHeight = dimensions.height * 3;

        const clickedNpc = npcsRef.current.find(npc => {
            const npcX = (npc.x / 100) * worldWidth;
            const npcY = (npc.y / 100) * worldHeight;

            const distance = Math.sqrt(
                Math.pow(worldX - npcX, 2) + Math.pow(worldY - npcY, 2)
            );
            return distance < 32 * camera.scale;
        });

        if(clickedNpc){
            followNpc(clickedNpc);
        }
    };

    return(
        <div className="wrapper crt h-screen w-screen overflow-hidden select-none bg-white font-mono text-black">
            <div className="flex h-full flex-col md:grid md:grid-cols-12 md:grid-rows-12 md:gap-1 md:p-2">

                {/* TOP BAR */}
                <header className="hidden md:flex col-span-12 row-span-1 border-2 border-black bg-white items-center justify-between px-4">
                    <div className="font-bold tracking-widest uppercase">FINANCE APP</div>
                    <div className="text-[10px] font-bold">VERSION: <span className="bg-black text-white px-2 py-1 glow-white">1.0</span></div>
                </header>

                {/* COMPONENTS */}
                <LeftPanel
                    balance={balance}
                    population={population}
                    withdrawalDebt={withdrawalDebt}
                    depositCredit={depositCredit}
                    targetNpc={targetNpc}
                    setTargetNpc={setTargetNpc}
                    setNpcs={updateNpcs}
                    setBudgetModalOpen={setBudgetModalOpen}
                    setMode={setMode}
                    setModalOpen={setModalOpen}
                    setJournalOpen={setJournalOpen}
                />

                <CentralViewport
                    viewPortRef={viewPortRef}
                    canvasRef={canvasRef}
                    camera={camera}
                    dimensions={dimensions}
                    npcsRef={npcsRef}
                    handleCameraDown={handleCameraDown}
                    handleCameraMove={handleCameraMove}
                    handleCameraUp={handleCameraUp}
                    handleTouchStart={handleTouchStart}
                    handleTouchEnd={handleTouchEnd}
                    handleTouchMove={handleTouchMove}
                    handleCanvasClick={handleCanvasClick}
                />

                <RightPanel
                    history={history}
                    categories={categories}
                    setHistoryOpen={setHistoryOpen}
                />

                {/* MOBILE UI */}
                <div className="md:hidden">
                    {/* TOP BAR OVERLAY */}
                    <div className="absolute top-5 left-4 right-4 flex justify-between items-start pointer-events-none">
                        {/* Quick Balance View */}
                        <div className="bg-black text-white p-2 text-right pointer-events-auto shadow-[4px_4px_0px_black]">
                            <div className="text-[8px] opacity-70">CURRENT ASSETS</div>
                            <div className="text-sm font-black">₱{balance.toLocaleString()}</div>
                        </div>

                        {/* Menu Toggle Button */}
                        <button
                            onClick={() => setIsMenuOpen(true)}
                            className="bg-white text-black border-2 border-black p-3 pointer-events-auto shadow-[4px_4px_0px_black] active:translate-y-1 active:shadow-none font-bold text-xs"
                        >
                            MENU
                        </button>
                    </div>
                </div>

                {/* MODALS */}
                <TransactionModal
                    modalOpen={modalOpen}
                    mode={mode}
                    inputValue={inputValue}
                    description={description}
                    categories={categories}
                    selectedCatId={selectedCatId}
                    setInputValue={setInputValue}
                    setDescription={setDescription}
                    setSelectedCatId={setSelectedCatId}
                    setModalOpen={setModalOpen}
                    handleSubmit={handleSubmit}
                />

                <HistoryDetailModal
                    historyOpen={historyOpen}
                    setHistoryOpen={setHistoryOpen}
                />

                <BudgetModal
                    budgetModalOpen={budgetModalOpen}
                    setBudgetModalOpen={setBudgetModalOpen}
                    categories={categories}
                    newCatName={newCatName}
                    setNewCatName={setNewCatName}
                    newCatLimit={newCatLimit}
                    setNewCatLimit={setNewCatLimit}
                    addCategory={addCategory}
                    deleteCategory={deleteCategory}
                />

                <JournalModal
                    isOpen={journalOpen}
                    onClose={() => setJournalOpen(false)}
                    npcs={unlockedJournal}
                />

                <MobileMenu
                    isMenuOpen={isMenuOpen}
                    setIsMenuOpen={setIsMenuOpen}
                    balance={balance}
                    population={population}
                    withdrawalDebt={withdrawalDebt}
                    depositCredit={depositCredit}
                    history={history}
                    setMode={setMode}
                    setModalOpen={setModalOpen}
                />
            </div>
        </div>
    );
}

export default Interface;