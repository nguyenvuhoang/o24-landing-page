"use client";

import {
    Copy,
    Eye,
    EyeOff,
    Maximize2,
    Minimize2,
    MousePointer2,
    Plus,
    Trash2,
    X
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface Annotation {
    id: string;
    x: number;
    y: number;
    label: string;
    elementPath: string;
    tagName: string;
    text: string;
    styles?: {
        color: string;
        backgroundColor: string;
        fontSize: string;
        margin: string;
        padding: string;
    };
}

export function Agentation() {
    const [annotations, setAnnotations] = useState<Annotation[]>([]);
    const [isActive, setIsActive] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [isMinimized, setIsMinimized] = useState(false);
    const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isActive) return;

        const target = e.target as HTMLElement;
        if (target.closest('.agentation-ui')) {
            setHoveredElement(null);
            return;
        }

        setHoveredElement(target);
    }, [isActive]);

    const handleClick = useCallback((e: MouseEvent) => {
        if (!isActive) return;

        const target = e.target as HTMLElement;
        if (target.closest('.agentation-ui')) return;

        e.preventDefault();
        e.stopPropagation();

        const rect = target.getBoundingClientRect();
        const scrollX = window.scrollX;
        const scrollY = window.scrollY;

        const newAnnotation: Annotation = {
            id: Math.random().toString(36).substr(2, 9),
            x: rect.left + scrollX + rect.width / 2,
            y: rect.top + scrollY + rect.height / 2,
            label: (annotations.length + 1).toString(),
            elementPath: getElementPath(target),
            tagName: target.tagName.toLowerCase(),
            text: target.innerText.slice(0, 50),
            styles: {
                color: window.getComputedStyle(target).color,
                backgroundColor: window.getComputedStyle(target).backgroundColor,
                fontSize: window.getComputedStyle(target).fontSize,
                margin: window.getComputedStyle(target).margin,
                padding: window.getComputedStyle(target).padding,
            }
        };

        setAnnotations(prev => [...prev, newAnnotation]);
    }, [isActive, annotations]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Check for Ctrl+Shift+A or Cmd+Shift+A
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key.toLowerCase() === 'a' || e.code === 'KeyA')) {
                e.preventDefault();
                console.log("Agentation: Toggling state...");
                setIsActive(prev => !prev);
            }
            if (e.key === 'Escape') {
                setIsActive(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        if (isActive) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("click", handleClick, true);
            document.body.style.cursor = "crosshair";
        } else {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("click", handleClick, true);
            document.body.style.cursor = "default";
            setHoveredElement(null);
        }

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("click", handleClick, true);
            document.body.style.cursor = "default";
        };
    }, [isActive, handleMouseMove, handleClick]);

    const getElementPath = (el: HTMLElement): string => {
        const path = [];
        let current = el;
        while (current && current !== document.body) {
            let selector = current.tagName.toLowerCase();
            if (current.id) {
                selector += `#${current.id}`;
            } else if (current.className) {
                // Just take the first class for brevity
                const firstClass = current.className.split(' ')[0];
                if (typeof firstClass === 'string' && firstClass) {
                    selector += `.${firstClass}`;
                }
            }
            path.unshift(selector);
            current = current.parentElement as HTMLElement;
        }
        return path.join(" > ");
    };

    const clearAnnotations = () => setAnnotations([]);

    const copyToClipboard = () => {
        const output = annotations.map(a => (
            `- [${a.label}] Element: ${a.tagName} (${a.elementPath})\n  Content: "${a.text}"\n  Styles: ${JSON.stringify(a.styles, null, 2)}`
        )).join("\n\n");

        navigator.clipboard.writeText(output);
        alert("Annotations and computed styles copied to clipboard!");
    };

    if (process.env.NODE_ENV !== "development") return null;

    return (
        <div className="agentation-ui fixed inset-0 pointer-events-none" style={{ zIndex: 9999 }}>
            {/* Markers */}
            {isVisible && annotations.map((anno) => (
                <div
                    key={anno.id}
                    className="absolute flex items-center justify-center w-6 h-6 rounded-full bg-amber-500 text-white text-[10px] font-bold shadow-lg pointer-events-auto cursor-pointer hover:scale-110 transition-transform"
                    style={{
                        left: anno.x - 12,
                        top: anno.y - 12,
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        setAnnotations(prev => prev.filter(a => a.id !== anno.id));
                    }}
                    title={`Click to remove marker ${anno.label}`}
                >
                    {anno.label}
                </div>
            ))}

            {/* Hover Highlight */}
            {isActive && hoveredElement && (
                <div
                    className="absolute border-2 border-amber-500 bg-amber-500/10 pointer-events-none transition-all duration-150"
                    style={{
                        left: hoveredElement.getBoundingClientRect().left + window.scrollX,
                        top: hoveredElement.getBoundingClientRect().top + window.scrollY,
                        width: hoveredElement.offsetWidth,
                        height: hoveredElement.offsetHeight,
                    }}
                />
            )}

            {/* Toolbar */}
            <div
                className={`fixed bottom-6 right-6 p-2 bg-background border rounded-2xl shadow-2xl pointer-events-auto transition-all duration-300 flex items-center gap-2 ${isMinimized ? 'w-12 h-12 overflow-hidden' : 'p-3'}`}
            >
                {isMinimized ? (
                    <button
                        onClick={() => setIsMinimized(false)}
                        className="w-full h-full flex items-center justify-center hover:bg-muted rounded-xl"
                    >
                        <Maximize2 size={18} />
                    </button>
                ) : (
                    <>
                        <div className="flex items-center gap-1 border-r pr-2">
                            <button
                                onClick={() => setIsActive(!isActive)}
                                className={`p-2 rounded-xl transition-colors ${isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                                title={isActive ? "Deactivate Annotation" : "Activate Annotation"}
                            >
                                {isActive ? <MousePointer2 size={18} /> : <Plus size={18} />}
                            </button>
                            <button
                                onClick={() => setIsVisible(!isVisible)}
                                className="p-2 rounded-xl hover:bg-muted transition-colors"
                                title={isVisible ? "Hide Markers" : "Show Markers"}
                            >
                                {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        <div className="flex items-center gap-1">
                            <button
                                onClick={copyToClipboard}
                                className="p-2 rounded-xl hover:bg-muted transition-colors"
                                title="Copy for Agent"
                                disabled={annotations.length === 0}
                            >
                                <Copy size={18} />
                            </button>
                            <button
                                onClick={clearAnnotations}
                                className="p-2 rounded-xl hover:bg-muted transition-colors text-destructive"
                                title="Clear All"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>

                        <div className="flex items-center gap-1 border-l pl-2">
                            <button
                                onClick={() => setIsMinimized(true)}
                                className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                            >
                                <Minimize2 size={14} />
                            </button>
                            <button
                                onClick={() => setIsActive(false)}
                                className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
