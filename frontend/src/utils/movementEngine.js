import { useEffect, useRef } from 'react'
import { RARITY_CONFIG } from './config.js'
import { Name as generateName } from './generateName.js'

export default function movementEngine(count, area = 100, initialData, setNpcs){
    const npcsRef = useRef(initialData || []);
    const requestRef = useRef();

    const getRarity = () => {
        const totalWeight = Object.values(RARITY_CONFIG).reduce((sum, r) => sum + r.weight, 0);
        let random = Math.random() * totalWeight;
        for(const [key, rarity] of Object.entries(RARITY_CONFIG)){
            if(random < rarity.weight) return key;
            
            random -= rarity.weight;
        }
        return 'COMMON';
    };

    useEffect(() => {
        const currentCount = npcsRef.current.length;
        if(count > currentCount){
            const newNpcs = [];
            
            for(let i = 0; i < count - currentCount; i++){
                const rarityKey = getRarity();
                const config = RARITY_CONFIG[rarityKey];
                const randomDesign = config.designs[Math.floor(Math.random() * config.designs.length)];

                newNpcs.push({
                    createdAt: Date.now(),
                    x: Math.random() * area,
                    y: Math.random() * area,
                    targetX: Math.random() * area,
                    targetY: Math.random() * area,
                    rarity: rarityKey,
                    spriteSrc: `${randomDesign}`,
                    speed: 0.05 + Math.random() * 0.1,
                    waiting: false,
                    facingRight: Math.random() > 0.5,
                    name: generateName()
                });
            }
            npcsRef.current = [ ...npcsRef.current, ...newNpcs ];
        }else if(count < currentCount){
            const shuffled = [...npcsRef.current].sort(() => Math.random() - 0.5);
            npcsRef.current = shuffled.slice(0, count);
        }

        setNpcs(npcsRef.current);
    }, [count]);

    const updatePositions = () => {
        npcsRef.current.forEach(npc => {
            if(npc.waiting) return;

            const dx = npc.targetX - npc.x;
            const dy = npc.targetY - npc.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if(distance < 1){
                npc.waiting = true;
                setTimeout(() => {
                    npc.targetX = Math.random() * area;
                    npc.targetY = Math.random() * area;
                    npc.facingRight = npc.targetX > npc.x;
                    npc.waiting = false;
                }, 3000 + Math.random() * 3000);
            }else{
                npc.x += (dx / distance) * npc.speed;
                npc.y += (dy / distance) * npc.speed;
            }
        });

        requestRef.current = requestAnimationFrame(updatePositions);
    };

    useEffect(() => {
        requestRef.current = requestAnimationFrame(updatePositions);
        return () => cancelAnimationFrame(requestRef.current);
    }, []);

    return {npcsRef};
}