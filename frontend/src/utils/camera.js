import { useState, useEffect, useCallback, useRef } from 'react'

export function Camera(containerRef){
    const [camera, setCamera] = useState({ x: 0, y: 0, scale: 1 });
    const [isDragging, setIsDragging] = useState(false);
    const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [targetNpc, setTargetNpc] = useState(null);

    const WORLD_MULTIPLIER = 3;
    const MAX_SCALE = 5;
    const lastTouchDistance = useRef(null);
    const dragDistance = useRef(0);

    useEffect(() => {
        if(!containerRef.current) return;

        const updateSize = () => {
            const width = containerRef.current.clientWidth;
            const height = containerRef.current.clientHeight;

            if(width === 0 || height === 0) return;

            setDimensions({ width, height });

            setCamera(prev => {
                if(prev.x !== 0 || prev.y !== 0) return prev;
                return{
                    ...prev,
                    x: -(width * WORLD_MULTIPLIER / 2 - width / 2),
                    y: -(height * WORLD_MULTIPLIER / 2 - height / 2)
                };
            });
        };

        const ro = new ResizeObserver(updateSize);
        ro.observe(containerRef.current);
        updateSize();
        return () => ro.disconnect();
    }, [containerRef]);

    const handleWheel = useCallback((e) => {
        e.preventDefault();
        setCamera((prev) => {
            const zoomIntensity = 0.001;
            const MIN_SCALE = 1 / WORLD_MULTIPLIER;
            let newScale = prev.scale - e.deltaY * zoomIntensity;
            newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, newScale));

            const cx = dimensions.width / 2;
            const cy = dimensions.height / 2;
            const scaleRatio = newScale / prev.scale;

            let newX = cx - (cx - prev.x) * scaleRatio;
            let newY = cy - (cy - prev.y) * scaleRatio;

            const worldW = dimensions.width * WORLD_MULTIPLIER * newScale;
            const worldH = dimensions.height * WORLD_MULTIPLIER * newScale;

            newX = Math.min(0, Math.max(newX, -(worldW - dimensions.width)));
            newY = Math.min(0, Math.max(newY, -(worldH - dimensions.height)));

            return{
                scale: newScale,
                x: newX,
                y: newY
            };
        });
    }, [dimensions]);

    useEffect(() => {
        const el = containerRef.current;

        if(!el) return;

        el.addEventListener('wheel', handleWheel, { passive: false });
        return () => el.removeEventListener('wheel', handleWheel);
    }, [handleWheel, containerRef]);

    const handleCameraDown = useCallback((e) => {
        setTargetNpc(null);
        setIsDragging(true);
        dragDistance.current = 0;
        setLastMousePos({ x: e.clientX, y: e.clientY });
    }, []);

    const handleCameraMove = useCallback((e) => {
        if(!isDragging) return;

        const dx = e.clientX - lastMousePos.x;
        const dy = e.clientY - lastMousePos.y;

        dragDistance.current += Math.abs(dx) + Math.abs(dy);
        
        setCamera((prev) =>({
            ...prev,
            x: prev.x + dx,
            y: prev.y + dy
        }));
        setLastMousePos({ x: e.clientX, y: e.clientY });
    }, [isDragging, lastMousePos]);

    const handleCameraUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    const handleTouchStart = useCallback((e) => {
        if(e.touches.length === 1){
            setIsDragging(true);
            const touch = e.touches[0];
            setLastMousePos({ x: touch.clientX, y: touch.clientY });
            lastTouchDistance.current = null;
        }else if(e.touches.length === 2){
            setIsDragging(false);
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            lastTouchDistance.current = Math.sqrt(dx * dx + dy * dy);
        }
    }, []);

    const handleTouchMove = useCallback((e) => {
        if(e.touches.length === 1 && isDragging){
            const touch = e.touches[0];
            const dx = touch.clientX - lastMousePos.x;
            const dy = touch.clientY - lastMousePos.y;
            setCamera(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
            setLastMousePos({ x: touch.clientX, y: touch.clientY });
        }else if(e.touches.length === 2){
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if(lastTouchDistance.current){
                const ratio = distance / lastTouchDistance.current;

                setCamera(prev => {
                    const zoomIntensity = 0.5;
                    let newScale = prev.scale * (1 + (ratio - 1) * zoomIntensity);

                    const MIN_SCALE = 1 / WORLD_MULTIPLIER;
                    newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, newScale));

                    const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
                    const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;

                    const scaleRatio = newScale / prev.scale;

                    return{
                        scale: newScale,
                        x: midX - (midX - prev.x) * scaleRatio,
                        y: midY - (midY - prev.y) * scaleRatio,
                    };
                });
            }
            lastTouchDistance.current = distance;
        }
    }, [isDragging, lastMousePos]);

    const handleTouchEnd = useCallback(() => {
        setIsDragging(false);
        lastTouchDistance.current = null;
    }, []);

    const followNpc = useCallback((npc) => {
        setTargetNpc(npc);
    }, []);

    useEffect(() => {
        if(!targetNpc || isDragging) return;

        let frameId;
        const worldWidth = dimensions.width * 3;
        const worldHeight = dimensions.height * 3;

        const update = () => {
            setCamera(prev => {
                const npcWorldX = (targetNpc.x / 100) * worldWidth;
                const npcWorldY = (targetNpc.y / 100) * worldHeight;

                const targetX = (dimensions.width / 2) - (npcWorldX * prev.scale);
                const targetY = (dimensions.height / 2) - (npcWorldY * prev.scale);

                const lerpFactor = 0.1;
                return {
                    ...prev,
                    x: prev.x + (targetX - prev.x) * lerpFactor,
                    y: prev.y + (targetY - prev.y) * lerpFactor
                };
            });
            frameId = requestAnimationFrame(update);
        };

        frameId = requestAnimationFrame(update);
        return () => cancelAnimationFrame(frameId);
    }, [targetNpc, dimensions, isDragging]);

    return{
        camera,
        dimensions,
        followNpc,
        targetNpc,
        setTargetNpc,
        handleCameraDown,
        handleCameraMove,
        handleCameraUp,
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd
    };
}