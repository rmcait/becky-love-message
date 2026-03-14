"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ============================================================
// TYPES
// ============================================================
interface Particle {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
  symbol: string;
}

// ============================================================
// FLOATING PARTICLES
// ============================================================
function FloatingParticles({ particles }: { particles: Particle[] }) {
  return (
    <>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="fixed pointer-events-none select-none"
          style={{
            left: `${p.x}%`,
            bottom: -40,
            fontSize: p.size,
            color: "rgba(220, 130, 110, 0.3)",
            zIndex: 0,
          }}
          animate={{ y: "-110vh", opacity: [0, 0.7, 0.7, 0] }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {p.symbol}
        </motion.div>
      ))}
    </>
  );
}

// ============================================================
// ENVELOPE SCREEN
// ============================================================
function EnvelopeScreen({ onOpen }: { onOpen: () => void }) {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    if (clicked) return;
    setClicked(true);
    setTimeout(onOpen, 700);
  };

  return (
    <motion.div
      className="flex flex-col items-center gap-10"
      exit={{ scale: 0.5, opacity: 0, y: -30 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      {/* Subtitle */}
      <motion.p
        className="text-xs tracking-[0.6em] text-[#9B8B74] uppercase"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.7 }}
      >
        あなただけへ
      </motion.p>

      {/* Envelope */}
      <motion.div
        initial={{ opacity: 0, scale: 0.75, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
        whileHover={{ y: -8 }}
        whileTap={{ scale: 0.96 }}
        onClick={handleClick}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        className="cursor-pointer relative select-none"
        style={{ width: "min(480px, 88vw)", aspectRatio: "480/320" }}
      >
        {/* Drop shadow */}
        <div
          className="absolute inset-x-6 -bottom-3 h-5 rounded-full blur-lg"
          style={{ background: "rgba(0,0,0,0.12)" }}
        />

        {/* Envelope body */}
        <div className="absolute inset-0 rounded-xl overflow-hidden shadow-2xl">
          {/* Base color */}
          <div className="absolute inset-0" style={{ background: "#EEE4D2" }} />

          {/* Side folds (decorative triangles) */}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, #E3D6BF 50%, transparent 50%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(225deg, #E3D6BF 50%, transparent 50%)",
            }}
          />

          {/* Bottom fold */}
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: "55%",
              background: "#E8DCC8",
              clipPath: "polygon(0% 100%, 100% 100%, 50% 0%)",
            }}
          />

          {/* Inner border */}
          <div
            className="absolute rounded-xl border border-[#D0C0A0]/40"
            style={{ inset: "10px" }}
          />

          {/* Wax seal */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={
                clicked
                  ? { scale: [1, 1.3, 0], opacity: [1, 1, 0] }
                  : hovered
                  ? { scale: 1.08, rotate: 8 }
                  : { scale: 1, rotate: 0 }
              }
              transition={{ type: "spring", stiffness: 200, damping: 12 }}
              className="w-[70px] h-[70px] rounded-full flex items-center justify-center shadow-xl"
              style={{
                background: "radial-gradient(circle at 35% 35%, #f87171, #dc2626)",
              }}
            >
              <span className="text-white text-2xl leading-none select-none">♡</span>
            </motion.div>
          </div>

          {/* Click hint */}
          <motion.div
            animate={{ opacity: hovered && !clicked ? 1 : 0 }}
            className="absolute bottom-5 inset-x-0 text-center"
          >
            <span className="text-[#9B8874] text-xs tracking-widest">
              タップして開く
            </span>
          </motion.div>
        </div>

        {/* Top flap */}
        <div
          className="absolute top-0 left-0 right-0 rounded-t-xl overflow-hidden"
          style={{ height: "55%", zIndex: 2 }}
        >
          <motion.div
            className="w-full h-full"
            animate={
              clicked
                ? { rotateX: -180, y: "-10%" }
                : hovered
                ? { y: -6 }
                : { y: 0 }
            }
            transition={{
              rotateX: { duration: 0.6, ease: "easeInOut" },
              y: { type: "spring", stiffness: 200 },
            }}
            style={{
              background: "#F0E7D4",
              clipPath: "polygon(0% 0%, 100% 0%, 50% 78%)",
              transformOrigin: "top center",
              transformStyle: "preserve-3d",
            }}
          />
        </div>
      </motion.div>

      {/* Floating ornaments */}
      <motion.div
        className="flex gap-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
      >
        {["♡", "✿", "❀", "✿", "♡"].map((s, i) => (
          <motion.span
            key={i}
            className="text-rose-300/50 text-sm select-none"
            animate={{ y: [0, -7, 0] }}
            transition={{
              duration: 2.8,
              delay: i * 0.35,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {s}
          </motion.span>
        ))}
      </motion.div>
    </motion.div>
  );
}

// ============================================================
// POLAROID PHOTO FRAME
// ============================================================
function PhotoFrame({
  src,
  caption,
  alt,
  rotation = 2,
}: {
  src?: string;
  caption: string;
  alt: string;
  rotation?: number;
}) {
  return (
    <div className="flex justify-center my-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 20 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white shadow-xl max-w-[260px] w-full"
        style={{
          padding: "10px 10px 44px",
          rotate: rotation,
          boxShadow: "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt}
            className="w-full object-cover block"
            style={{ aspectRatio: "4/3" }}
          />
        ) : (
          <div
            className="w-full flex flex-col items-center justify-center text-[#B8A088] gap-1"
            style={{ aspectRatio: "4/3", background: "#F5EDE0" }}
          >
            <span className="text-4xl">📷</span>
            <p className="text-xs font-light">写真をここに入れてね</p>
            <p className="text-[10px] opacity-50 mt-1">src=&quot;/photo1.jpg&quot;</p>
          </div>
        )}
        <p
          className="text-center text-[#8B7355] text-sm mt-3 leading-snug"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {caption}
        </p>
      </motion.div>
    </div>
  );
}

// ============================================================
// SORRY METER (funny element)
// ============================================================
function SorryMeter() {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
          let current = 0;
          const target = 9999;
          const step = 133;
          const id = setInterval(() => {
            current += step;
            if (current >= target) {
              setCount(target);
              clearInterval(id);
            } else {
              setCount(current);
            }
          }, 20);
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [started]);

  return (
    <motion.div
      ref={ref}
      className="my-10 rounded-2xl text-center relative overflow-hidden"
      style={{
        border: "2px dashed #E0C9A8",
        background: "linear-gradient(135deg, #FFF9F2 0%, #FFF4E8 100%)",
        padding: "28px 24px",
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* Stamp decoration */}
      <div
        className="stamp absolute top-4 right-4 opacity-60"
        style={{
          border: "2px solid #DC5050",
          borderRadius: "6px",
          padding: "3px 6px",
          color: "#DC5050",
          fontSize: "9px",
          fontWeight: 600,
          letterSpacing: "0.12em",
          lineHeight: 1.4,
          textAlign: "center",
        }}
      >
        GENUINE<br />SORRY
      </div>

      <p className="text-[#B09070] text-xs tracking-[0.45em] uppercase mb-3 font-light">
        公式 ごめんなさいメーター
      </p>

      <motion.div
        className="text-6xl font-bold text-rose-500 my-1 tabular-nums"
        style={{ fontVariantNumeric: "tabular-nums" }}
        animate={count >= 9999 ? { scale: [1, 1.08, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        {count.toLocaleString()}
        <span className="text-4xl">%</span>
      </motion.div>

      {/* Progress bar */}
      <div className="w-full h-3 rounded-full overflow-hidden mt-5 mb-2" style={{ background: "#F0DEC8" }}>
        <motion.div
          className="h-full rounded-full"
          style={{
            background: "linear-gradient(90deg, #fb7185, #f43f5e, #ec4899)",
          }}
          initial={{ width: "0%" }}
          animate={{ width: started ? "100%" : "0%" }}
          transition={{ duration: 2.8, ease: "easeOut" }}
        />
      </div>

      <AnimatePresence>
        {count >= 9999 && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-rose-400 text-xs mt-3"
          >
            ⚠️ メーターが振り切れました。ごめんなさいが溢れています。
          </motion.p>
        )}
      </AnimatePresence>

      <p className="text-[#B09878] text-xs mt-3 font-light">
        ※ これは科学的に正確な測定値です
      </p>
    </motion.div>
  );
}

// ============================================================
// LOVE REASONS
// ============================================================
function LoveReasons() {
  // ✏️ ここのリストを自由に編集してください
  const reasons = [
    { icon: "☀️", text: "あなたの笑顔で、毎日が明るくなる" },
    { icon: "🌙", text: "寝顔が世界で一番かわいい（本当）" },
    { icon: "✨", text: "怒ってる顔も、ちょっと好き（ごめん）" },
    { icon: "🎵", text: "一緒にいると時間が経つのが早すぎる" },
    { icon: "♡", text: "あなたといる自分が、いちばん好き" },
  ];

  return (
    <div className="my-8">
      <p className="text-center text-[#9B8874] text-xs tracking-[0.45em] uppercase mb-6">
        あなたが好きな理由
      </p>
      <div className="space-y-4">
        {reasons.map((r, i) => (
          <motion.div
            key={i}
            className="flex items-center gap-4 text-[#5C4A3A]"
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: i * 0.1, duration: 0.45 }}
          >
            <span className="text-2xl flex-shrink-0">{r.icon}</span>
            <span className="font-light leading-relaxed" style={{ fontFamily: "var(--font-serif)" }}>
              {r.text}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// DIVIDER
// ============================================================
function Divider({ symbol = "✿" }: { symbol?: string }) {
  return (
    <div className="flex items-center gap-4 my-7">
      <div
        className="flex-1 h-px"
        style={{ background: "linear-gradient(to right, transparent, #E0C8A8)" }}
      />
      <span className="text-[#C8A882] text-base">{symbol}</span>
      <div
        className="flex-1 h-px"
        style={{ background: "linear-gradient(to left, transparent, #E0C8A8)" }}
      />
    </div>
  );
}

// ============================================================
// LETTER CONTENT
// ============================================================
function LetterPage() {
  return (
    <motion.div
      className="w-full max-w-xl mx-auto px-4 py-16"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: "#FFFDF8",
          boxShadow: "0 20px 60px rgba(0,0,0,0.10), 0 4px 16px rgba(0,0,0,0.06)",
          border: "1px solid rgba(220,195,160,0.4)",
        }}
      >
        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-[3px]"
          style={{ background: "linear-gradient(90deg, transparent, #f9a8a8, #fca5a5, transparent)" }}
        />

        <div className="px-8 sm:px-12 py-12">
          {/* Wax seal */}
          <div className="flex justify-center mb-8">
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 180, damping: 12 }}
              className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
              style={{
                background: "radial-gradient(circle at 35% 35%, #f87171, #dc2626)",
              }}
            >
              <span className="text-white text-xl select-none">♡</span>
            </motion.div>
          </div>

          {/* ✏️ 宛先の名前を変えてください */}
          <motion.h1
            className="text-center text-2xl text-[#3C3830] mb-1 tracking-widest"
            style={{ fontFamily: "var(--font-serif)" }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            〇〇へ
          </motion.h1>

          <Divider />

          {/* ✏️ 写真1を入れる場合: src="/photo1.jpg" を追記してください */}
          {/* 例: <PhotoFrame src="/photo1.jpg" caption="..." alt="..." rotation={2} /> */}
          <PhotoFrame
            caption="ここにキャプションを入れてね"
            alt="思い出の写真"
            rotation={2}
          />

          {/* ✏️ 手紙の本文をここに書いてください */}
          <div
            className="space-y-5 text-[#4A3F35] leading-loose font-light text-[0.97rem]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {/* ✏️ 第1段落 */}
              あのさ、ごめんね。
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
            >
              {/* ✏️ 第2段落 */}
              うまく言葉にできないこともあるけど、あなたへの気持ちはちゃんとある。ここに書いたこと、全部本当のことだよ。
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              {/* ✏️ 第3段落 */}
              怒らせてごめんなさい。でもね、怒ってるあなたも可愛くて、それを言ったらもっと怒られそうで言えなかった。
            </motion.p>
          </div>

          {/* Sorry meter */}
          <SorryMeter />

          {/* Love reasons */}
          <LoveReasons />

          <Divider symbol="❀" />

          {/* ✏️ 写真2を入れる場合: src="/photo2.jpg" を追記してください */}
          <PhotoFrame
            caption="大好きな瞬間"
            alt="思い出の写真2"
            rotation={-1.5}
          />

          {/* ✏️ 締めの言葉をここに書いてください */}
          <div
            className="space-y-4 text-[#4A3F35] leading-loose font-light text-[0.97rem] mt-4"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {/* ✏️ 締め第1段落 */}
              これからも、ずっと一緒にいてね。
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              {/* ✏️ 締め第2段落 */}
              大好きだよ。
            </motion.p>
          </div>

          <Divider />

          {/* ✏️ 差出人の名前を変えてください */}
          <div className="text-right">
            <p className="text-[#9B8874] text-sm font-light mb-1 tracking-widest">
              愛をこめて
            </p>
            <p
              className="text-[#3C3830] text-xl tracking-wider"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              〇〇より
            </p>
            <motion.p
              className="text-rose-400 text-base mt-2 tracking-widest"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              ♡ ♡ ♡
            </motion.p>
          </div>
        </div>

        {/* Bottom accent line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[3px]"
          style={{ background: "linear-gradient(90deg, transparent, #fca5a5, #f9a8a8, transparent)" }}
        />
      </div>
    </motion.div>
  );
}

// ============================================================
// MAIN APP
// ============================================================
export default function Home() {
  const [phase, setPhase] = useState<"envelope" | "letter">("envelope");
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const symbols = ["♡", "✿", "❀", "＊", "✦", "·"];
    setParticles(
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        x: (i / 14) * 100 + Math.random() * 7,
        delay: Math.random() * 6,
        duration: 7 + Math.random() * 7,
        size: 11 + Math.random() * 16,
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
      }))
    );
  }, []);

  return (
    <main className="min-h-screen relative overflow-x-hidden" style={{ background: "#FAF8F4" }}>
      {/* Floating background particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <FloatingParticles particles={particles} />
      </div>

      {/* Subtle background gradient */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(254,205,211,0.18) 0%, transparent 70%)",
          zIndex: 0,
        }}
      />

      {/* Main content */}
      <div className="relative" style={{ zIndex: 1 }}>
        <AnimatePresence mode="wait">
          {phase === "envelope" ? (
            <motion.div
              key="envelope"
              className="min-h-screen flex flex-col items-center justify-center px-4"
            >
              <EnvelopeScreen onOpen={() => setPhase("letter")} />
            </motion.div>
          ) : (
            <motion.div key="letter">
              <LetterPage />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
