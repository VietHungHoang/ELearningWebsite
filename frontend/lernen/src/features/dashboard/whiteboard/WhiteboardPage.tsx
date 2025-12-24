import React, { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
    FiEdit3, 
    FiSquare, 
    FiCircle, 
    FiMinus, 
    FiTrash2, 
    FiDownload,
    FiType,
    FiMove,
    FiRotateCcw,
    FiMaximize2,
    FiMinimize2
} from 'react-icons/fi';
import { BiEraser } from 'react-icons/bi';
import { useFullscreen } from '../../../context/FullscreenContext';
import { useSidebar } from '../../../context/SidebarContext';

type Tool = 'pen' | 'eraser' | 'line' | 'rectangle' | 'circle' | 'text' | 'select';
type DrawingElement = {
    type: 'path' | 'line' | 'rectangle' | 'circle' | 'text';
    points?: { x: number; y: number }[];
    start?: { x: number; y: number };
    end?: { x: number; y: number };
    text?: string;
    color: string;
    lineWidth: number;
};

const WhiteboardPage: React.FC = () => {
    const { t } = useTranslation();
    const { isFullscreen, toggleFullscreen } = useFullscreen();
    const { isSidebarOpen } = useSidebar();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentTool, setCurrentTool] = useState<Tool>('pen');
    const [color, setColor] = useState('#000000');
    const [lineWidth, setLineWidth] = useState(2);
    const [elements, setElements] = useState<DrawingElement[]>([]);
    const [currentElement, setCurrentElement] = useState<DrawingElement | null>(null);
    
    // Pan and zoom states
    const [isPanning, setIsPanning] = useState(false);
    const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
    const [startPanPoint, setStartPanPoint] = useState({ x: 0, y: 0 });
    const [scale, setScale] = useState(1);
    const [isSpacePressed, setIsSpacePressed] = useState(false);

    // Text input states
    const [isEditingText, setIsEditingText] = useState(false);
    const [textInputPosition, setTextInputPosition] = useState({ x: 0, y: 0 });
    const [textInputValue, setTextInputValue] = useState('');
    const textInputRef = useRef<HTMLInputElement>(null);

    // Color picker dropdown state
    const [showColorPicker, setShowColorPicker] = useState(false);
    const colorPickerRef = useRef<HTMLDivElement>(null);

    // Responsive button text based on window width and sidebar state
    // Sidebar widths: open = 272px (w-68), closed = 80px (w-20)
    // Content threshold: 1280px
    // Calculate: if (window.innerWidth - sidebarWidth) < 1280, hide text
    const [showButtonText, setShowButtonText] = useState(() => {
        const SIDEBAR_OPEN_WIDTH = 272; // w-68 in px
        const CONTENT_MIN_WIDTH = 1280;
        const contentWidth = window.innerWidth - SIDEBAR_OPEN_WIDTH;
        return contentWidth >= CONTENT_MIN_WIDTH;
    });

    // Initialize canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        const resizeCanvas = () => {
            const container = canvas.parentElement;
            if (container) {
                // Store current canvas content
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

                // Update canvas size
                canvas.width = container.clientWidth;
                canvas.height = container.clientHeight;

                // Restore canvas content
                ctx.putImageData(imageData, 0, 0);
                
                // Redraw to ensure everything is visible
                redrawCanvas();
            }
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Use ResizeObserver to detect sidebar toggle
        const resizeObserver = new ResizeObserver(() => {
            resizeCanvas();
        });

        if (canvas.parentElement) {
            resizeObserver.observe(canvas.parentElement);
        }

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            resizeObserver.disconnect();
        };
    }, []);

    // Handle keyboard events for Space key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space' && !isSpacePressed) {
                e.preventDefault();
                setIsSpacePressed(true);
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                e.preventDefault();
                setIsSpacePressed(false);
                setIsPanning(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [isSpacePressed]);

    // Close color picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
                setShowColorPicker(false);
            }
        };

        if (showColorPicker) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showColorPicker]);

    // Update button text visibility based on sidebar state and window width
    // Proactive calculation: hide text BEFORE sidebar opens to prevent wrap
    useEffect(() => {
        const SIDEBAR_OPEN_WIDTH = 272; // w-68 = 17rem = 272px
        const SIDEBAR_CLOSED_WIDTH = 80; // w-20 = 5rem = 80px
        const CONTENT_MIN_WIDTH = 1280;
        const HEADER_PADDING = 64; // approximate padding/margins
        const SIDEBAR_TRANSITION_DURATION = 50; // match CSS transition duration

        const calculateShowText = () => {
            const sidebarWidth = isSidebarOpen ? SIDEBAR_OPEN_WIDTH : SIDEBAR_CLOSED_WIDTH;
            const availableContentWidth = window.innerWidth - sidebarWidth - HEADER_PADDING;
            return availableContentWidth >= CONTENT_MIN_WIDTH;
        };

        const shouldShowText = calculateShowText();

        // Critical: Different timing for show vs hide
        if (!shouldShowText) {
            // Hide immediately to prevent wrap when sidebar opens (content shrinks)
            setShowButtonText(false);
        } else {
            // Delay showing text when sidebar closes (content expands)
            // Wait for sidebar animation to complete
            const timer = setTimeout(() => {
                setShowButtonText(true);
            }, SIDEBAR_TRANSITION_DURATION);
            
            return () => clearTimeout(timer);
        }

        const handleResize = () => {
            const shouldShow = calculateShowText();
            if (!shouldShow) {
                setShowButtonText(false);
            } else {
                setShowButtonText(true);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isSidebarOpen]); // Re-calculate immediately when sidebar state changes

    // Redraw all elements
    const redrawCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Save context state
        ctx.save();

        // Clear canvas
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Apply pan and zoom transformations
        ctx.translate(panOffset.x, panOffset.y);
        ctx.scale(scale, scale);

        // Draw all elements
        elements.forEach(element => {
            ctx.strokeStyle = element.color;
            ctx.lineWidth = element.lineWidth;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            switch (element.type) {
                case 'path':
                    if (element.points && element.points.length > 1) {
                        ctx.beginPath();
                        ctx.moveTo(element.points[0].x, element.points[0].y);
                        element.points.forEach(point => {
                            ctx.lineTo(point.x, point.y);
                        });
                        ctx.stroke();
                    }
                    break;

                case 'line':
                    if (element.start && element.end) {
                        ctx.beginPath();
                        ctx.moveTo(element.start.x, element.start.y);
                        ctx.lineTo(element.end.x, element.end.y);
                        ctx.stroke();
                    }
                    break;

                case 'rectangle':
                    if (element.start && element.end) {
                        const width = element.end.x - element.start.x;
                        const height = element.end.y - element.start.y;
                        ctx.strokeRect(element.start.x, element.start.y, width, height);
                    }
                    break;

                case 'circle':
                    if (element.start && element.end) {
                        const radius = Math.sqrt(
                            Math.pow(element.end.x - element.start.x, 2) +
                            Math.pow(element.end.y - element.start.y, 2)
                        );
                        ctx.beginPath();
                        ctx.arc(element.start.x, element.start.y, radius, 0, 2 * Math.PI);
                        ctx.stroke();
                    }
                    break;

                case 'text':
                    if (element.start && element.text) {
                        ctx.font = `${element.lineWidth * 8}px Arial`;
                        ctx.fillStyle = element.color;
                        ctx.fillText(element.text, element.start.x, element.start.y);
                    }
                    break;
            }
        });

        // Restore context state
        ctx.restore();
    };

    useEffect(() => {
        redrawCanvas();
    }, [elements, panOffset, scale]);

    const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        
        // Get mouse position relative to canvas
        const canvasX = (e.clientX - rect.left) * scaleX;
        const canvasY = (e.clientY - rect.top) * scaleY;
        
        // Adjust for pan and zoom
        return {
            x: (canvasX - panOffset.x) / scale,
            y: (canvasY - panOffset.y) / scale,
        };
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const pos = getMousePos(e);

        // Right click or Space + Left click for panning
        if (e.button === 2 || (isSpacePressed && e.button === 0)) {
            setIsPanning(true);
            setStartPanPoint({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
            return;
        }

        setIsDrawing(true);

        if (currentTool === 'text') {
            // Get screen position for text input
            const canvas = canvasRef.current;
            if (!canvas) return;
            
            setTextInputPosition({ x: pos.x, y: pos.y });
            setTextInputValue('');
            setIsEditingText(true);
            setIsDrawing(false);
            
            // Focus input after render
            setTimeout(() => {
                textInputRef.current?.focus();
            }, 0);
            return;
        }

        if (currentTool === 'pen' || currentTool === 'eraser') {
            const newElement: DrawingElement = {
                type: 'path',
                points: [pos],
                color: currentTool === 'eraser' ? '#ffffff' : color,
                lineWidth: currentTool === 'eraser' ? lineWidth * 3 : lineWidth,
            };
            setCurrentElement(newElement);
        } else if (currentTool === 'line' || currentTool === 'rectangle' || currentTool === 'circle') {
            const newElement: DrawingElement = {
                type: currentTool,
                start: pos,
                end: pos,
                color,
                lineWidth,
            };
            setCurrentElement(newElement);
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        // Handle panning
        if (isPanning) {
            setPanOffset({
                x: e.clientX - startPanPoint.x,
                y: e.clientY - startPanPoint.y,
            });
            return;
        }

        if (!isDrawing || !currentElement) return;

        const pos = getMousePos(e);

        if (currentTool === 'pen' || currentTool === 'eraser') {
            setCurrentElement({
                ...currentElement,
                points: [...(currentElement.points || []), pos],
            });

            // Draw in real-time
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext('2d');
            if (ctx && currentElement.points) {
                const lastPoint = currentElement.points[currentElement.points.length - 1];
                
                ctx.save();
                ctx.translate(panOffset.x, panOffset.y);
                ctx.scale(scale, scale);
                
                ctx.strokeStyle = currentElement.color;
                ctx.lineWidth = currentElement.lineWidth;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.beginPath();
                ctx.moveTo(lastPoint.x, lastPoint.y);
                ctx.lineTo(pos.x, pos.y);
                ctx.stroke();
                
                ctx.restore();
            }
        } else {
            setCurrentElement({
                ...currentElement,
                end: pos,
            });
            redrawCanvas();

            // Draw preview
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext('2d');
            if (ctx && currentElement.start) {
                ctx.save();
                ctx.translate(panOffset.x, panOffset.y);
                ctx.scale(scale, scale);
                
                ctx.strokeStyle = color;
                ctx.lineWidth = lineWidth;
                ctx.lineCap = 'round';

                switch (currentTool) {
                    case 'line':
                        ctx.beginPath();
                        ctx.moveTo(currentElement.start.x, currentElement.start.y);
                        ctx.lineTo(pos.x, pos.y);
                        ctx.stroke();
                        break;

                    case 'rectangle':
                        const width = pos.x - currentElement.start.x;
                        const height = pos.y - currentElement.start.y;
                        ctx.strokeRect(currentElement.start.x, currentElement.start.y, width, height);
                        break;

                    case 'circle':
                        const radius = Math.sqrt(
                            Math.pow(pos.x - currentElement.start.x, 2) +
                            Math.pow(pos.y - currentElement.start.y, 2)
                        );
                        ctx.beginPath();
                        ctx.arc(currentElement.start.x, currentElement.start.y, radius, 0, 2 * Math.PI);
                        ctx.stroke();
                        break;
                }
                
                ctx.restore();
            }
        }
    };

    const handleMouseUp = () => {
        if (isPanning) {
            setIsPanning(false);
            return;
        }

        if (currentElement) {
            setElements([...elements, currentElement]);
            setCurrentElement(null);
        }
        setIsDrawing(false);
    };

    const handleClearCanvas = () => {
        if (window.confirm(t('whiteboard.confirmClear'))) {
            setElements([]);
            redrawCanvas();
        }
    };

    const handleDownload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const link = document.createElement('a');
        link.download = `whiteboard-${Date.now()}.png`;
        link.href = canvas.toDataURL();
        link.click();
    };

    const handleUndo = () => {
        if (elements.length > 0) {
            setElements(elements.slice(0, -1));
        }
    };

    const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
        e.preventDefault();
        
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const mouseX = (e.clientX - rect.left) * (canvas.width / rect.width);
        const mouseY = (e.clientY - rect.top) * (canvas.height / rect.height);

        const zoom = e.deltaY > 0 ? 0.9 : 1.1;
        const newScale = Math.min(Math.max(0.1, scale * zoom), 5);

        // Adjust pan offset to zoom towards mouse position
        const scaleChange = newScale / scale;
        setPanOffset({
            x: mouseX - (mouseX - panOffset.x) * scaleChange,
            y: mouseY - (mouseY - panOffset.y) * scaleChange,
        });

        setScale(newScale);
    };

    const handleResetView = () => {
        setPanOffset({ x: 0, y: 0 });
        setScale(1);
    };

    const handleTextInputComplete = () => {
        if (textInputValue.trim()) {
            const newElement: DrawingElement = {
                type: 'text',
                start: textInputPosition,
                text: textInputValue,
                color,
                lineWidth,
            };
            setElements([...elements, newElement]);
        }
        setIsEditingText(false);
        setTextInputValue('');
    };

    const handleTextInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleTextInputComplete();
        } else if (e.key === 'Escape') {
            setIsEditingText(false);
            setTextInputValue('');
        }
    };

    const tools = [
        { id: 'pen' as Tool, icon: FiEdit3, label: t('whiteboard.tools.pen') },
        { id: 'eraser' as Tool, icon: BiEraser, label: t('whiteboard.tools.eraser') },
        { id: 'line' as Tool, icon: FiMinus, label: t('whiteboard.tools.line') },
        { id: 'rectangle' as Tool, icon: FiSquare, label: t('whiteboard.tools.rectangle') },
        { id: 'circle' as Tool, icon: FiCircle, label: t('whiteboard.tools.circle') },
        { id: 'text' as Tool, icon: FiType, label: t('whiteboard.tools.text') },
    ];

    const colors = [
        '#000000', '#FF0000', '#00FF00', '#0000FF', 
        '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500',
        '#800080', '#008000', '#FFC0CB', '#A52A2A'
    ];

    return (
        <div className="h-full flex flex-col bg-gray-50">
            {/* Header - Hidden in fullscreen mode */}
            {!isFullscreen && (
                <div className="bg-white border-b border-gray-200 px-6 py-4">
                    <h1 className="text-2xl font-bold text-gray-800">{t('whiteboard.title')}</h1>
                </div>
            )}

            {/* Toolbar */}
            <div className={`bg-white border-b border-gray-200 ${isFullscreen ? 'px-3 py-2' : 'px-6 py-3'}`}>
                <div className="flex items-center gap-4 flex-wrap">
                    {/* Tools */}
                    <div className="flex items-center gap-2">
                        {tools.map(tool => (
                            <button
                                key={tool.id}
                                onClick={() => setCurrentTool(tool.id)}
                                className={`p-2 rounded-lg transition-all ${
                                    currentTool === tool.id
                                        ? 'bg-[#0b6459] text-white shadow-md'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                                title={tool.label}
                            >
                                <tool.icon className="w-5 h-5" />
                            </button>
                        ))}
                    </div>

                    <div className="w-px h-8 bg-gray-300" />

                    {/* Colors */}
                    <div className="relative" ref={colorPickerRef}>
                        <button
                            onClick={() => setShowColorPicker(!showColorPicker)}
                            className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-gray-400 transition-all flex items-center justify-center shadow-sm"
                            style={{ backgroundColor: color }}
                            title="Choose color"
                        >
                            <div className="w-6 h-6 rounded border border-white/50" style={{ backgroundColor: color }} />
                        </button>
                        
                        {showColorPicker && (
                            <div className="absolute top-12 left-0 bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-50 flex items-center gap-2">
                                {colors.map(c => (
                                    <button
                                        key={c}
                                        onClick={() => {
                                            setColor(c);
                                            setShowColorPicker(false);
                                        }}
                                        className={`w-8 h-8 rounded-lg border-2 transition-all hover:scale-110 ${
                                            color === c ? 'border-gray-800 scale-110' : 'border-gray-300'
                                        }`}
                                        style={{ backgroundColor: c }}
                                        title={c}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="w-px h-8 bg-gray-300" />

                    {/* Line Width */}
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700">
                            {t('whiteboard.lineWidth')}:
                        </label>
                        <input
                            type="range"
                            min="1"
                            max="20"
                            value={lineWidth}
                            onChange={(e) => setLineWidth(Number(e.target.value))}
                            className="w-32"
                        />
                        <span className="text-sm text-gray-600 w-8">{lineWidth}px</span>
                    </div>

                    <div className="w-px h-8 bg-gray-300" />

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleUndo}
                            className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
                            disabled={elements.length === 0}
                            title={t('whiteboard.undo')}
                        >
                            <FiRotateCcw className="w-4 h-4" />
                            {showButtonText && <span className="ml-2 text-sm font-medium">{t('whiteboard.undo')}</span>}
                        </button>
                        <button
                            onClick={handleClearCanvas}
                            className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-2"
                            title={t('whiteboard.clear')}
                        >
                            <FiTrash2 className="w-4 h-4" />
                            {showButtonText && <span className="text-sm font-medium">{t('whiteboard.clear')}</span>}
                        </button>
                        <button
                            onClick={handleDownload}
                            className="p-2 bg-[#0b6459] text-white rounded-lg hover:bg-[#094d44] transition-colors flex items-center gap-2"
                            title={t('whiteboard.download')}
                        >
                            <FiDownload className="w-4 h-4" />
                            {showButtonText && <span className="text-sm font-medium">{t('whiteboard.download')}</span>}
                        </button>
                        <button
                            onClick={handleResetView}
                            className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                            title={t('whiteboard.resetView')}
                        >
                            <FiMove className="w-4 h-4" />
                            {showButtonText && <span className="text-sm font-medium">{t('whiteboard.resetView')}</span>}
                        </button>
                        <button
                            onClick={toggleFullscreen}
                            className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                            title={isFullscreen ? t('whiteboard.exitFullscreen') : t('whiteboard.fullscreen')}
                        >
                            {isFullscreen ? <FiMinimize2 className="w-4 h-4" /> : <FiMaximize2 className="w-4 h-4" />}
                            {showButtonText && (
                                <span className="text-sm font-medium">
                                    {isFullscreen ? t('whiteboard.exitFullscreen') : t('whiteboard.fullscreen')}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Canvas */}
            <div className={isFullscreen ? 'flex-1' : 'flex-1 p-2'}>
                <div className={`h-full bg-white overflow-hidden relative ${isFullscreen ? '' : 'rounded-lg shadow-sm border border-gray-200'}`}>
                    {/* Zoom indicator */}
                    <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-lg text-sm font-medium z-10">
                        {Math.round(scale * 100)}%
                    </div>
                    {/* Pan hint */}
                    <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-lg text-xs z-10">
                        {t('whiteboard.panHint')}
                    </div>
                    
                    {/* Text input overlay */}
                    {isEditingText && (
                        <div
                            className="absolute z-20"
                            style={{
                                left: `${((textInputPosition.x * scale + panOffset.x) / canvasRef.current!.width) * 100}%`,
                                top: `${((textInputPosition.y * scale + panOffset.y) / canvasRef.current!.height) * 100}%`,
                                transform: 'translate(-50%, -50%)',
                            }}
                        >
                            <input
                                ref={textInputRef}
                                type="text"
                                value={textInputValue}
                                onChange={(e) => setTextInputValue(e.target.value)}
                                onKeyDown={handleTextInputKeyDown}
                                onBlur={handleTextInputComplete}
                                placeholder={t('whiteboard.enterText')}
                                className="px-3 py-2 border-2 border-[#0b6459] rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-[#0b6459] min-w-[200px]"
                                style={{
                                    fontSize: `${lineWidth * 8}px`,
                                    color: color,
                                }}
                            />
                        </div>
                    )}
                    
                    <canvas
                        ref={canvasRef}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        onWheel={handleWheel}
                        onContextMenu={(e) => e.preventDefault()}
                        className={`w-full h-full ${isPanning || isSpacePressed ? 'cursor-grab' : 'cursor-crosshair'}`}
                    />
                </div>
            </div>
        </div>
    );
};

export default WhiteboardPage;
