import { useEffect, useMemo, useRef, useState } from "react";
import "./IconWall.css";

type IconDef = readonly [slug: string, color: string];

const ICONS: readonly IconDef[] = [
  ["react", "#61DAFB"],
  ["typescript", "#3178C6"],
  ["javascript", "#F7DF1E"],
  ["python", "#3776AB"],
  ["nodedotjs", "#5FA04E"],
  ["nextdotjs", "#FFFFFF"],
  ["vite", "#646CFF"],
  ["tailwindcss", "#06B6D4"],
  ["html5", "#E34F26"],
  ["css", "#1572B6"],
  ["mongodb", "#47A248"],
  ["postgresql", "#4169E1"],
  ["mysql", "#4479A1"],
  ["sqlite", "#0F80CC"],
  ["docker", "#2496ED"],
  ["kubernetes", "#326CE5"],
  ["nginx", "#009639"],
  ["git", "#F05032"],
  ["github", "#F0F0F0"],
  ["gitlab", "#FC6D26"],
  ["githubactions", "#2088FF"],
  ["linux", "#FCC624"],
  ["ubuntu", "#E95420"],
  ["archlinux", "#1793D1"],
  ["apple", "#F0F0F0"],
  ["vercel", "#F0F0F0"],
  ["netlify", "#00C7B7"],
  ["cloudflare", "#F38020"],
  ["digitalocean", "#0080FF"],
  ["amazonaws", "#FF9900"],
  ["terraform", "#844FBA"],
  ["grafana", "#F46800"],
  ["figma", "#F24E1E"],
  ["framer", "#0055FF"],
  ["cplusplus", "#00599C"],
  ["c", "#A8B9CC"],
  ["rust", "#F0F0F0"],
  ["go", "#00ADD8"],
  ["php", "#777BB4"],
  ["laravel", "#FF2D20"],
  ["ruby", "#CC342D"],
  ["rubyonrails", "#CC0000"],
  ["django", "#44B78B"],
  ["fastapi", "#009688"],
  ["express", "#F0F0F0"],
  ["flutter", "#54C5F8"],
  ["swift", "#F05138"],
  ["kotlin", "#7F52FF"],
  ["tensorflow", "#FF6F00"],
  ["pytorch", "#EE4C2C"],
  ["opencv", "#5C3EE8"],
  ["raspberrypi", "#C51A4A"],
  ["firebase", "#FFCA28"],
  ["redis", "#FF4438"],
  ["graphql", "#E10098"],
  ["prisma", "#F0F0F0"],
  ["supabase", "#3ECF8E"],
  ["threedotjs", "#F0F0F0"],
  ["redux", "#764ABC"],
  ["webpack", "#8DD6F9"],
  ["sass", "#CC6699"],
  ["eslint", "#4B32C3"],
  ["prettier", "#F7B93E"],
  ["jest", "#C21325"],
  ["playwright", "#2EAD33"],
  ["npm", "#CB3837"],
  ["visualstudiocode", "#007ACC"],
  ["cursor", "#F0F0F0"],
  ["intellijidea", "#FE315D"],
  ["pycharm", "#21D789"],
  ["webstorm", "#07C3F2"],
  ["neovim", "#57A143"],
  ["vim", "#019733"],
  ["androidstudio", "#3DDC84"],
  ["xcode", "#147EFB"],
  ["postman", "#FF6C37"],
  ["notion", "#F0F0F0"],
  ["openai", "#F0F0F0"],
  ["claude", "#D97757"],
  ["anthropic", "#D4A27F"],
  ["huggingface", "#FFD21E"],
  ["perplexity", "#20B8CD"],
  ["ollama", "#F0F0F0"],
  ["google", "#4285F4"],
  ["gmail", "#EA4335"],
  ["github", "#F0F0F0"],
  ["linkedin", "#0A66C2"],
  ["instagram", "#E4405F"],
  ["x", "#F0F0F0"],
  ["youtube", "#FF0033"],
  ["discord", "#5865F2"],
  ["slack", "#E01E5A"],
  ["spotify", "#1DB954"],
  ["stackoverflow", "#F58025"],
  ["meta", "#0668E1"],
];

const PER_COLUMN = 9;

const iconSrc = (slug: string) =>
  `https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/${slug}.svg`;

const glyphIsDark = (hex: string) => {
  const value = hex.replace("#", "");
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 > 0.72;
};

const columnsForWidth = (width: number) => {
  const cell = 96;
  return Math.max(16, Math.min(28, Math.ceil((width * 1.5) / cell)));
};

export const IconWall = () => {
  const wallRef = useRef<HTMLDivElement>(null);
  const [columns, setColumns] = useState(18);

  useEffect(() => {
    const fit = () => setColumns(columnsForWidth(window.innerWidth));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  useEffect(() => {
    const wall = wallRef.current;
    if (!wall) return;
    if (!window.matchMedia("(hover: hover) and (prefers-reduced-motion: no-preference)").matches) return;

    let frame = 0;
    const onMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = wall.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const clamp = (value: number) => Math.max(-0.5, Math.min(0.5, value));
        wall.style.setProperty("--mx", `${x}px`);
        wall.style.setProperty("--my", `${y}px`);
        wall.style.setProperty("--px", `${clamp(x / rect.width - 0.5)}`);
        wall.style.setProperty("--py", `${clamp(y / rect.height - 0.5)}`);
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  const grid = useMemo(() => {
    return Array.from({ length: columns }, (_, column) => {
      const start = (column * 5) % ICONS.length;
      const icons = Array.from({ length: PER_COLUMN }, (_, index) => {
        return ICONS[(start + index * 3) % ICONS.length];
      });
      return [...icons, ...icons];
    });
  }, [columns]);

  return (
    <div ref={wallRef} className="icon-wall" aria-hidden="true">
      <div className="icon-wall__lit">
        <div className="icon-wall__grid">
          {grid.map((icons, column) => (
            <div
              key={column}
              className="icon-wall__col"
              style={{ ["--drift" as string]: `${150 + (column % 3) * 30}s` }}
            >
              {icons.map(([slug, color], index) => (
                <span
                  key={`${column}-${index}`}
                  className="icon-wall__tile"
                  style={{ backgroundColor: color }}
                >
                  <img
                    className={glyphIsDark(color) ? "icon-wall__glyph icon-wall__glyph--dark" : "icon-wall__glyph"}
                    src={iconSrc(slug)}
                    alt=""
                    draggable={false}
                  />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
