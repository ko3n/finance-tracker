import { useRef } from 'react';
import { useCanvasRender } from '../hooks/useCanvasRender.js';

const CentralViewport = ({
    viewPortRef,
    canvasRef,
    camera,
    dimensions,
    npcsRef,
    handleCameraDown,
    handleCameraMove,
    handleCameraUp,
    handleTouchStart,
    handleTouchEnd,
    handleTouchMove,
    handleCanvasClick
}) => {
    const clickStartRef = useRef({ x: 0, y: 0 });
    const didDragRef = useRef(false);

    useCanvasRender(canvasRef, camera, dimensions, npcsRef);

    return (
        <main
            ref={viewPortRef}
            className="relative md:col-span-6 md:row-span-11 flex flex-col border-4 border-black bg-[#333333] overflow-hidden touch-none"
            onMouseDown={(e) => {
                didDragRef.current = false;
                clickStartRef.current = { x: e.clientX, y: e.clientY };
                handleCameraDown(e);
            }}
            onMouseMove={(e) => {
                const dx = e.clientX - clickStartRef.current.x;
                const dy = e.clientY - clickStartRef.current.y;

                if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
                    didDragRef.current = true;
                }

                handleCameraMove(e);
            }}
            onMouseUp={handleCameraUp}
            onMouseLeave={handleCameraUp}
            onClick={(e) => {
                if (!didDragRef.current) {
                    handleCanvasClick(e);
                }
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

            {/* ZOOM INDICATOR */}
            <div className="absolute top-2 right-2 text-[10px] text-white bg-black border border-black px-1 font-bold z-[50]  glow-white">
                ZOOM: {(camera.scale * 100).toFixed(0)}%
            </div>
        </main>
    );
};

export default CentralViewport;
