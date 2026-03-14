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
      <motion.p
        className="text-xs tracking-[0.6em] text-[#9B8B74] uppercase"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.7 }}
      >
        あなただけへ
      </motion.p>

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
        <div
          className="absolute inset-x-6 -bottom-3 h-5 rounded-full blur-lg"
          style={{ background: "rgba(0,0,0,0.12)" }}
        />
        <div className="absolute inset-0 rounded-xl overflow-hidden shadow-2xl">
          <div className="absolute inset-0" style={{ background: "#EEE4D2" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #E3D6BF 50%, transparent 50%)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(225deg, #E3D6BF 50%, transparent 50%)" }} />
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{ height: "55%", background: "#E8DCC8", clipPath: "polygon(0% 100%, 100% 100%, 50% 0%)" }}
          />
          <div className="absolute rounded-xl border border-[#D0C0A0]/40" style={{ inset: "10px" }} />
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
              style={{ background: "radial-gradient(circle at 35% 35%, #f87171, #dc2626)" }}
            >
              <span className="text-white text-2xl leading-none select-none">♡</span>
            </motion.div>
          </div>
          <motion.div
            animate={{ opacity: hovered && !clicked ? 1 : 0 }}
            className="absolute bottom-5 inset-x-0 text-center"
          >
            <span className="text-[#9B8874] text-xs tracking-widest">タップして開く</span>
          </motion.div>
        </div>
        <div className="absolute top-0 left-0 right-0 rounded-t-xl overflow-hidden" style={{ height: "55%", zIndex: 2 }}>
          <motion.div
            className="w-full h-full"
            animate={clicked ? { rotateX: -180, y: "-10%" } : hovered ? { y: -6 } : { y: 0 }}
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
            transition={{ duration: 2.8, delay: i * 0.35, repeat: Infinity, ease: "easeInOut" }}
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
function PhotoFrame({ src, caption, alt, rotation = 2 }: { src: string; caption: string; alt: string; rotation?: number }) {
  return (
    <div className="flex justify-center my-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 20 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white max-w-[260px] w-full"
        style={{
          padding: "10px 10px 44px",
          rotate: rotation,
          boxShadow: "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="w-full object-cover block" style={{ aspectRatio: "4/3" }} />
        <p className="text-center text-[#8B7355] text-sm mt-3 leading-snug" style={{ fontFamily: "var(--font-serif)" }}>
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
      <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, #E0C8A8)" }} />
      <span className="text-[#C8A882] text-base">{symbol}</span>
      <div className="flex-1 h-px" style={{ background: "linear-gradient(to left, transparent, #E0C8A8)" }} />
    </div>
  );
}

// ============================================================
// QUIZ SCREEN
// ============================================================
const quizData = [
  {
    photo: "/images/beauty_1732973176384.JPEG",
    question: "この写真でBeckyが着ていたニットの色は？",
    choices: ["ピンク", "黄色", "白"],
    correct: 0,
  },
  {
    photo: "/images/beauty_1740204086175.JPEG",
    question: "この写真はどの国で撮ったもの？",
    choices: ["日本", "中国", "韓国"],
    correct: 1,
  },
  {
    photo: "/images/IMG_3635.PNG",
    question: "この時のBeckyは何をしていた？",
    choices: ["勉強してた", "ご飯食べてた", "寝てた"],
    correct: 2,
  },
];

function QuizScreen({ onBack }: { onBack: () => void }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = quizData[current];

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === q.correct) setScore((s) => s + 1);
    setTimeout(() => {
      if (current + 1 >= quizData.length) {
        setFinished(true);
      } else {
        setCurrent((c) => c + 1);
        setSelected(null);
      }
    }, 1200);
  };

  if (finished) {
    return (
      <motion.div
        className="min-h-screen flex flex-col items-center justify-center px-6"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div
          className="w-full max-w-sm rounded-2xl p-10 text-center"
          style={{
            background: "#FFFDF8",
            boxShadow: "0 20px 60px rgba(0,0,0,0.10)",
            border: "1px solid rgba(220,195,160,0.4)",
          }}
        >
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="text-5xl mb-4"
          >
            {score === 3 ? "🎉" : score === 2 ? "😊" : "💪"}
          </motion.div>
          <p className="text-[#9B8874] text-xs tracking-[0.45em] uppercase mb-2">結果発表</p>
          <p className="text-5xl font-bold text-rose-500 mb-2">
            {score}<span className="text-2xl text-[#B09070]"> / 3</span>
          </p>
          <p className="text-[#4A3F35] text-sm leading-relaxed mt-4 font-light" style={{ fontFamily: "var(--font-serif)" }}>
            {score === 3
              ? "全問正解！やっぱりBeckyのこと、ちゃんと見てるよ。ありがとう。"
              : score === 2
              ? "あと少し！でも、俺のこと覚えてくれててありがとう。"
              : "これを機に、もっと俺のことも知ってね♡"}
          </p>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={onBack}
            className="mt-8 px-6 py-3 rounded-full text-sm text-white tracking-widest"
            style={{ background: "linear-gradient(135deg, #f87171, #ec4899)" }}
          >
            手紙に戻る
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-sm">
        {/* Progress */}
        <div className="flex gap-2 mb-6 justify-center">
          {quizData.map((_, i) => (
            <div
              key={i}
              className="h-1.5 flex-1 rounded-full transition-all duration-300"
              style={{ background: i <= current ? "#f87171" : "#E8D8C4" }}
            />
          ))}
        </div>

        <p className="text-center text-[#9B8874] text-xs tracking-[0.4em] uppercase mb-5">
          Question {current + 1} / {quizData.length}
        </p>

        {/* Photo */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.35 }}
            className="flex justify-center mb-6"
          >
            <div
              className="bg-white w-full max-w-[260px]"
              style={{
                padding: "10px 10px 44px",
                transform: `rotate(${current % 2 === 0 ? 1.5 : -1.5}deg)`,
                boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={q.photo} alt="クイズ写真" className="w-full object-cover block" style={{ aspectRatio: "4/3" }} />
              <p className="text-center text-[#C8A882] text-xs mt-3">？？？</p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Question */}
        <p className="text-center text-[#3C3830] text-base leading-relaxed mb-6 font-light" style={{ fontFamily: "var(--font-serif)" }}>
          {q.question}
        </p>

        {/* Choices */}
        <div className="space-y-3">
          {q.choices.map((choice, idx) => {
            let bg = "#FFFDF8";
            let border = "rgba(220,195,160,0.5)";
            let textColor = "#4A3F35";
            if (selected !== null) {
              if (idx === q.correct) {
                bg = "#FFF0F0";
                border = "#f87171";
                textColor = "#dc2626";
              } else if (idx === selected) {
                bg = "#F5F0E8";
                border = "#C8A882";
                textColor = "#9B8874";
              }
            }
            return (
              <motion.button
                key={idx}
                whileTap={selected === null ? { scale: 0.97 } : {}}
                onClick={() => handleSelect(idx)}
                className="w-full py-3 px-5 rounded-xl text-sm text-left transition-all duration-200"
                style={{
                  background: bg,
                  border: `1.5px solid ${border}`,
                  color: textColor,
                  fontFamily: "var(--font-serif)",
                  cursor: selected !== null ? "default" : "pointer",
                }}
              >
                <span className="mr-3 text-[#C8A882]">{["A", "B", "C"][idx]}.</span>
                {choice}
                {selected !== null && idx === q.correct && <span className="float-right">✓</span>}
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================
// LETTER CONTENT
// ============================================================
function LetterPage({ onQuiz }: { onQuiz: () => void }) {
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
        <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: "linear-gradient(90deg, transparent, #f9a8a8, #fca5a5, transparent)" }} />

        <div className="px-8 sm:px-12 py-12">
          {/* Wax seal */}
          <div className="flex justify-center mb-8">
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 180, damping: 12 }}
              className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
              style={{ background: "radial-gradient(circle at 35% 35%, #f87171, #dc2626)" }}
            >
              <span className="text-white text-xl select-none">♡</span>
            </motion.div>
          </div>

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

          <PhotoFrame src="/images/IMG_0547.jpeg" caption="ここにキャプションを入れてね" alt="思い出の写真1" rotation={2} />
          <PhotoFrame src="/images/IMG_0621.jpeg" caption="大好きな瞬間" alt="思い出の写真2" rotation={-2} />
          <PhotoFrame src="/images/IMG_0861.jpeg" caption="一緒にいると楽しいね" alt="思い出の写真3" rotation={1.5} />

          {/* 本文 */}
          <div className="space-y-5 text-[#4A3F35] leading-loose font-light text-[0.97rem]" style={{ fontFamily: "var(--font-serif)" }}>
            <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              久しぶり。元気にしてる？そろそろテストで忙しい時期やんな。あんまり無理しすぎんなよ。
            </motion.p>

            <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}>
              まず最初に、ほんまにごめん。この前のことは、感情的になって思ってもないようなことまでぶつけてしまった。Beckyを悲しませて、嫌な思いをさせて、本当に最低やったと思ってる。申し訳なかった。
            </motion.p>

            <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
              あの時、なんであんな態度になったんか自分なりに考えたんやけど、正直に言うわ。俺、今の自分がBeckyに何もしてあげられてないことが、ずっと悔しくてたまらんかってん。周りのすごい人たちと比べて、自分がBeckyに同じことをしてあげられてない情けなさが、あの時「悔しさ」として爆発してしまった。Beckyに当たってしまったけど、ほんまは自分に対する情けなさが原因やった。ごめんな。
            </motion.p>
          </div>

          <LoveReasons />

          <Divider symbol="❀" />

          <PhotoFrame src="/images/IMG_4250.JPG" caption="この笑顔が好き" alt="思い出の写真4" rotation={-1.5} />
          <PhotoFrame src="/images/IMG_2954.PNG" caption="ずっと覚えてる" alt="思い出の写真5" rotation={2.5} />
          <PhotoFrame src="/images/IMG_3556.PNG" caption="あなたといる時間" alt="思い出の写真6" rotation={-2} />

          <div className="space-y-5 text-[#4A3F35] leading-loose font-light text-[0.97rem]" style={{ fontFamily: "var(--font-serif)" }}>
            <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
              それと、俺にお金がないことを打ち明けた時、Beckyにとっても正直受け入れ難いことはあったと思う。それでも一緒にいてくれるBeckyを早く助けたい、喜ばせたいっていう一心で、自分の余裕がないのに無理をして動いてしまった。その結果、自分自身の「軸」を見失って、Beckyが一番望んでいない「感情的にぶつかること」をしてしまった。本当に申し訳ない。
            </motion.p>

            <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}>
              この数日間、Beckyと話せない時間の中でずっと考えてた。これまでの俺は、あまりにも「お金」という目に見えるものにフォーカスしすぎていた。もちろんお金は大事やけど、もっと大切なものは目には見えないところにあるってことに、ようやく気づいたんよ。相手の気持ちを尊重することや、俺を支えてくれているBeckyの存在。そういう、一番近くにある大切なものを、自分の余裕のなさのせいで失ってしまうのが一番怖いことやと気づいた。
            </motion.p>

            <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.15 }}>
              俺は、一人の女性として尊敬できるBeckyを、これからもずっと大切にしたい。
            </motion.p>

            <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}>
              もちろん、今二人の問題になってるお金のことは俺が必ず解決する。普通じゃない、めちゃくちゃ良い生活を絶対にさせてあげる。その自信も確信も、今の俺にはある。Beckyが不安になる気持ちは十分すぎるくらいわかってる。でもな、俺はその不安なんてどうでもよくなるくらい成功できるって信じてるし、実際にできるって確信してる。
            </motion.p>

            <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.25 }}>
              これからは、ただ結果を追い求めるだけじゃなくて、Beckyの心に寄り添って、穏やかに、二人で支え合っていける関係を築いていきたい。
            </motion.p>

            <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}>
              こんな情けないところも見せてしまったけど、やっぱり俺の隣にいてほしいのはBeckyしかおらへん。その気持ちは、留学中も今も、ずっと変わってない。Beckyを愛してるからこそ、俺を信じてついてきてほしい。絶対に後悔はさせへん。絶対に。
            </motion.p>

            <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.35 }}>
              改めて、ほんまにごめんな。いつもありがとう。心から、愛してる。
            </motion.p>
          </div>

          <Divider />

          <div className="text-right">
            <p className="text-[#9B8874] text-sm font-light mb-1 tracking-widest">愛をこめて</p>
            <p className="text-[#3C3830] text-xl tracking-wider" style={{ fontFamily: "var(--font-serif)" }}>
              Rioより
            </p>
            <motion.p
              className="text-rose-400 text-base mt-2 tracking-widest"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              ♡ ♡ ♡
            </motion.p>
          </div>

          {/* Quiz button */}
          <motion.div
            className="flex justify-center mt-10"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={onQuiz}
              className="flex items-center gap-2 px-7 py-3.5 rounded-full text-white text-sm tracking-widest shadow-lg"
              style={{ background: "linear-gradient(135deg, #f87171, #ec4899)" }}
            >
              <span>🎴</span>
              <span>思い出クイズに挑戦する</span>
            </motion.button>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-[3px]" style={{ background: "linear-gradient(90deg, transparent, #fca5a5, #f9a8a8, transparent)" }} />
      </div>
    </motion.div>
  );
}

// ============================================================
// MAIN APP
// ============================================================
export default function Home() {
  const [phase, setPhase] = useState<"envelope" | "letter" | "quiz">("envelope");
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
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <FloatingParticles particles={particles} />
      </div>
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(254,205,211,0.18) 0%, transparent 70%)",
          zIndex: 0,
        }}
      />
      <div className="relative" style={{ zIndex: 1 }}>
        <AnimatePresence mode="wait">
          {phase === "envelope" && (
            <motion.div key="envelope" className="min-h-screen flex flex-col items-center justify-center px-4">
              <EnvelopeScreen onOpen={() => setPhase("letter")} />
            </motion.div>
          )}
          {phase === "letter" && (
            <motion.div key="letter" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <LetterPage onQuiz={() => setPhase("quiz")} />
            </motion.div>
          )}
          {phase === "quiz" && (
            <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <QuizScreen onBack={() => setPhase("letter")} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
