"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DataPoint {
    week: number;
    progress: number;
    weekStart: string;
}

export default function ProgressChart({ data }: { data: DataPoint[] }) {
    if (data.length === 0) return null;

    const width = 700;
    const height = 260;
    const pad = { top: 30, right: 40, bottom: 50, left: 55 };
    const cw = width - pad.left - pad.right;
    const ch = height - pad.top - pad.bottom;

    const maxWeek = data.length - 1 || 1;

    const xScale = (i: number) => pad.left + (i / maxWeek) * cw;
    const yScale = (v: number) => pad.top + ch - (v / 100) * ch;

    const points = data.map((d, i) => ({ x: xScale(i), y: yScale(d.progress), ...d }));
    const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join("");
    const areaPath = `${linePath}L${points[points.length - 1].x},${yScale(0)}L${points[0].x},${yScale(0)}Z`;

    const gridLines = [0, 25, 50, 75, 100];

    return (
        <Card className="bg-slate-900 border-slate-800 shadow-lg">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2 text-slate-100">
                    <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    Xu Hướng Tiến Độ
                </CardTitle>
            </CardHeader>
            <CardContent>
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
                    <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="rgb(249,115,22)" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="rgb(249,115,22)" stopOpacity="0.02" />
                        </linearGradient>
                    </defs>

                    {/* Grid lines */}
                    {gridLines.map((v) => (
                        <g key={v}>
                            <line
                                x1={pad.left}
                                y1={yScale(v)}
                                x2={width - pad.right}
                                y2={yScale(v)}
                                stroke="rgb(51,65,85)"
                                strokeWidth="1"
                                strokeDasharray={v === 0 ? "0" : "4,4"}
                            />
                            <text
                                x={pad.left - 10}
                                y={yScale(v) + 4}
                                textAnchor="end"
                                fill="rgb(148,163,184)"
                                fontSize="11"
                            >
                                {v}%
                            </text>
                        </g>
                    ))}

                    {/* Area fill */}
                    {data.length > 1 && <path d={areaPath} fill="url(#chartGradient)" />}

                    {/* Line */}
                    {data.length > 1 && (
                        <path
                            d={linePath}
                            fill="none"
                            stroke="rgb(249,115,22)"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    )}

                    {/* Data points */}
                    {points.map((p, i) => (
                        <g key={i}>
                            {/* Glow */}
                            <circle cx={p.x} cy={p.y} r="8" fill="rgb(249,115,22)" opacity="0.15" />
                            {/* Dot */}
                            <circle
                                cx={p.x}
                                cy={p.y}
                                r="5"
                                fill="rgb(2,6,23)"
                                stroke="rgb(249,115,22)"
                                strokeWidth="2.5"
                            />
                            {/* Label */}
                            <text
                                x={p.x}
                                y={p.y - 14}
                                textAnchor="middle"
                                fill="rgb(249,115,22)"
                                fontSize="12"
                                fontWeight="bold"
                            >
                                {p.progress}%
                            </text>
                            {/* X-axis label */}
                            <text
                                x={p.x}
                                y={height - pad.bottom + 20}
                                textAnchor="middle"
                                fill="rgb(148,163,184)"
                                fontSize="11"
                            >
                                W{p.week}
                            </text>
                            <text
                                x={p.x}
                                y={height - pad.bottom + 34}
                                textAnchor="middle"
                                fill="rgb(100,116,139)"
                                fontSize="9"
                            >
                                {p.weekStart}
                            </text>
                        </g>
                    ))}
                </svg>
            </CardContent>
        </Card>
    );
}
