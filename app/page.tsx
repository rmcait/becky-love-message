"use client";

import { useState, useEffect } from "react";
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
// LOVE REASONS
// ============================================================
function LoveReasons() {
  // ✏️ ここのリストを自由に編集してください
  const reasons = [
    { icon: "☀️", text: "あなたの笑顔が、俺の一番の原動力" },
    { icon: "💪", text: "Beckyのためなら、どんなことも頑張れる" },
    { icon: "🌙", text: "離れてても、いつもそばにいる気がする" },
    { icon: "✨", text: "あなたの存在が、俺を前に進ませてくれる" },
    { icon: "♡", text: "これからの未来を、Beckyと一緒に作っていきたい" },
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
            Beckyへ
          </motion.h1>

          <Divider />

          <PhotoFrame
            src="/images/IMG_0547.jpeg"
            caption="ここにキャプションを入れてね"
            alt="思い出の写真1"
            rotation={2}
          />
          <PhotoFrame
            src="/images/IMG_0621.jpeg"
            caption="大好きな瞬間"
            alt="思い出の写真2"
            rotation={-2}
          />
          <PhotoFrame
            src="/images/IMG_0861.jpeg"
            caption="一緒にいると楽しいね"
            alt="思い出の写真3"
            rotation={1.5}
          />

          <div
            className="space-y-5 text-[#4A3F35] leading-loose font-light text-[0.97rem]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              元気にしてる？テストで忙しい時期やと思うけど、無理しすぎんなよ。
              まずはちゃんと謝らせて。この前は感情的になって、思ってもない言葉までぶつけてしまった。ほんまにごめんな。
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
            >
              なんであんなふうになったか、ちゃんと伝えたくて。Beckyにもっといろんなことをしてあげたくて、でもそれができてない自分がずっと悔しかった。その情けなさが、あの時爆発してしまった。Beckyが原因やなくて、ぜんぶ俺自身の問題やった。
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              自分の「軸」を見失ってたことも、ちゃんと反省してる。余裕がない時こそ、ぶれずにいられるように。これから意識して、もっとちゃんとした自分になる。それがBeckyへの俺なりの答えやと思ってる。
            </motion.p>
          </div>

          {/* Love reasons */}
          <LoveReasons />

          <Divider symbol="❀" />

          <PhotoFrame
            src="/images/IMG_4250.JPG"
            caption="この笑顔が好き"
            alt="思い出の写真4"
            rotation={-1.5}
          />
          <PhotoFrame
            src="/images/IMG_2954.PNG"
            caption="ずっと覚えてる"
            alt="思い出の写真5"
            rotation={2.5}
          />
          <PhotoFrame
            src="/images/IMG_3556.PNG"
            caption="あなたといる時間"
            alt="思い出の写真6"
            rotation={-2}
          />
          <PhotoFrame
            src="/images/IMG_3635.PNG"
            caption="大切な思い出"
            alt="思い出の写真7"
            rotation={1}
          />
          <PhotoFrame
            src="/images/beauty_1732973176384.JPEG"
            caption="かわいいよ"
            alt="思い出の写真8"
            rotation={-1.5}
          />
          <PhotoFrame
            src="/images/beauty_1740204086175.JPEG"
            caption="いつも隣にいてね"
            alt="思い出の写真9"
            rotation={2}
          />

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
              喧嘩しても、やっぱりBeckyと一緒にいたい。その気持ちだけは、留学に行った後も今も、ずっと変わってない。今の状況は俺が必ず変えてみせる。不安なんてどうでもよくなるくらい、めちゃくちゃ良い生活を絶対にさせてあげる。
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              Beckyを愛してるからこそ、俺についてきてほしい。絶対に後悔はさせへん。改めて、ほんまにごめんな。そして、いつもありがとう。心から、愛してるよ。
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
