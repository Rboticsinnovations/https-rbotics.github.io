import React from 'react';

interface BatteryVisualProps {
    type: '1cell' | '2cell' | '3cell' | '4cell' | 'custom' | '6cell' | 'lipo' | 'lfp' | 'cylindrical' | 'general' | 'plc' | 'cellmeter';
    width?: number | string;
    height?: number | string;
    className?: string;
}

export const BatteryVisual: React.FC<BatteryVisualProps> = ({ type, width = 160, height = 120, className = '' }) => {
    switch (type) {
        case '1cell':
            return (
                <svg width={width} height={height} viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
                    {/* Shadow */}
                    <ellipse cx="100" cy="130" rx="75" ry="12" fill="rgba(0,0,0,0.18)" filter="blur(4px)" />
                    {/* Silicon Wires coming out */}
                    <path d="M 60 75 C 50 40, 70 20, 95 25" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
                    <path d="M 65 80 C 45 50, 55 15, 85 18" stroke="#1f2937" strokeWidth="4" strokeLinecap="round" />
                    {/* White JST-XH Connector Plug */}
                    <rect x="90" y="15" width="22" height="14" rx="2" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
                    <rect x="94" y="18" width="6" height="8" fill="#e2e8f0" />
                    <rect x="102" y="18" width="6" height="8" fill="#e2e8f0" />
                    {/* Battery Body (Orange / Black Heat Shrink) */}
                    <rect x="45" y="60" width="115" height="42" rx="10" fill="url(#gradOrange)" stroke="#c2410c" strokeWidth="1.5" />
                    {/* Inner Black Label */}
                    <rect x="58" y="66" width="90" height="30" rx="4" fill="#18181b" />
                    {/* Text Label */}
                    <text x="103" y="82" fill="#fb923c" fontSize="11" fontWeight="bold" fontFamily="monospace" textAnchor="middle">2000mAh</text>
                    <text x="103" y="93" fill="#ffffff" fontSize="7.5" fontWeight="600" fontFamily="sans-serif" textAnchor="middle">3.7V • 1S1P Li-Ion</text>
                    {/* Terminal Cap Ring */}
                    <rect x="42" y="70" width="4" height="22" rx="2" fill="#71717a" />
                    <defs>
                        <linearGradient id="gradOrange" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#fb923c" />
                            <stop offset="50%" stopColor="#f97316" />
                            <stop offset="100%" stopColor="#c2410c" />
                        </linearGradient>
                    </defs>
                </svg>
            );

        case '2cell':
            return (
                <svg width={width} height={height} viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
                    <ellipse cx="100" cy="132" rx="78" ry="12" fill="rgba(0,0,0,0.18)" filter="blur(4px)" />
                    {/* Wires & XT60 Yellow Plug */}
                    <path d="M 65 65 C 50 30, 80 15, 110 20" stroke="#ef4444" strokeWidth="4.5" strokeLinecap="round" />
                    <path d="M 70 70 C 45 40, 70 10, 105 12" stroke="#111827" strokeWidth="4.5" strokeLinecap="round" />
                    <path d="M 108 12 L 126 12 L 122 25 L 108 25 Z" fill="#eab308" stroke="#ca8a04" strokeWidth="1.5" />
                    {/* Battery 2-Cell Dual Layer Body */}
                    <rect x="50" y="55" width="105" height="52" rx="8" fill="url(#gradOrange2)" stroke="#c2410c" strokeWidth="1.5" />
                    <line x1="50" y1="81" x2="155" y2="81" stroke="#9a3412" strokeWidth="1" strokeDasharray="3 2" />
                    <rect x="62" y="62" width="82" height="38" rx="4" fill="#09090b" />
                    <text x="103" y="80" fill="#fb923c" fontSize="13" fontWeight="bold" fontFamily="monospace" textAnchor="middle">2200</text>
                    <text x="103" y="94" fill="#ffffff" fontSize="8" fontWeight="600" fontFamily="sans-serif" textAnchor="middle">7.4V 2S • 20C</text>
                    <defs>
                        <linearGradient id="gradOrange2" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#fdba74" />
                            <stop offset="60%" stopColor="#f97316" />
                            <stop offset="100%" stopColor="#c2410c" />
                        </linearGradient>
                    </defs>
                </svg>
            );

        case '3cell':
            return (
                <svg width={width} height={height} viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
                    <ellipse cx="100" cy="134" rx="80" ry="13" fill="rgba(0,0,0,0.2)" filter="blur(4px)" />
                    {/* Wires */}
                    <path d="M 60 60 C 40 25, 75 10, 115 15" stroke="#ef4444" strokeWidth="5" strokeLinecap="round" />
                    <path d="M 68 65 C 45 35, 65 5, 110 8" stroke="#111827" strokeWidth="5" strokeLinecap="round" />
                    {/* Large 3S Pack Body */}
                    <rect x="45" y="52" width="112" height="60" rx="8" fill="url(#gradOrange3)" stroke="#c2410c" strokeWidth="1.5" />
                    <rect x="56" y="58" width="90" height="48" rx="4" fill="#18181b" />
                    <text x="101" y="82" fill="#fb923c" fontSize="15" fontWeight="900" fontFamily="monospace" textAnchor="middle">5000</text>
                    <text x="101" y="98" fill="#ffffff" fontSize="9" fontWeight="700" fontFamily="sans-serif" textAnchor="middle">11.1V / 12V 3S</text>
                    <defs>
                        <linearGradient id="gradOrange3" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#fed7aa" />
                            <stop offset="50%" stopColor="#ea580c" />
                            <stop offset="100%" stopColor="#9a3412" />
                        </linearGradient>
                    </defs>
                </svg>
            );

        case '4cell':
            return (
                <svg width={width} height={height} viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
                    <ellipse cx="100" cy="135" rx="82" ry="14" fill="rgba(0,0,0,0.22)" filter="blur(4px)" />
                    <path d="M 55 55 C 35 20, 70 8, 120 12" stroke="#dc2626" strokeWidth="5" strokeLinecap="round" />
                    <path d="M 62 60 C 40 30, 60 5, 112 5" stroke="#0f172a" strokeWidth="5" strokeLinecap="round" />
                    <rect x="42" y="48" width="118" height="68" rx="8" fill="url(#gradOrange4)" stroke="#9a3412" strokeWidth="2" />
                    <rect x="52" y="55" width="98" height="54" rx="4" fill="#09090b" />
                    <text x="101" y="83" fill="#f97316" fontSize="16" fontWeight="900" fontFamily="monospace" textAnchor="middle">5000</text>
                    <text x="101" y="100" fill="#38bdf8" fontSize="9.5" fontWeight="700" fontFamily="sans-serif" textAnchor="middle">14.8V 4S 30C</text>
                    <defs>
                        <linearGradient id="gradOrange4" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#fdba74" />
                            <stop offset="60%" stopColor="#ea580c" />
                            <stop offset="100%" stopColor="#7c2d12" />
                        </linearGradient>
                    </defs>
                </svg>
            );

        case 'custom':
            return (
                <svg width={width} height={height} viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
                    <ellipse cx="100" cy="134" rx="85" ry="12" fill="rgba(0,0,0,0.18)" filter="blur(4px)" />
                    {/* Matrix of green 18650 cell tops */}
                    <g transform="translate(30, 50)">
                        {[0, 1, 2, 3, 4, 5, 6, 7].map(col => (
                            [0, 1, 2].map(row => (
                                <g key={`${col}-${row}`} transform={`translate(${col * 17}, ${row * 18})`}>
                                    <circle cx="9" cy="9" r="8" fill="#10b981" stroke="#047857" strokeWidth="1" />
                                    <circle cx="9" cy="9" r="4.5" fill="#f8fafc" stroke="#64748b" strokeWidth="0.8" />
                                    <circle cx="9" cy="9" r="2" fill="#94a3b8" />
                                </g>
                            ))
                        ))}
                        {/* Pure nickel strip connecting */}
                        <rect x="4" y="7" width="130" height="4" fill="rgba(255,255,255,0.7)" rx="1" />
                        <rect x="4" y="25" width="130" height="4" fill="rgba(255,255,255,0.7)" rx="1" />
                        <rect x="4" y="43" width="130" height="4" fill="rgba(255,255,255,0.7)" rx="1" />
                    </g>
                </svg>
            );

        case '6cell':
            return (
                <svg width={width} height={height} viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
                    <ellipse cx="100" cy="135" rx="85" ry="13" fill="rgba(0,0,0,0.2)" filter="blur(4px)" />
                    <rect x="35" y="42" width="130" height="74" rx="10" fill="#1e293b" stroke="#f97316" strokeWidth="2.5" />
                    <rect x="45" y="50" width="110" height="58" rx="6" fill="#0f172a" />
                    <text x="100" y="80" fill="#f97316" fontSize="18" fontWeight="bold" fontFamily="monospace" textAnchor="middle">15000</text>
                    <text x="100" y="98" fill="#ffffff" fontSize="10" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">22.2V 6S DRONE</text>
                </svg>
            );

        case 'lipo':
            return (
                <svg width={width} height={height} viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
                    <ellipse cx="100" cy="130" rx="75" ry="12" fill="rgba(0,0,0,0.18)" filter="blur(4px)" />
                    <path d="M 60 70 C 45 35, 75 15, 110 20" stroke="#dc2626" strokeWidth="4" strokeLinecap="round" />
                    <path d="M 68 74 C 40 45, 65 10, 105 12" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
                    <rect x="45" y="55" width="110" height="48" rx="6" fill="#2563eb" stroke="#1d4ed8" strokeWidth="1.5" />
                    <rect x="55" y="62" width="90" height="34" rx="3" fill="#0f172a" />
                    <text x="100" y="80" fill="#60a5fa" fontSize="13" fontWeight="bold" fontFamily="monospace" textAnchor="middle">Li-Po 3S</text>
                    <text x="100" y="91" fill="#ffffff" fontSize="8" fontWeight="600" fontFamily="sans-serif" textAnchor="middle">11.1V 45C</text>
                </svg>
            );

        case 'lfp':
            return (
                <svg width={width} height={height} viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
                    <ellipse cx="100" cy="132" rx="78" ry="12" fill="rgba(0,0,0,0.18)" filter="blur(4px)" />
                    {/* Blue prismatic box battery */}
                    <rect x="50" y="45" width="100" height="68" rx="4" fill="#0284c7" stroke="#0369a1" strokeWidth="2" />
                    {/* Top terminal posts */}
                    <rect x="68" y="37" width="16" height="8" rx="2" fill="#ef4444" />
                    <rect x="116" y="37" width="16" height="8" rx="2" fill="#0f172a" />
                    <rect x="60" y="56" width="80" height="46" rx="3" fill="#0f172a" />
                    <text x="100" y="78" fill="#38bdf8" fontSize="12" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">LiFePO4</text>
                    <text x="100" y="93" fill="#ffffff" fontSize="9" fontWeight="bold" fontFamily="monospace" textAnchor="middle">12.8V 30Ah</text>
                </svg>
            );

        case 'cylindrical':
            return (
                <svg width={width} height={height} viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
                    <ellipse cx="100" cy="132" rx="75" ry="12" fill="rgba(0,0,0,0.18)" filter="blur(4px)" />
                    {/* Two 18650 Cylindrical Cells, one standing, one lying */}
                    {/* Standing cell */}
                    <rect x="115" y="38" width="30" height="78" rx="6" fill="#f59e0b" stroke="#d97706" strokeWidth="1.5" />
                    <rect x="123" y="33" width="14" height="6" rx="2" fill="#71717a" />
                    <text x="130" y="80" fill="#78350f" fontSize="7" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle" transform="rotate(-90 130 80)">18650 3.7V</text>
                    {/* Lying down cell */}
                    <rect x="42" y="88" width="76" height="28" rx="6" fill="#f97316" stroke="#ea580c" strokeWidth="1.5" />
                    <rect x="118" y="97" width="5" height="10" rx="1" fill="#94a3b8" />
                    <text x="80" y="105" fill="#ffffff" fontSize="7" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">INR 2600</text>
                </svg>
            );

        case 'general':
            return (
                <svg width={width} height={height} viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
                    <ellipse cx="100" cy="130" rx="75" ry="12" fill="rgba(0,0,0,0.16)" filter="blur(4px)" />
                    {/* Coin cell + 9V Battery */}
                    <rect x="60" y="48" width="36" height="62" rx="4" fill="#0f172a" stroke="#ca8a04" strokeWidth="2" />
                    <rect x="60" y="48" width="36" height="18" fill="#ca8a04" />
                    <rect x="66" y="42" width="8" height="6" rx="1" fill="#94a3b8" />
                    <circle cx="86" cy="45" r="4" fill="#94a3b8" />
                    {/* Coin cell CR2032 */}
                    <circle cx="125" cy="85" r="22" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
                    <circle cx="125" cy="85" r="18" fill="#f1f5f9" />
                    <text x="125" y="88" fill="#475569" fontSize="8" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">CR2032</text>
                </svg>
            );

        case 'plc':
            return (
                <svg width={width} height={height} viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
                    <ellipse cx="100" cy="130" rx="72" ry="12" fill="rgba(0,0,0,0.16)" filter="blur(4px)" />
                    <path d="M 125 50 C 145 35, 150 15, 130 18" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
                    <path d="M 125 55 C 150 40, 155 10, 135 12" stroke="#1f2937" strokeWidth="3" strokeLinecap="round" />
                    <rect x="118" y="10" width="16" height="12" rx="2" fill="#f8fafc" stroke="#94a3b8" />
                    {/* Yellow Cylindrical PLC Lithium Cell */}
                    <rect x="60" y="55" width="75" height="34" rx="8" fill="#eab308" stroke="#ca8a04" strokeWidth="1.5" />
                    <rect x="55" y="64" width="5" height="16" rx="2" fill="#64748b" />
                    <text x="97" y="75" fill="#713f12" fontSize="9" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">CNC / PLC</text>
                    <text x="97" y="85" fill="#713f12" fontSize="7" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">ER6V 3.6V</text>
                </svg>
            );

        case 'cellmeter':
            return (
                <svg width={width} height={height} viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
                    <ellipse cx="100" cy="128" rx="68" ry="10" fill="rgba(0,0,0,0.16)" filter="blur(4px)" />
                    {/* Blue body */}
                    <rect x="52" y="38" width="96" height="66" rx="6" fill="#0284c7" stroke="#0369a1" strokeWidth="2" />
                    {/* LCD screen */}
                    <rect x="62" y="46" width="76" height="30" rx="3" fill="#84cc16" stroke="#4d7c0f" strokeWidth="1" />
                    <text x="100" y="65" fill="#14532d" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">4.20V 100%</text>
                    {/* 3 Buttons */}
                    <circle cx="72" cy="90" r="4.5" fill="#e2e8f0" stroke="#64748b" strokeWidth="1" />
                    <circle cx="100" cy="90" r="4.5" fill="#e2e8f0" stroke="#64748b" strokeWidth="1" />
                    <circle cx="128" cy="90" r="4.5" fill="#e2e8f0" stroke="#64748b" strokeWidth="1" />
                </svg>
            );

        default:
            return null;
    }
};
