import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    GraduationCap, Building2, Rocket, Users, Gamepad2, Cpu,
    ChevronLeft, ChevronRight
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   MILESTONE DATA
═══════════════════════════════════════════════════════════ */
interface Milestone {
    id: string;
    year: string;
    chapter: string;
    title: string;
    tagline: string;
    description: string;
    achievements: string[];
    tech: string[];
    icon: React.ElementType;
    image: string[];
    accentColor: string;
}

const MILESTONES: Milestone[] = [
    {
        id: "Admission in PMS", year: "2014", chapter: "Admission in PMS Varanasi",
        title: "Letss F*cking Gooo !!", tagline: "Where curiosity was born",
        description: "Started a journey that I never ever thaught will this much far..",
        achievements: ["Top performer in Science & Mathematics", "School Science Olympiad finalist", "Peak Cricket Skills"],
        tech: ["School", "Cricket", "Topper as usual", "Can i revert the memory"],
        icon: GraduationCap, image: ["https://i.postimg.cc/fb3mgTh4/Chat-GPT-Image-Jun-3-2026-04-34-32-PM.png"],
        accentColor: "#22d3ee",
    },
    {
        id: "England", year: "2018", chapter: "England",
        title: "Cracked the Student Exchange Scholarship to Study in United Kingdom for year and so", tagline: "Bhaii ne Uk mei pdhayi ki hai..",
        description: "Stepped into one of India's premier technical institutes to pursue Instrumentation & Control Engineering — the sweet spot between hardware precision and software intelligence.",
        achievements: ["Admitted to ForeMarke Hall Derbyshire England", "Record Breakign result of 98.6 Effort Score", "Award By Queen Elizabeth ( Kind of Craazyyy )"],
        tech: ["Foremarke Hall England", "Queens Honour", "Nose Breaking Performance... ( Thanks to PT Yang..nooo )"],
        icon: Building2, image: ["https://i.postimg.cc/4xjsrMNR/Whats-App-Image-2026-06-03-at-8-06-18-PM.jpg", "https://i.postimg.cc/ZRD3SV1V/Whats-App-Image-2026-06-03-at-5-23-26-PM-(1).jpg", "https://i.postimg.cc/SQ3t4hFH/Whats-App-Image-2026-06-03-at-5-23-26-PM.jpg", "https://i.postimg.cc/zfx0cmkD/Whats-App-Image-2026-06-03-at-5-23-25-PM-(1).jpg", "https://i.postimg.cc/yY0nz3Tj/Whats-App-Image-2026-06-03-at-5-23-25-PM.jpg", "https://i.postimg.cc/tTLdK9nG/Whats-App-Image-2026-06-03-at-5-23-24-PM-(3).jpg", "https://i.postimg.cc/tRWF1QVC/Whats-App-Image-2026-06-03-at-5-23-24-PM.jpg", "https://i.postimg.cc/sDJScYck/Whats-App-Image-2026-06-03-at-5-23-23-PM.jpg", "https://i.postimg.cc/rp7tmQVp/Whats-App-Image-2026-06-03-at-5-23-21-PM.jpg"],
        accentColor: "#818cf8",
    },
    {
        id: "Welsh", year: "2019", chapter: "Trip to Welsh (Great Britain before this f*king BREXIT ",
        title: "Within a single Exeat Break got the oppertunity to expolre Welsh as well as Ireland Crciket Tour under 13 Lets Goo Mannn !!", tagline: "Just a Kid from Varanasi who wnet to explore UK and Ireland!!",
        description: "Welshs trip been the most memorable trip in my life to be hoenst its all becaude our Legend James Archers.. ",
        achievements: ["12-3 in 2 overs (The one from my Heart) in T10 ", "Castle of Welsh been the major cause ig of successful trip", "Unfortunatelly Chicken Pox kicked in out of No where.."],
        tech: ["Welsh", "Cardic's Castle", "Fish and Chips", "Ireland Cricket Under 13 Tour"],
        icon: Building2, image: ["https://i.postimg.cc/15wqFYr4/Whats-App-Image-2026-06-03-at-4-44-55-PM-(1).jpg", "https://i.postimg.cc/d1tHnQMB/Whats-App-Image-2026-06-03-at-8-09-02-PM-(3).jpg", "https://i.postimg.cc/13hv2rhv/Whats-App-Image-2026-06-03-at-8-09-02-PM.jpg", "https://i.postimg.cc/4xjsrMNR/Whats-App-Image-2026-06-03-at-8-06-18-PM.jpg"],
        accentColor: "#818cf8",
    },
    {
        id: "Doon Internation School", year: "2021", chapter: "DIS Mohali",
        title: "Yaari Chndigarh waliye ne teri kragyi hathiyar nu khde ..", tagline: "Back to Where I belong (UP Board se CBSE Seriously)..",
        description: "DIS Mohali has been in my core memory since my major teenage was nurtured.. ( REST u all know hostel life sepcially in Chandigarh..",
        achievements: ["Displine Incharge", "Mr Popular Award (The Name says it all.. I think) ", "CBSE School Topper toh nhi bn paya... (88.2 )"],
        tech: ["UP Board to CBSE", "Hostel Life", "Still many more to improve"],
        icon: Rocket, image: ["https://i.postimg.cc/Y2f7m6LP/Whats-App-Image-2026-06-03-at-4-46-41-PM.jpg"],
        accentColor: "#a78bfa",
    },
    {
        id: "Kota", year: "2023", chapter: "Drop Lenaa hi pd gyaa",
        title: "Kota' Something that no one would rather wish to recall..", tagline: "Motion hai toh Bharosa Haii..",
        description: "Earlier used to feel that in 12th Apearing bahut saari percentile le aaunga Drop kyu lenaa..(bahut mtlb 86 ig.. ), 17 July i remember the date sicne then Dakniya Talav se Vigyan nagr, City Park se Pariksha Desk sb ghum liya, Mess ki wo aloo sev ki sbji and kchhi roti awww what a memo.., JEC ,Jaipur Centre of JEE Advanced (ghum ke aaya bs IIT toh bs shatter hi huyi thi border cut off marks se, Crack toh nhi huyi thi IIT ig...",
        achievements: ["V-25 Batch", "Motion Private Limited", "Mess ka Khana waahh", "Kota ke Chambla ka Paani"],
        tech: ["Self-Dependatn", "Goal in Mind", "is This the END ( late night... )"],
        icon: Users, image: ["https://i.postimg.cc/TPq0c3jx/Whats-App-Image-2026-06-03-at-4-48-08-PM.jpg"],
        accentColor: "#f59e0b",
    },
    {
        id: "SSB", year: "2023", chapter: "Hows the Josss Boissss...",
        title: "TES ki Call up letter aagya bs ab toh SSB ho jayegii..", tagline: "Confrence room se direct psychological warfare...",
        description: "22 August 2023 se 27 August tk ki Journey, Hotel Just Stayin se SSB Bhopal ke Lohee ke Bed pe sonaa... ,5 days somethign i learnt that discipline, dedication and presence of minds hmesha insaan ko cherry on top rkhte, wo khana, wo dress code,SRT,PPT,TAT,WAT se leke GTO tk all nightmare.... ",
        achievements: ["Leadership", "Quality Learning", "Peak Male Memory"],
        tech: ["Group Task", "Brainstorming", "Confidence", "SSB-Bhopal 22"],
        icon: Gamepad2, image: ["https://i.postimg.cc/8CtW5JBH/Whats-App-Image-2026-06-03-at-4-49-48-PM-(1).jpg", "https://i.postimg.cc/Y2f7m6LP/Whats-App-Image-2026-06-03-at-4-46-41-PM.jpg"],
        accentColor: "#f472b6",
    },
    {
        id: "NITJ", year: "2024", chapter: "Bhaiyaa Jiiii KI PATHSHALA",
        title: "Yahan Toh Bhaiii SabiiIITian Hain", tagline: "Ab NIT mei aagye toh 18-20 LPA toh fix hi hai (Meanwhile companies:- Ruko jraa sbr toh kro )",
        description: "Joined Dr. B.R. Ambedkar NIT Jalandhar in Instrumentation & Control Engineering and Minor in CSE...Sriously Day 1 of lecture HOD sir said beta Jeb mei Tester leke chla kro kb jrurt pd jaaayee...",
        achievements: ["Class Representative (CR)", "multiple software & IoT projects", "Student Conveyer Apogee Club, DUGC Member"],
        tech: ["WebD", "OOPs", "RDBMS", "IoT", "Machine Learning", "CSE", "Electrical Machine", "Senors & Transducers", "Matlab"],
        icon: Cpu, image: ["https://i.postimg.cc/7ZbbVsgZ/Whats-App-Image-2026-06-03-at-4-52-35-PM.jpg"],
        accentColor: "#34d399",
    },
];

const VB_W = 780;
const VB_H = 1050;

// Same winding S-curve shape, compressed vertically
const SPINE_PTS: [number, number][] = [
    [100, 60],   // was [350,120]
    [590, 160],  // was [650,350]
    [180, 460],  // was [320,650]
    [620, 560],  // was [680,950]
    [320, 720],  // was [350,1250]
    [560, 920], // was [600,1550]
];

const DEST_PT: [number, number] = [500, 1000]; // was [500,2570]

// Half-widths reduced ~22%
const HALF_WIDTHS: number[] = [19, 23, 27, 31, 35, 39]; // was [25,30,35,40,45,50]
const DEST_HALF_W = 43; // was 55

/* ── Cubic bezier helpers (unchanged) ── */
function cubicPt(
    p0: [number, number], p1: [number, number],
    p2: [number, number], p3: [number, number], t: number
): [number, number] {
    const u = 1 - t;
    return [
        u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
        u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
    ];
}

function cubicDeriv(
    p0: [number, number], p1: [number, number],
    p2: [number, number], p3: [number, number], t: number
): [number, number] {
    const u = 1 - t;
    return [
        3 * (u * u * (p1[0] - p0[0]) + 2 * u * t * (p2[0] - p1[0]) + t * t * (p3[0] - p2[0])),
        3 * (u * u * (p1[1] - p0[1]) + 2 * u * t * (p2[1] - p1[1]) + t * t * (p3[1] - p2[1])),
    ];
}

function catmullToBezierSegments(pts: [number, number][]): {
    p0: [number, number]; p1: [number, number];
    p2: [number, number]; p3: [number, number];
}[] {
    const segs = [];
    for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[Math.max(0, i - 1)];
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const p3 = pts[Math.min(pts.length - 1, i + 2)];
        const cp1: [number, number] = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
        const cp2: [number, number] = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
        segs.push({ p0: p1, p1: cp1, p2: cp2, p3: p2 });
    }
    return segs;
}

const ALL_SPINE = [...SPINE_PTS, DEST_PT];
const ALL_HALF_W = [...HALF_WIDTHS, DEST_HALF_W];
const SEGMENTS = catmullToBezierSegments(ALL_SPINE);

function buildSpinePath(segs: typeof SEGMENTS): string {
    let d = `M ${segs[0].p0[0]} ${segs[0].p0[1]}`;
    for (const s of segs) {
        d += ` C ${s.p1[0]} ${s.p1[1]}, ${s.p2[0]} ${s.p2[1]}, ${s.p3[0]} ${s.p3[1]}`;
    }
    return d;
}

function spinePoint(t: number): [number, number] {
    const n = SEGMENTS.length;
    const st = t * n;
    const i = Math.min(Math.floor(st), n - 1);
    const lt = st - i;
    const s = SEGMENTS[i];
    return cubicPt(s.p0, s.p1, s.p2, s.p3, lt);
}

function spineDerivative(t: number): [number, number] {
    const n = SEGMENTS.length;
    const st = t * n;
    const i = Math.min(Math.floor(st), n - 1);
    const lt = st - i;
    const s = SEGMENTS[i];
    return cubicDeriv(s.p0, s.p1, s.p2, s.p3, lt);
}

function spineHalfW(t: number): number {
    const n = ALL_HALF_W.length - 1;
    const st = t * n;
    const i = Math.min(Math.floor(st), n - 1);
    const lt = st - i;
    return ALL_HALF_W[i] * (1 - lt) + ALL_HALF_W[i + 1] * lt;
}

function buildOffsetPath(side: "left" | "right", extraW = 0): string {
    const steps = 200;
    const pts: [number, number][] = [];
    for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const [px, py] = spinePoint(t);
        const [dx, dy] = spineDerivative(t);
        const len = Math.sqrt(dx * dx + dy * dy) || 1;
        const nx = -dy / len;
        const ny = dx / len;
        const sign = side === "left" ? -1 : 1;
        const hw = spineHalfW(t) + extraW;
        pts.push([px + sign * nx * hw, py + sign * ny * hw]);
    }
    let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
    for (let i = 1; i < pts.length - 1; i += 2) {
        d += ` Q ${pts[i][0].toFixed(1)} ${pts[i][1].toFixed(1)}, ${pts[i + 1][0].toFixed(1)} ${pts[i + 1][1].toFixed(1)}`;
    }
    return d;
}

function buildRoadFill(): string {
    const steps = 100;
    const leftPts: [number, number][] = [];
    const rightPts: [number, number][] = [];
    for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const [px, py] = spinePoint(t);
        const [dx, dy] = spineDerivative(t);
        const len = Math.sqrt(dx * dx + dy * dy) || 1;
        const nx = -dy / len;
        const ny = dx / len;
        const hw = spineHalfW(t);
        leftPts.push([px - nx * hw, py - ny * hw]);
        rightPts.push([px + nx * hw, py + ny * hw]);
    }
    let d = `M ${leftPts[0][0].toFixed(1)} ${leftPts[0][1].toFixed(1)}`;
    for (const p of leftPts.slice(1)) d += ` L ${p[0].toFixed(1)} ${p[1].toFixed(1)}`;
    for (const p of [...rightPts].reverse()) d += ` L ${p[0].toFixed(1)} ${p[1].toFixed(1)}`;
    d += " Z";
    return d;
}

const ROAD_FILL = buildRoadFill();
const LEFT_EDGE = buildOffsetPath("left");
const RIGHT_EDGE = buildOffsetPath("right");
const SPINE_PATH = buildSpinePath(SEGMENTS);

function getMilestoneT(index: number): number {
    return index / (SPINE_PTS.length - 1) * ((SPINE_PTS.length - 1) / (ALL_SPINE.length - 1));
}

const POLE_SIDE = [
    "right",
    "right",
    "left",
    "right",
    "left",
    "right",
    "left"
];
const POLE_OFFSET = 42; // reduced from 35

function getPoleBase(index: number): [number, number] {
    const t = getMilestoneT(index);
    const [px, py] = spinePoint(t);
    const [dx, dy] = spineDerivative(t);
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;
    const sign = POLE_SIDE[index] === "left" ? -1 : 1;
    const hw = spineHalfW(t);
    return [px + sign * nx * (hw + POLE_OFFSET), py + sign * ny * (hw + POLE_OFFSET)];
}

function getRoadShoulderPt(index: number): [number, number] {
    const t = getMilestoneT(index);
    const [px, py] = spinePoint(t);
    const [dx, dy] = spineDerivative(t);
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;
    const sign = POLE_SIDE[index] === "left" ? -1 : 1;
    const hw = spineHalfW(t);
    return [px + sign * nx * (hw + 4), py + sign * ny * (hw + 4)];
}

/* ═══════════════════════════════════════════════════════════
   LIGHT POLE SVG COMPONENT
═══════════════════════════════════════════════════════════ */
interface PoleProps {
    milestone: Milestone;
    index: number;
    isActive: boolean;
    onClick: () => void;
}

const LightPole: React.FC<PoleProps> = ({ milestone, index, isActive, onClick }) => {
    const [hovered, setHovered] = useState(false);

    const [bx, by] = getPoleBase(index);
    const [sx, sy] = getRoadShoulderPt(index);
    const side = POLE_SIDE[index];

    // Slightly reduced scale progression
    const scale = 0.42 + index * 0.03;
    const beaconR = 30 * scale; // was 40*scale
    const poleH = 55 + index * 6; // was 70 + index*8
    const poleTopX = bx + (side === "right" ? -14 : 14);
    const poleTopY = by - poleH;
    const lampArmX = poleTopX + (side === "right" ? -13 : 13);
    const lampArmY = poleTopY - 6;

    const lit = isActive || hovered;

    return (
        <g
            style={{ cursor: "pointer" }}
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Road connector line */}
            <line
                x1={sx} y1={sy}
                x2={bx} y2={by}
                stroke={milestone.accentColor}
                strokeWidth={lit ? 2 : 1}
                opacity={lit ? 0.7 : 0.3}
                strokeDasharray="4 3"
            />

            {/* Ground halo — reduced radii */}
            <motion.ellipse
                cx={bx} cy={by + 5}
                rx={beaconR * (lit ? 1.9 : 1.2)}
                ry={6 * (lit ? 1.5 : 1)}
                fill={milestone.accentColor}
                animate={{
                    rx: lit ? [beaconR * 1.9, beaconR * 2.2, beaconR * 1.9] : beaconR * 1.2,
                    opacity: lit ? [0.25, 0.4, 0.25] : 0.1,
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 }}
            />

            {/* Pole shaft */}
            <line
                x1={bx} y1={by}
                x2={poleTopX} y2={poleTopY}
                stroke={milestone.accentColor}
                strokeWidth={1.5}
                strokeLinecap="round"
                opacity={lit ? 0.85 : 0.5}
            />

            {/* Pole arm */}
            <line
                x1={poleTopX} y1={poleTopY}
                x2={lampArmX} y2={lampArmY}
                stroke={milestone.accentColor}
                strokeWidth={1.2}
                strokeLinecap="round"
                opacity={lit ? 0.85 : 0.5}
            />

            {/* Lamp housing */}
            <motion.rect
                x={lampArmX - 10}
                y={lampArmY - 5}
                width={58}
                height={22} rx={4}
                fill={lit ? milestone.accentColor : "#1e293b"}
                stroke={milestone.accentColor}
                strokeWidth={1}
                opacity={lit ? 1 : 0.55}
                animate={{ fill: lit ? milestone.accentColor : "#1e293b" }}
                transition={{ duration: 0.3 }}
            />

            {/* Lamp cone light spread */}
            <motion.polygon
                points={`
          ${lampArmX - 10},${lampArmY + 3}
          ${lampArmX - 18},${lampArmY + 13}
          ${lampArmX + 10},${lampArmY + 13}
          ${lampArmX + 10},${lampArmY + 3}
        `}
                fill={milestone.accentColor}
                animate={{ opacity: lit ? [0.2, 0.32, 0.2] : 0.06 }}
                transition={{ duration: 1.5, repeat: Infinity }}
            />

            {/* Beacon glow outer ring */}
            {lit && (
                <motion.circle
                    cx={bx} cy={by}
                    r={beaconR * 3.5}
                    fill="none"
                    stroke={milestone.accentColor}
                    strokeWidth={1}
                    animate={{ r: [beaconR * 1.6, beaconR * 2.1, beaconR * 1.6], opacity: [0.3, 0.05, 0.3] }}
                    transition={{ duration: 1.8, repeat: Infinity }}
                />
            )}

            {/* Main beacon */}
            <motion.circle
                cx={bx} cy={by}
                r={beaconR}
                fill={lit ? milestone.accentColor : "#0d1424"}
                stroke={milestone.accentColor}
                strokeWidth={lit ? 2 : 1.5}
                animate={{
                    r: lit ? [beaconR, beaconR * 1.07, beaconR] : beaconR,
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
            />

            {/* Icon */}
            <foreignObject
                x={bx - beaconR * 0.6}
                y={by - beaconR * 0.6}
                width={beaconR * 1.2}
                height={beaconR * 1.2}
                style={{ pointerEvents: "none" }}
            >
            </foreignObject>

            {/* Year label */}
            <text
                x={side === "left" ? bx - beaconR - 8 : bx + beaconR + 8}
                y={by - 4}
                textAnchor={side === "left" ? "end" : "start"}
                fill={milestone.accentColor}
                fontSize={18} fontWeight="800"
                fontFamily="'Space Mono', monospace"
                opacity={lit ? 1 : 0.65}
            >
                {milestone.year}
            </text>
            <text
                x={side === "left" ? bx - beaconR - 8 : bx + beaconR + 8}
                y={by + 9}
                textAnchor={side === "left" ? "end" : "start"}
                fill="#94a3b8" fontSize={7}
                fontFamily="'Space Mono', monospace"
                opacity={lit ? 0.9 : 0.45}
            >
                {milestone.title.length > 16 ? milestone.title.slice(0, 16) + "…" : milestone.title}
            </text>

            {/* Hover tooltip */}
            <AnimatePresence>
                {hovered && !isActive && (
                    <motion.g
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                    >
                        <rect
                            x={bx - 50}
                            y={poleTopY - 30}
                            width={100}
                            height={22}
                            rx={11}
                            fill="#0a1020"
                            stroke={milestone.accentColor}
                            strokeWidth={1}
                        />
                        <text
                            x={bx}
                            y={poleTopY - 16}
                            textAnchor="middle"
                            fill={milestone.accentColor}
                            fontSize={9}
                            fontWeight="700"
                        >
                            Click to Explore
                        </text>
                    </motion.g>
                )}
            </AnimatePresence>
        </g>
    );
};

/* ═══════════════════════════════════════════════════════════
   DETAIL PANEL
═══════════════════════════════════════════════════════════ */
const DetailPanel: React.FC<{ milestone: Milestone | null; onClose: () => void }> = ({ milestone, onClose }) => {
    const [currentImage, setCurrentImage] = useState(0);

    useEffect(() => {
        setCurrentImage(0);
    }, [milestone]);

    return (
        <AnimatePresence mode="wait">
            {milestone && (
                <motion.div
                    key={milestone.id}
                    initial={{ opacity: 0, x: 64 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 64 }}
                    transition={{ duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="fixed inset-0 z-50"
                    style={{ width: "100vw", height: "100vh" }}
                >
                    <div className="h-full overflow-y-auto" style={{
                        background: "rgba(7, 11, 26, 0.97)",
                        borderLeft: `1px solid ${milestone.accentColor}28`,
                        backdropFilter: "blur(28px)",
                        boxShadow: `-24px 0 80px ${milestone.accentColor}12, -4px 0 24px rgba(0,0,0,0.7)`,
                    }}>
                        {/* Hero image */}
                        <div className="relative overflow-hidden" style={{ height: 600 }}>
                            <motion.img
                                key={currentImage}
                                src={milestone.image[currentImage]}
                                alt={milestone.title}
                                className="w-full h-full object-cover"
                                initial={{ opacity: 0, scale: 1.08 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4 }}
                                style={{ filter: "brightness(0.55) saturate(1.2)" }}
                            />
                            <div className="absolute inset-0" style={{
                                background: `linear-gradient(to bottom, transparent 35%, rgba(7,11,26,0.97) 100%)`
                            }} />
                            <button
                                onClick={onClose}
                                className="absolute top-6 left-6 z-30 flex items-center gap-2 px-4 py-2 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 text-white"
                            >
                                <ChevronLeft size={18} />
                                Back
                            </button>
                            <div
                                className="absolute top-5 right-20 px-4 py-2 rounded-full text-xs font-bold tracking-[0.25em] uppercase z-40"
                                style={{
                                    background: `${milestone.accentColor}18`, border: `1px solid ${milestone.accentColor}45`,
                                    color: milestone.accentColor, fontFamily: "'Space Mono', monospace",
                                }}>
                                {milestone.chapter}
                            </div>
                            {milestone.image.length > 1 && (
                                <>
                                    <button
                                        onClick={() =>
                                            setCurrentImage(
                                                currentImage === 0
                                                    ? milestone.image.length - 1
                                                    : currentImage - 1
                                            )
                                        }
                                        className="absolute left-3 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/30 backdrop-blur-md border border-white/10 hover:bg-black/50 transition-all"
                                    >
                                        <ChevronLeft size={18} className="text-white" />
                                    </button>
                                    <button
                                        onClick={() =>
                                            setCurrentImage(
                                                (currentImage + 1) % milestone.image.length
                                            )
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/30 backdrop-blur-md border border-white/10 hover:bg-black/50 transition-all"
                                    >
                                        <ChevronRight size={18} className="text-white" />
                                    </button>
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                                        {milestone.image.map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setCurrentImage(idx)}
                                                className={`w-2 h-2 rounded-full ${currentImage === idx ? "bg-white" : "bg-white/40"}`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="px-7 pb-12">
                            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
                                <div className="text-xs font-bold tracking-[0.3em] uppercase mt-5 mb-2"
                                    style={{ color: milestone.accentColor, fontFamily: "'Space Mono', monospace" }}>
                                    {milestone.year}
                                </div>
                                <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-1">{milestone.title}</h2>
                                <p className="text-sm mb-5" style={{ color: milestone.accentColor }}>{milestone.tagline}</p>
                            </motion.div>
                            <div className="h-px w-full mb-5" style={{ background: `linear-gradient(to right, ${milestone.accentColor}38, transparent)` }} />
                            <motion.p className="text-gray-300 text-sm leading-relaxed mb-7"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.22 }}>
                                {milestone.description}
                            </motion.p>
                            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }} className="mb-7">
                                <div className="text-xs font-bold tracking-[0.25em] uppercase mb-3"
                                    style={{ color: "#475569", fontFamily: "'Space Mono', monospace" }}>Achievements</div>
                                <div className="space-y-2.5">
                                    {milestone.achievements.map((a, i) => (
                                        <motion.div key={a} className="flex items-start gap-3"
                                            initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.32 + i * 0.06 }}>
                                            <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: milestone.accentColor }} />
                                            <span className="text-gray-300 text-sm">{a}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.48 }}>
                                <div className="text-xs font-bold tracking-[0.25em] uppercase mb-3"
                                    style={{ color: "#475569", fontFamily: "'Space Mono', monospace" }}>Technologies</div>
                                <div className="flex flex-wrap gap-2">
                                    {milestone.tech.map((t) => (
                                        <span key={t} className="px-3 py-1 rounded-full text-xs font-medium"
                                            style={{
                                                background: `${milestone.accentColor}12`, border: `1px solid ${milestone.accentColor}30`,
                                                color: milestone.accentColor, fontFamily: "'Space Mono', monospace",
                                            }}>{t}</span>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

/* ═══════════════════════════════════════════════════════════
   DESTINATION PANEL
═══════════════════════════════════════════════════════════ */
const DestinationPanel: React.FC<{ open: boolean; onClose: () => void }> = ({ open, }) => (
    <AnimatePresence>
        {open && (
            <motion.div
                initial={{ opacity: 0, x: 64 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 64 }}
                transition={{ duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="fixed top-0 right-0 h-full z-50"
                style={{ width: "min(460px, 90vw)" }}
            >
                <div className="h-full overflow-y-auto flex flex-col justify-center px-10 py-16"
                    style={{
                        background: "rgba(7, 11, 26, 0.97)",
                        borderLeft: "1px solid rgba(250,204,21,0.2)",
                        backdropFilter: "blur(28px)",
                        boxShadow: "-24px 0 80px rgba(250,204,21,0.07), -4px 0 24px rgba(0,0,0,0.7)",
                    }}>
                </div>
            </motion.div>
        )}
    </AnimatePresence>
);

/* ═══════════════════════════════════════════════════════════
   BACKGROUND
═══════════════════════════════════════════════════════════ */
const Background: React.FC = () => (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <svg width="100%" height="100%" className="absolute inset-0" style={{ opacity: 0.035 }}>
            <defs>
                <pattern id="grid" x="0" y="0" width="44" height="44" patternUnits="userSpaceOnUse">
                    <path d="M 44 0 L 0 0 0 44" fill="none" stroke="#94a3b8" strokeWidth="0.5" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        <div className="absolute rounded-full" style={{ width: 700, height: 700, top: "0%", left: "-15%", background: "radial-gradient(circle, rgba(34,211,238,0.055) 0%, transparent 70%)", filter: "blur(80px)" }} />
        <div className="absolute rounded-full" style={{ width: 600, height: 600, top: "35%", right: "-12%", background: "radial-gradient(circle, rgba(129,140,248,0.055) 0%, transparent 70%)", filter: "blur(80px)" }} />
        <div className="absolute rounded-full" style={{ width: 600, height: 600, bottom: "15%", left: "15%", background: "radial-gradient(circle, rgba(244,114,182,0.045) 0%, transparent 70%)", filter: "blur(80px)" }} />
    </div>
);

/* ═══════════════════════════════════════════════════════════
   DESTINATION BEACON (SVG inline)
═══════════════════════════════════════════════════════════ */
/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════ */
const InningsPage: React.FC = () => {
    const [activeId, setActiveId] = useState<string | null>(null);
    const [destOpen, setDestOpen] = useState(false);

    const activeMilestone = MILESTONES.find((m) => m.id === activeId) ?? null;

    const handlePoleClick = (id: string) => {
        setDestOpen(false);
        setActiveId((prev) => (prev === id ? null : id));
    };

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") { setActiveId(null); setDestOpen(false); }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, []);

    return (
        <div className="min-h-screen text-white overflow-x-hidden relative" style={{ background: "#060a18", fontFamily: "'Space Grotesk', sans-serif" }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
      `}</style>

            <Background />

            {/* HERO — tighter padding, road starts right away */}
            <section className="relative z-10 container mx-auto px-6 pt-4 pb-2 max-w-6xl">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                    <h1 className="heading-1 mb-2" style={{ fontSize: "clamp(1.6rem, 4vw, 2.6rem)", fontWeight: 800 }}>
                        {`< Career Innings / >`}
                    </h1>
                    <p className="text-gray-400 text-sm max-w-lg leading-relaxed">
                        From Debutant to the Making of a Professional{" "}
                        <span style={{ color: "#818cf8" }}>Click any beacon to explore the story.</span>
                    </p>
                </motion.div>
            </section>

            {/* ROAD SVG — compact margins */}
            <section
                className="relative z-10 w-full"
                style={{ marginTop: "16px" }}
            >
                <svg
                    viewBox={`0 0 ${VB_W} ${VB_H}`}
                    preserveAspectRatio="xMidYMin meet"
                    className="w-full"
                    style={{ maxWidth: "1100px", display: "block", margin: "0 auto", overflow: "visible" }}
                >
                    <defs>
                        <linearGradient id="asphalt" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#0f172a" />
                            <stop offset="35%" stopColor="#1e293b" />
                            <stop offset="50%" stopColor="#334155" />
                            <stop offset="65%" stopColor="#1e293b" />
                            <stop offset="100%" stopColor="#0f172a" />
                        </linearGradient>
                        <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.85" />
                            <stop offset="40%" stopColor="#818cf8" stopOpacity="0.85" />
                            <stop offset="70%" stopColor="#f472b6" stopOpacity="0.85" />
                            <stop offset="100%" stopColor="#facc15" stopOpacity="0.9" />
                        </linearGradient>
                        <filter id="edgeGlow">
                            <feGaussianBlur stdDeviation="4" result="blur" />
                            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                        </filter>
                        <filter id="surfaceSheen">
                            <feGaussianBlur stdDeviation="14" result="blur" />
                            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                        </filter>
                        <filter id="roadGlow">
                            <feGaussianBlur stdDeviation="18" result="blur" />
                            <feMerge><feMergeNode in="blur" /></feMerge>
                        </filter>
                    </defs>

                    {/* Road under-glow */}
                    <path d={ROAD_FILL} fill="#818cf8" opacity="0.08" filter="url(#roadGlow)" />

                    {/* Road outer shoulders */}
                    <path d={buildOffsetPath("left", 14)} fill="none" stroke="#22d3ee" strokeWidth="5" opacity="0.04" filter="url(#surfaceSheen)" />
                    <path d={buildOffsetPath("right", 14)} fill="none" stroke="#f472b6" strokeWidth="5" opacity="0.04" filter="url(#surfaceSheen)" />

                    {/* Road asphalt fill */}
                    <motion.path
                        d={ROAD_FILL}
                        fill="url(#asphalt)"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                    />

                    {/* Center subtle highlight */}
                    <motion.path
                        d={SPINE_PATH}
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth="24"
                        opacity="0.012"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2.8, ease: "easeInOut", delay: 0.3 }}
                    />

                    {/* Left edge glow */}
                    <path d={LEFT_EDGE} fill="none" stroke="url(#edgeGrad)" strokeWidth="8" opacity="0.35" filter="url(#edgeGlow)" />
                    <motion.path
                        d={LEFT_EDGE} fill="none" stroke="url(#edgeGrad)" strokeWidth="2"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 3, ease: "easeInOut", delay: 0.5 }}
                    />

                    {/* Right edge glow */}
                    <path d={RIGHT_EDGE} fill="none" stroke="url(#edgeGrad)" strokeWidth="8" opacity="0.35" filter="url(#edgeGlow)" />
                    <motion.path
                        d={RIGHT_EDGE} fill="none" stroke="url(#edgeGrad)" strokeWidth="2"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 3, ease: "easeInOut", delay: 0.5 }}
                    />

                    {/* Center lane dashes */}
                    <motion.path
                        d={SPINE_PATH} fill="none"
                        stroke="rgba(255,255,255,0.16)"
                        strokeWidth="4" strokeLinecap="round"
                        strokeDasharray="18 16"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 3.2, ease: "easeInOut", delay: 0.8 }}
                    />

                    {/* Active road segment highlight */}
                    {activeId && (() => {
                        const idx = MILESTONES.findIndex(m => m.id === activeId);
                        const t = getMilestoneT(idx);
                        const color = MILESTONES[idx].accentColor;
                        const [px, py] = spinePoint(t);
                        return (
                            <motion.circle
                                key={activeId}
                                cx={px} cy={py} r={7}
                                fill={color} opacity={0.8}
                                animate={{ r: [7, 12, 7], opacity: [0.8, 0.2, 0.8] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            />
                        );
                    })()}

                    {/* LIGHT POLES */}
                    {MILESTONES.map((m, i) => (
                        <LightPole
                            key={m.id}
                            milestone={m}
                            index={i}
                            isActive={activeId === m.id}
                            onClick={() => handlePoleClick(m.id)}
                        />
                    ))}

                    {/* DESTINATION BEACON */}
                </svg>
            </section>

            {/* PANELS */}
            <DetailPanel milestone={activeMilestone} onClose={() => setActiveId(null)} />
            <DestinationPanel open={destOpen} onClose={() => setDestOpen(false)} />

            {/* Backdrop */}
            <AnimatePresence>
                {(activeId || destOpen) && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => { setActiveId(null); setDestOpen(false); }}
                        className="fixed inset-0 z-40"
                        style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(3px)" }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default InningsPage;