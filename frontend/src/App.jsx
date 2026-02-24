import { useState, useEffect, useCallback} from 'react'
import movementEngine from './utils/movementEngine.js'
import Interface from './components/interface.jsx'

function App(){
    const [balance, setBalance] = useState(() => {
        const saved = localStorage.getItem('financeTracker_balance');
        return saved !== null ? parseFloat(saved) : 0;
    });

    const [history, setHistory] = useState(() => {
        const saved = localStorage.getItem('financeTracker_history');
        return saved !== null ? JSON.parse(saved) : [];
    });

    const [withdrawalDebt, setWithdrawalDebt] = useState(() => {
        const saved = localStorage.getItem('financeTracker_debt');
        return saved !== null ? parseFloat(saved) : 0;
    });

    const [depositCredit, setDepositCredit] = useState(() => {
        const saved = localStorage.getItem('financeTracker_credit');
        return saved !== null ? parseFloat(saved) : 0;
    });

    const [population, setPopulation] = useState(() => {
        const saved = localStorage.getItem('financeTracker_population');
        return saved !== null ? parseInt(saved) : Math.floor(balance / 1000);
    });

    const [npcs, setNpcs] = useState(() => {
        const saved = localStorage.getItem('financeTracker_npcs');
        return saved ? JSON.parse(saved) : [];
    });

    const [categories, setCategories] = useState(() => {
        const saved = localStorage.getItem('financeTracker_categories');
        return saved ? JSON.parse(saved) : [];
    });

    const [reset, setReset] = useState(() => {
        return localStorage.getItem('financeTracker_reset') || '';
    });

    const [unlockedJournal, setUnlockedJournal] = useState(() => {
        const saved = localStorage.getItem('financeTracker_journal');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('financeTracker_balance', balance.toString());
    }, [balance]);

    useEffect(() => {
        localStorage.setItem('financeTracker_history', JSON.stringify(history));
    }, [history]);

    useEffect(() => {
        localStorage.setItem('financeTracker_debt', withdrawalDebt.toString());
    }, [withdrawalDebt]);

    useEffect(() => {
        localStorage.setItem('financeTracker_credit', depositCredit.toString());
    }, [depositCredit]);

    useEffect(() => {
        localStorage.setItem('financeTracker_population', population.toString());
    }, [population]);

    useEffect(() => {
        localStorage.setItem('financeTracker_npcs', JSON.stringify(npcs));
    }, [npcs]);
    
    useEffect(() => {
        localStorage.setItem('financeTracker_categories', JSON.stringify(categories));
    }, [categories]);

    useEffect(() => {
        localStorage.setItem('financeTracker_reset', reset);
    }, [reset]);

    useEffect(() => {
        localStorage.setItem('financeTracker_journal', JSON.stringify(unlockedJournal));
    }, [unlockedJournal]);

    useEffect(() => {
        const currentMonth = new Date().getMonth() + "-" + new Date().getFullYear();

        if(reset !== "" && reset !== currentMonth){
            setCategories(prev => prev.map(cat => ({ ...cat, spent: 0 })));
        }

        if(reset !== currentMonth){
            setReset(currentMonth);
        }
    }, [reset]);

    useEffect(() => {
        if (npcs && npcs.length > 0) {
            setUnlockedJournal(prev => {
                const currentSprites = npcs.map(n => n.spriteSrc);

                const validSprites = currentSprites.filter(src => src);

                const newJournal = [...new Set([...prev, ...validSprites])];

                if (newJournal.length !== prev.length) {
                    console.log("New sprite discovered! Updating journal...");
                    return newJournal;
                }
                return prev;
            });
        }
    }, [npcs]);

    const handleTransaction = useCallback((amount, mode, description, categoryId) => {
        const isWithdrawal = mode === 'sub';

        if(isWithdrawal && balance - amount < 0){
            alert('insufficient funds!');
            return;
        }

        const timeStamp = new Date().toLocaleString('en-US', {
            year: 'numeric', month: 'numeric', day: 'numeric',
            hour: 'numeric', minute: '2-digit', hour12: true
        }).replace(/,/g, '').replace(/\s([AP]M)$/, '$1');

        setBalance(prev => isWithdrawal ? prev - amount : prev + amount);
        setHistory(prev => [{ type: mode, amount, description, date: timeStamp }, ...prev]);

        if(isWithdrawal){
            const newDebt = withdrawalDebt + amount;
            const npcsToRemove = Math.floor(newDebt / 1000);

            setWithdrawalDebt(newDebt % 1000);

            if(npcsToRemove > 0){
                setPopulation(Math.max(0, population - npcsToRemove));
            }
        }else{
            const newCredit = depositCredit + amount;
            const npcsToAdd = Math.floor(newCredit /  1000);

            setDepositCredit(newCredit % 1000);

            if(npcsToAdd > 0){
                setPopulation(population + npcsToAdd);
            }
        }

        if(mode === 'sub' && categoryId){
            setCategories(prev => prev.map(cat => 
                cat.id === categoryId ? { ...cat, spent: Number(cat.spent) + Number(amount) } : cat
            ));
        }
    }, [balance, population, withdrawalDebt, depositCredit, categories]);

    const {npcsRef} = movementEngine(population, 100, npcs, setNpcs);

    return(
        <div className="App">
            <Interface 
                balance={balance}
                history={history}
                onAdd={handleTransaction}
                population={population}
                withdrawalDebt={withdrawalDebt}
                depositCredit={depositCredit}
                npcsRef={npcsRef}
                categories={categories}
                setCategories={setCategories}
                unlockedJournal={unlockedJournal}
            />
        </div>
    )
}

export default App;