import { useEffect, useRef } from 'react';
import { RARITY_CONFIG } from '../utils/config.js';

export const useCanvasRender = (canvasRef, camera, dimensions, npcsRef) => {
    const backgroundRef = useRef(new Image());
    const spriteCache = useRef({});

    useEffect(() => {
        backgroundRef.current.src = '/forest.png';

        Object.values(RARITY_CONFIG).forEach(rarity => {
            rarity.designs.forEach(path => {
                if(!spriteCache.current[path]){
                    const img = new Image();
                    img.src = `/sprites/${path}`;
                    spriteCache.current[path] = img;
                }
            });
        });
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;

        if(!canvas) return;

        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;
        canvas.width = dimensions.width;
        canvas.height = dimensions.height;

        let animationFrameId;
        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            ctx.translate(camera.x, camera.y);
            ctx.scale(camera.scale, camera.scale);

            const worldWidth = dimensions.width * 3;
            const worldHeight = dimensions.height * 3;

            if(backgroundRef.current.complete){
                ctx.save();
                ctx.globalAlpha = 0.45;
                ctx.drawImage(backgroundRef.current, 0, 0, worldWidth, worldHeight);
                ctx.restore();
            }

            npcsRef.current.forEach((npc) => {
                const drawX = (npc.x / 100) * worldWidth;
                const drawY = (npc.y / 100) * worldHeight;
                const img = spriteCache.current[npc.spriteSrc];

                ctx.save();
                ctx.translate(drawX, drawY);

                if(npc.facingRight) ctx.scale(-1, 1);

                let rotation = 0;

                if(!npc.waiting){
                    rotation = Math.sin(performance.now() * 0.01) * (4 * Math.PI / 180);
                }

                ctx.rotate(rotation);

                if(img && img.complete){
                    const spriteSize = 64;
                    ctx.drawImage(
                        img,
                        -spriteSize / 2,
                        -spriteSize / 2,
                        spriteSize,
                        spriteSize
                    );
                }else{
                    ctx.fillStyle = '#333333';
                    ctx.fillRect(-10, -10, 20, 20);
                }

                ctx.restore();
            });

            ctx.restore();
            animationFrameId = requestAnimationFrame(render);
        };

        render();
        return () => cancelAnimationFrame(animationFrameId);
    }, [camera, npcsRef, dimensions]);

    return { backgroundRef, spriteCache };
};
