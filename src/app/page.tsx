'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { MessageCircle, Truck, ShieldCheck, Leaf, Sparkles, ChevronDown, Star, CheckCircle2, ArrowRight, Phone, Zap, Heart, Clock } from 'lucide-react'

/* ─────────────────────────────────────────────
   CONSTANTS
   ───────────────────────────────────────────── */
const WHATSAPP_NUMBER = '573001234567' // Replace with real number
const WHATSAPP_MESSAGE = encodeURIComponent('Hola! Quiero aprovechar la promo Paga 2 Lleva 3 de ColiPlus 💚')
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`

const INGREDIENTS = [
  {
    id: 'noni',
    name: 'Noni',
    subtitle: 'Desintoxicación Natural',
    description: 'Poderoso antioxidante que purifica tu organismo desde adentro. Elimina toxinas y fortalece tu sistema inmunológico de forma natural.',
    icon: '/noni-icon.webp',
    benefits: ['Purifica el organismo', 'Fortalece defensas', 'Combate inflamación'],
    accent: 'from-emerald-400 to-green-500',
  },
  {
    id: 'linaza',
    name: 'Linaza',
    subtitle: 'Fibra Digestiva Premium',
    description: 'Rica en omega-3 y fibra soluble que regula tu tránsito intestinal y te ayuda a sentirte ligero cada día.',
    icon: '/linaza-icon.webp',
    benefits: ['Regula tránsito intestinal', 'Reduce hinchazón', 'Omega-3 natural'],
    accent: 'from-amber-400 to-yellow-500',
  },
  {
    id: 'espirulina',
    name: 'Espirulina',
    subtitle: 'Superfood Energizante',
    description: 'El superalimento más completo del planeta. Cargado de proteínas, vitaminas y minerales que revitalizan tu cuerpo entero.',
    icon: '/espirulina-icon.webp',
    benefits: ['Energía sostenida', 'Proteína completa', 'Repara tejidos'],
    accent: 'from-teal-400 to-cyan-500',
  },
]

/* ─────────────────────────────────────────────
   HOOK: Optimized scroll with rAF
   ───────────────────────────────────────────── */
function useScrollProgress() {
  const [progress, setProgress] = useState(0)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        const scrollTop = window.scrollY
        const docHeight = document.documentElement.scrollHeight - window.innerHeight
        setProgress(docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0)
      })
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return progress
}

/* ─────────────────────────────────────────────
   HOOK: Intersection Observer
   ───────────────────────────────────────────── */
function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold, rootMargin: '0px 0px -50px 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])

  return { ref, inView }
}

/* ─────────────────────────────────────────────
   COMPONENT: Floating Product (Scroll-reactive)
   ───────────────────────────────────────────── */
function FloatingProduct({ scrollProgress }: { scrollProgress: number }) {
  const [windowWidth, setWindowWidth] = useState(1024)

  useEffect(() => {
    const update = () => setWindowWidth(window.innerWidth)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const isMobile = windowWidth < 768

  // Desktop: product moves from center to right
  // Mobile: product moves up and shrinks
  const x = isMobile ? 0 : scrollProgress * 200
  const scale = isMobile
    ? 1 - scrollProgress * 0.35
    : 1 - scrollProgress * 0.25
  const opacity = Math.max(1 - scrollProgress * 1.5, 0)

  return (
    <motion.div
      id="producto-interactivo"
      className="pointer-events-none select-none relative"
      style={{
        x,
        scale: Math.max(scale, 0.3),
        opacity,
      }}
      animate={{ y: [0, -14, 0] }}
      transition={{
        y: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' },
        x: { duration: 0 },
        scale: { duration: 0 },
        opacity: { duration: 0 },
      }}
    >
      {/* Multi-layer glow effect */}
      <div className="absolute inset-0 rounded-full bg-[#39FF14]/5 blur-[60px] scale-150" />
      <div className="absolute inset-0 rounded-full bg-[#39FF14]/10 blur-[30px] scale-125" />
      {/* Rotating ring */}
      <div className="absolute inset-[-20px] rounded-full border border-[#39FF14]/10 animate-[spin_20s_linear_infinite]" />
      <div className="absolute inset-[-40px] rounded-full border border-dashed border-[#39FF14]/5 animate-[spin_30s_linear_infinite_reverse]" />
      {/* Product image */}
      <img
        src="/coliplus.webp"
        alt="ColiPlus - Suplemento de bienestar natural con Noni, Linaza y Espirulina"
        className="relative z-10 w-[220px] h-[220px] sm:w-[280px] sm:h-[280px] md:w-[340px] md:h-[340px] lg:w-[400px] lg:h-[400px] object-contain drop-shadow-[0_0_60px_rgba(57,255,20,0.25)]"
        loading="eager"
      />
    </motion.div>
  )
}

/* ─────────────────────────────────────────────
   COMPONENT: Ingredient Card
   ───────────────────────────────────────────── */
function IngredientCard({ ingredient, index }: { ingredient: typeof INGREDIENTS[0]; index: number }) {
  const { ref, inView } = useInView(0.1)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60, filter: 'blur(20px)' }}
      animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.8, delay: index * 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group relative bg-gradient-to-b from-white/[0.06] to-white/[0.01] backdrop-blur-sm border border-white/10 rounded-3xl p-7 md:p-8 hover:border-[#39FF14]/30 transition-all duration-500 hover:shadow-[0_0_40px_rgba(57,255,20,0.06)]"
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-[2px] bg-gradient-to-r from-transparent via-[#39FF14] to-transparent opacity-60" />

      {/* Hover glow */}
      <div className="absolute inset-0 rounded-3xl bg-[#39FF14]/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Icon */}
      <div className="relative w-20 h-20 md:w-24 md:h-24 mx-auto mb-6">
        <div className="absolute inset-0 rounded-full bg-[#39FF14]/5 group-hover:bg-[#39FF14]/10 transition-colors duration-500" />
        <div className="absolute inset-2 rounded-full bg-[#39FF14]/5 blur-md" />
        <img
          src={ingredient.icon}
          alt={ingredient.name}
          className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_20px_rgba(57,255,20,0.25)] group-hover:drop-shadow-[0_0_30px_rgba(57,255,20,0.4)] transition-all duration-500"
          loading="lazy"
        />
      </div>

      {/* Text */}
      <div className="text-center relative z-10">
        <span className="text-[#39FF14] text-[11px] font-bold tracking-[0.25em] uppercase">
          {ingredient.subtitle}
        </span>
        <h3 className="text-2xl md:text-3xl font-bold text-white mt-2 mb-3">
          {ingredient.name}
        </h3>
        <p className="text-white/50 text-sm md:text-base leading-relaxed mb-5">
          {ingredient.description}
        </p>
        <ul className="space-y-2.5">
          {ingredient.benefits.map((b, i) => (
            <li key={i} className="flex items-center justify-center gap-2 text-white/70 text-sm">
              <CheckCircle2 className="w-4 h-4 text-[#39FF14] flex-shrink-0" />
              {b}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────
   COMPONENT: Glow Button (CTA)
   ───────────────────────────────────────────── */
function GlowButton({
  children,
  onClick,
  className = '',
  size = 'lg',
}: {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  size?: 'md' | 'lg'
}) {
  return (
    <motion.button
      onClick={onClick}
      className={`
        relative inline-flex items-center justify-center gap-2.5 font-bold rounded-full
        bg-gradient-to-r from-[#39FF14] to-[#2bcc10] text-black
        overflow-hidden group cursor-pointer
        ${size === 'lg' ? 'px-8 py-4 text-base md:text-lg' : 'px-6 py-3 text-sm md:text-base'}
        ${className}
      `}
      whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(57,255,20,0.3)' }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      {/* Shine sweep */}
      <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12" />
      {/* Dopamine glow */}
      <span className="absolute -inset-1 bg-[#39FF14]/25 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <span className="relative z-10 flex items-center gap-2.5">
        {children}
      </span>
    </motion.button>
  )
}

/* ─────────────────────────────────────────────
   COMPONENT: Floating WhatsApp CTA
   ───────────────────────────────────────────── */
function FloatingWhatsApp() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 md:w-16 md:h-16 bg-[#25D366] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(37,211,102,0.5)] hover:shadow-[0_0_45px_rgba(37,211,102,0.7)] transition-shadow duration-300 cursor-pointer"
          aria-label="Contactar por WhatsApp"
        >
          <MessageCircle className="w-6 h-6 md:w-7 md:h-7 text-white" fill="white" />
          {/* Pulse ring */}
          <span className="absolute inset-0 rounded-full bg-[#25D366]/30 animate-ping" />
        </motion.a>
      )}
    </AnimatePresence>
  )
}

/* ─────────────────────────────────────────────
   COMPONENT: Section Divider
   ───────────────────────────────────────────── */
function SectionDivider() {
  return (
    <div className="w-full flex items-center justify-center py-8 md:py-12">
      <div className="h-px w-24 md:w-36 bg-gradient-to-r from-transparent via-[#39FF14]/30 to-transparent" />
      <div className="mx-3 w-1.5 h-1.5 rounded-full bg-[#39FF14]/40" />
      <div className="h-px w-24 md:w-36 bg-gradient-to-r from-transparent via-[#39FF14]/30 to-transparent" />
    </div>
  )
}

/* ─────────────────────────────────────────────
   COMPONENT: Animated Counter
   ───────────────────────────────────────────── */
function AnimatedCounter({ target, prefix = '', suffix = '' }: { target: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0)
  const { ref, inView } = useInView(0.3)

  useEffect(() => {
    if (!inView) return
    let start = 0
    const duration = 2000
    const startTime = performance.now()

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
      start = Math.floor(eased * target)
      setCount(start)
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [inView, target])

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>
}

/* ─────────────────────────────────────────────
   MAIN PAGE
   ───────────────────────────────────────────── */
export default function Home() {
  const scrollProgress = useScrollProgress()
  const heroRef = useRef<HTMLDivElement>(null)

  const heroSectionScroll = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const productOpacity = useTransform(heroSectionScroll.scrollYProgress, [0, 0.85], [1, 0])

  const openWhatsApp = useCallback(() => {
    window.open(WHATSAPP_URL, '_blank', 'noopener,noreferrer')
  }, [])

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* ═══════════════════════════════════════
          HERO SECTION (PAS - Attention)
          ═══════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-screen overflow-hidden"
      >
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="/hero-bg.webp"
            alt=""
            className="w-full h-full object-cover opacity-30"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black" />
        </div>

        {/* Radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#39FF14]/[0.03] rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-emerald-500/[0.02] rounded-full blur-[100px] pointer-events-none" />

        {/* Main content: split layout on desktop, stacked on mobile */}
        <div className="relative z-10 min-h-screen flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-4 lg:gap-0 px-4 md:px-8 lg:px-16 pt-20 md:pt-24 pb-12">

          {/* Left: Text content */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-xl lg:max-w-2xl">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#39FF14]/20 bg-[#39FF14]/5 mb-5 md:mb-6"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#39FF14]" />
              <span className="text-[#39FF14] text-xs md:text-sm font-medium tracking-wide">
                100% Natural · Vegano · Sin Gluten
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight"
            >
              <span className="block">Tu cuerpo merece</span>
              <span className="block bg-gradient-to-r from-[#39FF14] via-[#5fff47] to-[#39FF14] bg-clip-text text-transparent bg-[length:200%_auto] animate-[shimmer_3s_linear_infinite]">
                sentirse libre.
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="mt-3 md:mt-5 text-base md:text-lg text-white/45 leading-relaxed"
            >
              Desintoxica tu colon, reduce la inflamación y recupera tu energía con el poder de{' '}
              <span className="text-[#39FF14] font-semibold">Noni</span>,{' '}
              <span className="text-[#39FF14] font-semibold">Linaza</span> y{' '}
              <span className="text-[#39FF14] font-semibold">Espirulina</span>.
            </motion.p>

            {/* Hero CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="mt-5 md:mt-7 flex flex-col items-center lg:items-start gap-3"
            >
              <GlowButton onClick={openWhatsApp}>
                <MessageCircle className="w-5 h-5" />
                Quiero mi promo 2x3
                <ArrowRight className="w-4 h-4" />
              </GlowButton>
              <span className="text-white/20 text-xs">Envío gratis · Pago contra entrega</span>
            </motion.div>
          </div>

          {/* Right: Floating Product */}
          <motion.div style={{ opacity: productOpacity }} className="relative flex-shrink-0">
            <FloatingProduct scrollProgress={scrollProgress} />
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        >
          <span className="text-white/15 text-[10px] tracking-[0.3em] uppercase">Descubre más</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown className="w-4 h-4 text-[#39FF14]/30" />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════
          PROBLEM SECTION (PAS - Problem)
          ═══════════════════════════════════════ */}
      <ProblemSection />

      <SectionDivider />

      {/* ═══════════════════════════════════════
          INGREDIENTS SECTION (PAS - Solution)
          ═══════════════════════════════════════ */}
      <IngredientsSection />

      <SectionDivider />

      {/* ═══════════════════════════════════════
          HOW IT WORKS SECTION
          ═══════════════════════════════════════ */}
      <HowItWorksSection />

      <SectionDivider />

      {/* ═══════════════════════════════════════
          OFFER SECTION
          ═══════════════════════════════════════ */}
      <OfferSection openWhatsApp={openWhatsApp} />

      <SectionDivider />

      {/* ═══════════════════════════════════════
          TESTIMONIALS SECTION
          ═══════════════════════════════════════ */}
      <TestimonialsSection />

      <SectionDivider />

      {/* ═══════════════════════════════════════
          FINAL CTA SECTION
          ═══════════════════════════════════════ */}
      <FinalCTASection openWhatsApp={openWhatsApp} />

      {/* Footer */}
      <footer className="bg-black border-t border-white/5 py-10 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Leaf className="w-5 h-5 text-[#39FF14]" />
            <span className="text-white font-bold text-lg">ColiPlus</span>
          </div>
          <p className="text-white/25 text-xs md:text-sm mb-2">
            Suplemento natural con Noni, Linaza y Espirulina · 450g · Sabor Manzana Verde
          </p>
          <p className="text-white/20 text-xs">
            © {new Date().getFullYear()} ColiPlus · Todos los derechos reservados
          </p>
          <p className="text-white/15 text-[10px] mt-1">
            Este producto no está diseñado para diagnosticar, tratar, curar o prevenir ninguna enfermedad. Consulte a su médico antes de usar.
          </p>
        </div>
      </footer>

      {/* Floating WhatsApp */}
      <FloatingWhatsApp />
    </div>
  )
}

/* ─────────────────────────────────────────────
   PROBLEM SECTION (PAS Methodology - Problem)
   ───────────────────────────────────────────── */
function ProblemSection() {
  const { ref, inView } = useInView(0.05)

  return (
    <section ref={ref} className="relative py-20 md:py-28 px-4">
      {/* Background accent */}
      <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-red-500/[0.03] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center">
        <motion.span
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="inline-block text-red-400/80 text-xs font-bold tracking-[0.25em] uppercase mb-4"
        >
          ¿Te suena familiar?
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4"
        >
          Esa sensación de{' '}
          <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
            pesadez
          </span>{' '}
          no es normal.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-white/40 text-sm md:text-base max-w-xl mx-auto mb-12"
        >
          Miles de personas viven con molestias que creen normales. Tu cuerpo está pidiendo ayuda.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {[
            {
              icon: '😣',
              title: 'Inflamación constante',
              desc: 'Te levantas hinchado y terminas el día peor. Tu ropa ya no te queda igual.',
              accent: 'from-red-500/20 to-orange-500/20',
            },
            {
              icon: '😫',
              title: 'Digestión lenta',
              desc: 'Sientes que todo se queda estancado. Gases y molestias que no te dejan en paz.',
              accent: 'from-orange-500/20 to-yellow-500/20',
            },
            {
              icon: '😩',
              title: 'Sin energía',
              desc: 'Tu cuerpo no absorbe nutrientes. Te sientes agotado sin motivo aparente.',
              accent: 'from-yellow-500/20 to-amber-500/20',
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
              animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
              transition={{ duration: 0.6, delay: 0.4 + i * 0.15 }}
              className={`relative bg-gradient-to-b ${item.accent} to-transparent border border-white/[0.06] rounded-2xl p-6 hover:border-white/10 transition-colors duration-300`}
            >
              <span className="text-3xl block mb-3">{item.emoji}</span>
              <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-white/45 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-10 text-white/35 text-sm md:text-base max-w-2xl mx-auto"
        >
          La alimentación moderna y el estrés acumulan toxinas en tu colon que tu cuerpo no puede eliminar solo.{' '}
          <span className="text-white/70 font-semibold">Hasta ahora.</span>
        </motion.p>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   INGREDIENTS SECTION (PAS - Solution)
   ───────────────────────────────────────────── */
function IngredientsSection() {
  const { ref, inView } = useInView(0.05)

  return (
    <section ref={ref} className="relative py-20 md:py-28 px-4">
      {/* Background glow */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#39FF14]/[0.02] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-emerald-500/[0.02] rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-14 md:mb-18">
          <motion.span
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-block text-[#39FF14] text-xs font-bold tracking-[0.25em] uppercase mb-4"
          >
            La fórmula
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight"
          >
            3 superpoderes,{' '}
            <span className="bg-gradient-to-r from-[#39FF14] to-[#5fff47] bg-clip-text text-transparent">
              1 solución.
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-3 text-white/35 text-sm md:text-base max-w-lg mx-auto"
          >
            Cada ingrediente fue seleccionado por su poder comprobado. Juntos, son imparables.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {INGREDIENTS.map((ingredient, i) => (
            <IngredientCard key={ingredient.id} ingredient={ingredient} index={i} />
          ))}
        </div>

        {/* Natural badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="mt-12 md:mt-16 flex flex-wrap items-center justify-center gap-6 md:gap-10"
        >
          {[
            { icon: Leaf, label: '100% Natural' },
            { icon: ShieldCheck, label: 'Sin Gluten' },
            { icon: Sparkles, label: 'Producto Vegano' },
            { icon: Heart, label: 'Sin Lactosa' },
          ].map((badge, i) => (
            <div key={i} className="flex items-center gap-2 text-white/30 text-sm">
              <badge.icon className="w-4 h-4 text-[#39FF14]/50" />
              <span>{badge.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   HOW IT WORKS SECTION
   ───────────────────────────────────────────── */
function HowItWorksSection() {
  const { ref, inView } = useInView(0.1)

  const steps = [
    {
      num: '01',
      title: 'Mezcla',
      desc: 'Agrega 1 cucharada (18g) en un vaso de agua o jugo. Sabor a deliciosa manzana verde.',
      icon: '🥤',
    },
    {
      num: '02',
      title: 'Bebe',
      desc: 'Tómalo en ayunas o antes de dormir. La fibra actúa desde el primer vaso.',
      icon: '💧',
    },
    {
      num: '03',
      title: 'Transforma',
      desc: 'En 7-14 días sientes la diferencia: menos inflamación, más energía, mejor digestión.',
      icon: '⚡',
    },
  ]

  return (
    <section ref={ref} className="relative py-20 md:py-28 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <motion.span
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-block text-[#39FF14] text-xs font-bold tracking-[0.25em] uppercase mb-4"
          >
            Simple y efectivo
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-5xl font-extrabold"
          >
            Así es como{' '}
            <span className="bg-gradient-to-r from-[#39FF14] to-[#5fff47] bg-clip-text text-transparent">
              funciona
            </span>
          </motion.h2>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#39FF14]/10 to-transparent" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 + i * 0.2 }}
                className="relative text-center"
              >
                {/* Step number */}
                <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6">
                  <div className="absolute inset-0 rounded-full border border-[#39FF14]/20" />
                  <div className="absolute inset-2 rounded-full bg-[#39FF14]/5" />
                  <span className="text-2xl">{step.icon}</span>
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-[#39FF14] rounded-full text-black text-[10px] font-black flex items-center justify-center">
                    {step.num}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed max-w-[250px] mx-auto">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   OFFER SECTION (PAS - Solution/Agitation)
   ───────────────────────────────────────────── */
function OfferSection({ openWhatsApp }: { openWhatsApp: () => void }) {
  const { ref, inView } = useInView(0.1)

  return (
    <section ref={ref} className="relative py-20 md:py-32 px-4 overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#39FF14]/[0.025] rounded-full blur-[160px] pointer-events-none" />

      <div className="relative max-w-4xl mx-auto text-center">
        <motion.span
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="inline-block text-[#39FF14] text-xs font-bold tracking-[0.25em] uppercase mb-4"
        >
          🔥 Oferta exclusiva
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight"
        >
          Paga 2 Lleva 3
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mt-2 text-white/40 text-sm md:text-base"
        >
          3 tarros de ColiPlus de 450g cada uno · Sabor Manzana Verde
        </motion.p>

        {/* Price */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 md:mt-10"
        >
          <div className="inline-flex flex-col items-center gap-1">
            <span className="text-white/30 text-base md:text-lg line-through">$227.400 COP</span>
            <div className="relative">
              <span className="text-5xl md:text-7xl lg:text-[5.5rem] font-black bg-gradient-to-r from-[#39FF14] via-[#5fff47] to-[#39FF14] bg-clip-text text-transparent">
                $151.800
              </span>
              {/* Glow behind price */}
              <div className="absolute inset-0 bg-[#39FF14]/10 blur-[40px] rounded-full -z-10" />
            </div>
            <span className="text-white/40 text-sm md:text-base">COP por 3 tarros</span>
          </div>
          <div className="mt-4">
            <span className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#39FF14]/10 border border-[#39FF14]/20 text-[#39FF14] text-sm font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              Cada unidad a solo $50.600 COP
            </span>
          </div>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10 md:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6"
        >
          {[
            { icon: Truck, label: 'Envío Gratis', sub: 'A toda Colombia' },
            { icon: ShieldCheck, label: 'Pago Contra Entrega', sub: 'Paga cuando recibas' },
            { icon: Star, label: '+5.000 Clientes', sub: 'Satisfechos' },
          ].map((badge, i) => (
            <div
              key={i}
              className="flex items-center gap-3 bg-white/[0.03] rounded-2xl px-5 py-4 border border-white/[0.06] hover:border-[#39FF14]/15 transition-colors duration-300"
            >
              <div className="w-11 h-11 rounded-full bg-[#39FF14]/10 flex items-center justify-center flex-shrink-0">
                <badge.icon className="w-5 h-5 text-[#39FF14]" />
              </div>
              <div className="text-left">
                <p className="text-white text-sm font-semibold">{badge.label}</p>
                <p className="text-white/35 text-xs">{badge.sub}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-10 md:mt-14 flex flex-col items-center gap-3"
        >
          <GlowButton onClick={openWhatsApp} className="shadow-[0_0_50px_rgba(57,255,20,0.15)]">
            <MessageCircle className="w-5 h-5" />
            Quiero mi promo 2x3
            <ArrowRight className="w-4 h-4" />
          </GlowButton>
          <span className="text-white/20 text-xs">Sin pagos por adelantado · Recibe primero, paga después</span>
        </motion.div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   TESTIMONIALS SECTION
   ───────────────────────────────────────────── */
function TestimonialsSection() {
  const { ref, inView } = useInView(0.1)

  const testimonials = [
    {
      name: 'Carolina M.',
      location: 'Bogotá',
      text: 'Después de 2 semanas sentí la diferencia. Ya no me despierto hinchada y mi digestión es otra cosa. ¡Lo recomiendo 100%!',
      stars: 5,
      time: 'Hace 2 semanas',
    },
    {
      name: 'Andrés P.',
      location: 'Medellín',
      text: 'Pensé que era otro producto más, pero ColiPlus de verdad funciona. Llevo 3 meses y mi energía cambió por completo.',
      stars: 5,
      time: 'Hace 1 mes',
    },
    {
      name: 'Luz D.',
      location: 'Cali',
      text: 'El sabor es delicioso y se prepara en segundos. Lo tomo todas las mañanas y mi tránsito intestinal es perfecto ahora.',
      stars: 5,
      time: 'Hace 3 semanas',
    },
  ]

  return (
    <section ref={ref} className="relative py-20 md:py-28 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <motion.span
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-block text-[#39FF14] text-xs font-bold tracking-[0.25em] uppercase mb-4"
          >
            Resultados reales
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-5xl font-extrabold"
          >
            Lo que dicen{' '}
            <span className="bg-gradient-to-r from-[#39FF14] to-[#5fff47] bg-clip-text text-transparent">
              nuestros clientes
            </span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
              animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.15 }}
              className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 hover:border-[#39FF14]/15 transition-colors duration-300"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.stars }).map((_, si) => (
                  <Star key={si} className="w-4 h-4 text-[#39FF14] fill-[#39FF14]" />
                ))}
              </div>
              <p className="text-white/60 text-sm leading-relaxed mb-5">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-semibold text-sm">{t.name}</p>
                  <p className="text-white/30 text-xs">{t.location}</p>
                </div>
                <span className="text-white/15 text-[10px]">{t.time}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   FINAL CTA SECTION
   ───────────────────────────────────────────── */
function FinalCTASection({ openWhatsApp }: { openWhatsApp: () => void }) {
  const { ref, inView } = useInView(0.1)

  return (
    <section ref={ref} className="relative py-24 md:py-36 px-4 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-[#39FF14]/[0.04] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-[#39FF14]/[0.03] rounded-full blur-[100px]" />
      </div>

      {/* Particle dots */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-[#39FF14]/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animation: `pulse ${2 + Math.random() * 3}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-3xl mx-auto text-center">
        {/* Product mini */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <img
            src="/coliplus.webp"
            alt="ColiPlus"
            className="w-24 h-24 md:w-32 md:h-32 mx-auto object-contain drop-shadow-[0_0_30px_rgba(57,255,20,0.2)]"
          />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6"
        >
          Tu transformación{' '}
          <span className="bg-gradient-to-r from-[#39FF14] to-[#5fff47] bg-clip-text text-transparent">
            empieza hoy
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-white/40 text-base md:text-lg max-w-xl mx-auto mb-4"
        >
          No esperes un día más para sentirte bien. Paga 2 y llévate 3 tarros de ColiPlus con envío gratis a toda Colombia.
        </motion.p>

        {/* Price reminder */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-8"
        >
          <span className="text-2xl md:text-4xl font-black bg-gradient-to-r from-[#39FF14] to-[#5fff47] bg-clip-text text-transparent">
            $151.800
          </span>
          <span className="text-white/30 text-sm ml-2">COP · 3 tarros</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <GlowButton onClick={openWhatsApp} className="shadow-[0_0_60px_rgba(57,255,20,0.2)]">
            <MessageCircle className="w-5 h-5" />
            Pedir por WhatsApp
            <ArrowRight className="w-4 h-4" />
          </GlowButton>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 text-white/40 hover:text-white/70 text-sm transition-colors duration-300"
          >
            <Phone className="w-4 h-4" />
            O llámanos directamente
          </a>
        </motion.div>

        {/* Urgency + features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4 text-white/20 text-xs"
        >
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Promoción por tiempo limitado</span>
          <span className="flex items-center gap-1"><Truck className="w-3 h-3" /> Envío gratis</span>
          <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Pago contra entrega</span>
        </motion.div>
      </div>
    </section>
  )
}
