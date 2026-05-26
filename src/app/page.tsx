'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import {
  MessageCircle, Truck, ShieldCheck, Leaf, Sparkles, ChevronDown, Star,
  CheckCircle2, ArrowRight, Heart, Clock, CreditCard, Banknote,
  Wallet, Building2, Smartphone, Award, BadgeCheck, Flame, Users, TrendingUp,
  Gift, Zap, Volume2, VolumeX, RotateCcw, Play, ChevronUp
} from 'lucide-react'

/* ─────────────────────────────────────────────
   CONSTANTS
   ───────────────────────────────────────────── */
const WHATSAPP_NUMBER = '573214487903'
const WHATSAPP_GENERIC_MSG = encodeURIComponent('Hola! Quiero información sobre ColiPlus 💚')
const WHATSAPP_GENERIC_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_GENERIC_MSG}`

const KITS = [
  {
    id: 'basico',
    name: 'Kit Básico',
    qty: '1 Tarro',
    price: '$75.900',
    unitPrice: '$75.900 c/u',
    highlight: false,
    tag: null,
    msg: encodeURIComponent('Hola! Quiero comprar 1 Tarro de ColiPlus $75.900 💚'),
  },
  {
    id: 'duplo',
    name: 'Kit Recomendado',
    qty: '2 Tarros',
    price: '$113.850',
    unitPrice: '$56.925 c/u',
    highlight: true,
    tag: 'Más Vendido',
    savings: 'Ahorra 25%',
    msg: encodeURIComponent('Hola! Quiero el Kit Recomendado de 2 Tarros de ColiPlus $113.850 + Loción GRATIS 💚'),
  },
  {
    id: 'familiar',
    name: 'Kit Familiar',
    qty: '3 Tarros',
    price: '$151.800',
    unitPrice: '$50.600 c/u',
    highlight: false,
    tag: 'Mejor Precio',
    savings: 'Ahorra 33%',
    msg: encodeURIComponent('Hola! Quiero el Kit Familiar de 3 Tarros de ColiPlus $151.800 + Loción GRATIS 💚'),
  },
]

const PAIN_POINTS = [
  { icon: '😣', text: 'Abdomen abultado e hinchado al final del día' },
  { icon: '😫', text: 'Pesadez extrema después de cada comida' },
  { icon: '😩', text: 'Días enteros sin poder ir al baño' },
  { icon: '😤', text: 'Gases y molestias que no te dejan en paz' },
  { icon: '🥱', text: 'Sin energía, siempre cansado y pesado' },
  { icon: '😰', text: 'Ropa que ya no te queda por la inflamación' },
]

const ALL_INGREDIENTS = [
  { name: 'Noni', role: 'Desintoxicante y antioxidante' },
  { name: 'Linaza', role: 'Fibra soluble y omega-3' },
  { name: 'Espirulina', role: 'Proteína completa y vitaminas' },
  { name: 'Alcachofa', role: 'Depurativa hepática' },
  { name: 'Pitaya', role: 'Prebiótico y digestiva' },
  { name: 'Flor de Jamaica', role: 'Antiinflamatoria natural' },
  { name: 'Té Verde', role: 'Antioxidante y metabólico' },
  { name: 'Semillas de Chía', role: 'Fibra y saciedad' },
  { name: 'Stevia', role: 'Endulzante natural sin azúcar' },
]

const INGREDIENTS = [
  { id: 'noni', name: 'Noni', subtitle: 'Desintoxicación Natural', description: 'Poderoso antioxidante que purifica tu organismo desde adentro. Elimina toxinas, fortalece tu sistema inmunológico y combate la inflamación crónica.', icon: '/noni-icon.webp', benefits: ['Purifica el organismo', 'Fortalece defensas', 'Combate inflamación', 'Elimina toxinas'] },
  { id: 'linaza', name: 'Linaza', subtitle: 'Fibra Digestiva Premium', description: 'Rica en omega-3 y fibra soluble que regula tu tránsito intestinal, reduce la hinchazón abdominal y te ayuda a sentirte ligero cada día.', icon: '/linaza-icon.webp', benefits: ['Regula tránsito intestinal', 'Reduce hinchazón', 'Omega-3 natural', 'Mejora absorción'] },
  { id: 'espirulina', name: 'Espirulina', subtitle: 'Superfood Energizante', description: 'El superalimento más completo del planeta. Cargado de proteínas, vitaminas del complejo B y minerales esenciales que revitalizan tu cuerpo entero.', icon: '/espirulina-icon.webp', benefits: ['Energía sostenida', 'Proteína completa', 'Repara tejidos', 'Equilibra flora intestinal'] },
]

const PAYMENT_METHODS = [
  { icon: Banknote, label: 'Efectivo Contra Entrega', desc: 'Pagas al recibir' },
  { icon: CreditCard, label: 'Tarjeta Crédito/Débito', desc: 'Visa · Mastercard · AMEX' },
  { icon: Smartphone, label: 'Nequi · Daviplata', desc: 'Pago digital rápido' },
  { icon: Building2, label: 'PSE · Bancolombia', desc: 'Transferencia segura' },
  { icon: Wallet, label: 'Bre-B', desc: 'Pago digital seguro' },
  { icon: Banknote, label: 'Efecty · Baloto', desc: 'Pago en efectivo' },
]

const FAQ_ITEMS = [
  { q: '¿Cómo se toma ColiPlus?', a: 'Mezcla 1 cucharada (18g) en un vaso de agua o jugo. Sabor delicioso a manzana verde, sin azúcar añadida. Tómalo en ayunas o antes de dormir para mejores resultados.' },
  { q: '¿Cuánto tiempo tarda en hacer efecto?', a: 'La mayoría de clientes sienten la diferencia en los primeros 7-14 días: menos inflamación, mejor tránsito intestinal y más energía. Los resultados se potencian con el uso continuo.' },
  { q: '¿Tiene efectos secundarios o contraindicaciones?', a: 'ColiPlus es 100% natural, con Registro INVIMA. No contiene laxantes agresivos ni químicos. Es sin gluten, sin lactosa y vegano. Si tienes condiciones médicas preexistentes, consulta a tu médico.' },
  { q: '¿Cómo funciona el pago contra entrega?', a: 'Pides por WhatsApp, recibes el producto en la puerta de tu casa y pagas al momento de la entrega. Sin pagos por adelantado, sin riesgo. También puedes pagar con Nequi, PSE, Bancolombia, tarjeta o Efecty.' },
  { q: '¿Cuánto tarda el envío?', a: 'Envío gratis a toda Colombia. Llega entre 2-5 días hábiles dependiendo de tu ciudad. Te enviamos el número de guía para que puedas rastrear tu pedido en todo momento.' },
  { q: '¿Qué es la Loción Termoactiva que incluyen gratis?', a: 'Es un obsequio exclusivo de ColiPlus: Loción Termoactiva Allpa Natural (18ml). Analgésico y antiinflamatorio tópico con Árnica, Castaño de Indias y Caléndula. Ideal para dolores musculares, calambres y contracturas.' },
]

/* ─────────────────────────────────────────────
   HOOKS
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
    return () => { window.removeEventListener('scroll', handleScroll); if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [])
  return progress
}

function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setInView(true) }, { threshold, rootMargin: '0px 0px -50px 0px' })
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

/* ─────────────────────────────────────────────
   COMPONENTS
   ───────────────────────────────────────────── */
function FloatingProduct({ scrollProgress }: { scrollProgress: number }) {
  const [windowWidth, setWindowWidth] = useState(1024)
  useEffect(() => { const u = () => setWindowWidth(window.innerWidth); u(); window.addEventListener('resize', u); return () => window.removeEventListener('resize', u) }, [])
  const isMobile = windowWidth < 768
  const x = isMobile ? 0 : scrollProgress * 200
  const scale = isMobile ? 1 - scrollProgress * 0.35 : 1 - scrollProgress * 0.25
  const opacity = Math.max(1 - scrollProgress * 1.5, 0)
  return (
    <motion.div className="pointer-events-none select-none relative" style={{ x, scale: Math.max(scale, 0.3), opacity }} animate={{ y: [0, -14, 0] }} transition={{ y: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' }, x: { duration: 0 }, scale: { duration: 0 }, opacity: { duration: 0 } }}>
      <div className="absolute inset-0 rounded-full bg-[#39FF14]/5 blur-[60px] scale-150" />
      <div className="absolute inset-0 rounded-full bg-[#39FF14]/10 blur-[30px] scale-125" />
      <img src="/coliplus.webp" alt="ColiPlus - Suplemento natural para desintoxicar el colon" className="relative z-10 w-[220px] h-[220px] sm:w-[280px] sm:h-[280px] md:w-[340px] md:h-[340px] lg:w-[400px] lg:h-[400px] object-contain drop-shadow-[0_0_60px_rgba(57,255,20,0.25)]" loading="eager" />
    </motion.div>
  )
}

function IngredientCard({ ingredient, index }: { ingredient: typeof INGREDIENTS[0]; index: number }) {
  const { ref, inView } = useInView(0.1)
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 60, filter: 'blur(20px)' }} animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}} transition={{ duration: 0.8, delay: index * 0.2, ease: [0.25, 0.46, 0.45, 0.94] }} className="group relative bg-gradient-to-b from-white/[0.06] to-white/[0.01] backdrop-blur-sm border border-white/10 rounded-3xl p-7 md:p-8 hover:border-[#39FF14]/30 transition-all duration-500 hover:shadow-[0_0_40px_rgba(57,255,20,0.06)]">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-[2px] bg-gradient-to-r from-transparent via-[#39FF14] to-transparent opacity-60" />
      <div className="absolute inset-0 rounded-3xl bg-[#39FF14]/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative w-20 h-20 md:w-24 md:h-24 mx-auto mb-6">
        <div className="absolute inset-0 rounded-full bg-[#39FF14]/5 group-hover:bg-[#39FF14]/10 transition-colors duration-500" />
        <img src={ingredient.icon} alt={ingredient.name} className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_20px_rgba(57,255,20,0.25)]" loading="lazy" />
      </div>
      <div className="text-center relative z-10">
        <span className="text-[#39FF14] text-[11px] font-bold tracking-[0.25em] uppercase">{ingredient.subtitle}</span>
        <h3 className="text-2xl md:text-3xl font-bold text-white mt-2 mb-3">{ingredient.name}</h3>
        <p className="text-white/50 text-sm md:text-base leading-relaxed mb-5">{ingredient.description}</p>
        <ul className="space-y-2.5">
          {ingredient.benefits.map((b, i) => (
            <li key={i} className="flex items-center justify-center gap-2 text-white/70 text-sm">
              <CheckCircle2 className="w-4 h-4 text-[#39FF14] flex-shrink-0" />{b}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}

function GlowButton({ children, href, onClick, className = '', size = 'lg' }: { children: React.ReactNode; href?: string; onClick?: () => void; className?: string; size?: 'md' | 'lg' }) {
  const Tag = href ? 'a' : 'button'
  return (
    <Tag href={href} onClick={onClick} target={href ? '_blank' : undefined} rel={href ? 'noopener noreferrer' : undefined} className={`relative inline-flex items-center justify-center gap-2.5 font-bold rounded-full bg-gradient-to-r from-[#39FF14] to-[#2bcc10] text-black overflow-hidden group cursor-pointer ${size === 'lg' ? 'px-8 py-4 text-base md:text-lg' : 'px-6 py-3 text-sm md:text-base'} ${className}`} style={{ minHeight: size === 'lg' ? '56px' : '44px' }}>
      <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12" />
      <span className="absolute -inset-1 bg-[#39FF14]/25 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <span className="relative z-10 flex items-center gap-2.5">{children}</span>
    </Tag>
  )
}

function FloatingWhatsApp() {
  const [visible, setVisible] = useState(false)
  useEffect(() => { const h = () => setVisible(window.scrollY > 300); window.addEventListener('scroll', h, { passive: true }); return () => window.removeEventListener('scroll', h) }, [])
  return (
    <AnimatePresence>{visible && (
      <motion.a href={WHATSAPP_GENERIC_URL} target="_blank" rel="noopener noreferrer" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} className="fixed bottom-6 right-6 z-50 w-14 h-14 md:w-16 md:h-16 bg-[#25D366] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(37,211,102,0.5)] hover:shadow-[0_0_45px_rgba(37,211,102,0.7)] transition-shadow duration-300 cursor-pointer" aria-label="Contactar por WhatsApp">
        <MessageCircle className="w-6 h-6 md:w-7 md:h-7 text-white" fill="white" />
        <span className="absolute inset-0 rounded-full bg-[#25D366]/30 animate-ping" />
      </motion.a>
    )}</AnimatePresence>
  )
}

function SectionDivider() {
  return (<div className="w-full flex items-center justify-center py-8 md:py-10"><div className="h-px w-24 md:w-36 bg-gradient-to-r from-transparent via-[#39FF14]/30 to-transparent" /><div className="mx-3 w-1.5 h-1.5 rounded-full bg-[#39FF14]/40" /><div className="h-px w-24 md:w-36 bg-gradient-to-r from-transparent via-[#39FF14]/30 to-transparent" /></div>)
}

/* ─────────────────────────────────────────────
   REUSABLE VIDEO PLAYER — Always playing, never black
   ───────────────────────────────────────────── */
function VideoPlayer({ src, label, heading, headingHighlight, accent = 'green', variant = 'default' }: { src: string; label: string; heading: string; headingHighlight: string; accent?: 'green' | 'warm'; variant?: 'default' | 'personal' }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMuted, setIsMuted] = useState(true)
  const [showSoundBtn, setShowSoundBtn] = useState(true)
  const [isEnded, setIsEnded] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [hasActivatedAudio, setHasActivatedAudio] = useState(false)

  // IntersectionObserver: auto-play when in view, pause when out
  useEffect(() => {
    const vid = videoRef.current; const el = containerRef.current
    if (!vid || !el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (vid.paused && !isEnded) {
          vid.muted = !hasActivatedAudio
          vid.playsInline = true
          vid.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false))
        }
      } else {
        if (!vid.paused) { vid.pause(); setIsPlaying(false) }
      }
    }, { threshold: 0.15 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [isEnded, hasActivatedAudio])

  // Mark ready when video can play
  const handleCanPlay = useCallback(() => { setIsReady(true) }, [])

  // Activate sound: restart from 0 with audio
  const activateSound = useCallback(() => {
    const vid = videoRef.current; if (!vid) return
    vid.muted = false; vid.currentTime = 0
    vid.play().then(() => {
      setIsMuted(false); setShowSoundBtn(false); setIsEnded(false); setIsPlaying(true); setHasActivatedAudio(true)
    }).catch(() => { vid.muted = true; setIsMuted(true) })
  }, [])

  // Tap on video: first tap = activate sound + restart, later taps = toggle pause/play
  const handleVideoTap = useCallback(() => {
    const vid = videoRef.current; if (!vid) return
    if (!hasActivatedAudio) {
      activateSound()
    } else if (vid.paused) {
      vid.play().then(() => setIsPlaying(true)).catch(() => {})
    } else {
      vid.pause(); setIsPlaying(false)
    }
  }, [hasActivatedAudio, activateSound])

  const handleReplay = useCallback(() => {
    const vid = videoRef.current; if (!vid) return
    vid.currentTime = 0; vid.play().then(() => { setIsEnded(false); setIsPlaying(true) }).catch(() => {})
  }, [])

  const handleEnded = useCallback(() => { setIsEnded(true); setIsPlaying(false) }, [])

  const isWarm = accent === 'warm'
  const isPersonal = variant === 'personal'
  const glowColor = isWarm ? 'rgba(245,158,11,0.06)' : 'rgba(57,255,20,0.06)'
  const btnFrom = isWarm ? '#f59e0b' : '#39FF14'
  const btnTo = isWarm ? '#d97706' : '#2bcc10'
  const glowShadow = isWarm ? 'rgba(245,158,11,' : 'rgba(57,255,20,'

  return (
    <section ref={containerRef} className={`relative py-10 md:py-16 px-4 ${isPersonal ? 'overflow-hidden' : ''}`}>
      {isPersonal && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/[0.03] rounded-full blur-[120px] pointer-events-none" />}
      <div className={`relative mx-auto ${isPersonal ? 'max-w-lg' : 'max-w-4xl'}`}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-center mb-5">
          <span className={`inline-block text-xs font-bold tracking-[0.25em] uppercase mb-2 ${isWarm ? 'text-amber-400' : 'text-[#39FF14]'}`}>{label}</span>
          <h2 className={`font-extrabold ${isPersonal ? 'text-xl md:text-3xl' : 'text-2xl md:text-4xl'}`}>{heading} <span className={`bg-gradient-to-r ${isWarm ? 'from-amber-400 to-amber-300' : 'from-[#39FF14] to-[#5fff47]'} bg-clip-text text-transparent`}>{headingHighlight}</span></h2>
          {isPersonal && <p className="mt-2 text-white/35 text-sm max-w-sm mx-auto">Conoce de primera mano quién está detrás de tu bienestar</p>}
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 30, scale: 0.97 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.15 }} className="relative rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 bg-black" style={{ boxShadow: `0 0 60px ${glowColor}` }}>
          <div className={`absolute -inset-1 bg-gradient-to-r ${isWarm ? 'from-amber-500/10 via-transparent to-amber-500/10' : 'from-[#39FF14]/10 via-transparent to-[#39FF14]/10'} rounded-3xl blur-sm pointer-events-none`} />
          <div className={`relative bg-black rounded-2xl md:rounded-3xl overflow-hidden ${isPersonal ? 'aspect-[9/16] sm:aspect-[9/14] md:aspect-[9/12] max-h-[70vh] md:max-h-[600px]' : 'aspect-[9/16] sm:aspect-[9/14] md:aspect-video max-h-[75vh] md:max-h-none'}`}>

            {/* Video — always preloading, always auto-plays when in view */}
            <video
              ref={videoRef}
              src={src}
              playsInline
              muted
              onEnded={handleEnded}
              onCanPlay={handleCanPlay}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              className="w-full h-full object-cover"
              preload="auto"
            />

            {/* Blur loading overlay — shows while video loads, reveals when playing */}
            <AnimatePresence>
              {!isReady && (
                <motion.div
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0 z-10 bg-gradient-to-br from-white/[0.04] via-white/[0.02] to-transparent backdrop-blur-2xl flex items-center justify-center"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 rounded-full border-2 border-white/10 border-t-[#39FF14]/60 animate-spin" />
                    <span className="text-white/30 text-xs">Cargando video…</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Soft blur veil over the muted video — fades away once audio is activated */}
            <AnimatePresence>
              {isReady && isPlaying && isMuted && !hasActivatedAudio && (
                <motion.div
                  initial={{ opacity: 0.6 }}
                  animate={{ opacity: 0.25 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="absolute inset-0 z-[5] bg-black/10 backdrop-blur-[2px] pointer-events-none"
                />
              )}
            </AnimatePresence>

            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none z-[6]" />

            {/* "Activar sonido" floating button */}
            <AnimatePresence>
              {showSoundBtn && isPlaying && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.8 }}
                  onClick={(e) => { e.stopPropagation(); activateSound() }}
                  className="absolute top-4 right-4 z-20 flex items-center gap-2 px-4 py-2.5 rounded-full text-black font-bold text-xs md:text-sm cursor-pointer"
                  style={{ background: `linear-gradient(to right, ${btnFrom}, ${btnTo})`, boxShadow: `0 0 30px ${glowShadow}0.4)` }}
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Activar sonido</span>
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-ping" />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Tap overlay — tap anywhere to activate sound or toggle pause/play */}
            {!isEnded && isReady && (
              <div onClick={handleVideoTap} className="absolute inset-0 z-10 cursor-pointer" />
            )}

            {/* Paused overlay — shows play icon when paused (not ended) */}
            <AnimatePresence>
              {!isPlaying && !isEnded && isReady && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={handleVideoTap}
                  className="absolute inset-0 z-10 flex items-center justify-center bg-black/30 cursor-pointer"
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/20">
                    <Play className="w-7 h-7 md:w-9 md:h-9 text-white ml-1" fill="white" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Ended overlay — "Ver de nuevo" */}
            <AnimatePresence>
              {isEnded && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm gap-4"
                >
                  <motion.button
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    onClick={handleReplay}
                    className="flex items-center gap-3 px-8 py-4 rounded-full text-black font-bold text-base md:text-lg cursor-pointer"
                    style={{ background: `linear-gradient(to right, ${btnFrom}, ${btnTo})`, boxShadow: `0 0 40px ${glowShadow}0.3)` }}
                  >
                    <RotateCcw className="w-5 h-5" />Ver de nuevo
                  </motion.button>
                  {!isMuted && <span className="text-white/40 text-xs">Con audio 🔊</span>}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom controls bar */}
            <div className="absolute bottom-0 inset-x-0 h-16 z-[15] flex items-center justify-between px-4 pointer-events-none">
              <button onClick={(e) => {
                e.stopPropagation()
                const vid = videoRef.current; if (!vid) return
                vid.muted = !vid.muted; setIsMuted(vid.muted)
                if (!vid.muted) { setShowSoundBtn(false); setHasActivatedAudio(true) }
              }} className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors duration-200 pointer-events-auto cursor-pointer">
                {isMuted ? <VolumeX className="w-4 h-4 text-white/70" /> : <Volume2 className="w-4 h-4 text-[#39FF14]" />}
              </button>
              <span className="text-white/30 text-[10px]">{hasActivatedAudio ? 'Toca para pausar' : 'Toca para activar sonido'}</span>
            </div>
          </div>
        </motion.div>
        {isPersonal && (<motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.5 }} className="mt-5 text-center"><div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20"><ShieldCheck className="w-3.5 h-3.5 text-amber-400" /><span className="text-amber-300/80 text-xs font-medium">Producto 100% certificado · Registro INVIMA · Hecho con amor en Colombia</span></div></motion.div>)}
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   FAQ ACCORDION
   ───────────────────────────────────────────── */
function FAQSection() {
  const { ref, inView } = useInView(0.05)
  const [openIdx, setOpenIdx] = useState<number | null>(0)
  return (
    <section ref={ref} className="relative py-16 md:py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <motion.span initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.5 }} className="inline-block text-[#39FF14] text-xs font-bold tracking-[0.25em] uppercase mb-3">Preguntas frecuentes</motion.span>
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }} className="text-2xl md:text-4xl font-extrabold">
            Resolvemos tus <span className="bg-gradient-to-r from-[#39FF14] to-[#5fff47] bg-clip-text text-transparent">dudas</span>
          </motion.h2>
        </div>
        <div className="space-y-3">
          {FAQ_ITEMS.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4, delay: 0.2 + i * 0.07 }} className="border border-white/[0.06] rounded-2xl overflow-hidden bg-white/[0.02] hover:border-[#39FF14]/15 transition-colors duration-300">
              <button onClick={() => setOpenIdx(openIdx === i ? null : i)} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer" aria-expanded={openIdx === i}>
                <span className="text-white text-sm md:text-base font-semibold pr-4">{item.q}</span>
                <ChevronUp className={`w-4 h-4 text-[#39FF14]/60 flex-shrink-0 transition-transform duration-300 ${openIdx === i ? '' : 'rotate-180'}`} />
              </button>
              <AnimatePresence initial={false}>
                {openIdx === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: 'easeInOut' }} className="overflow-hidden">
                    <p className="px-5 pb-4 text-white/50 text-sm leading-relaxed">{item.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   MAIN PAGE
   ───────────────────────────────────────────── */
export default function Home() {
  const scrollProgress = useScrollProgress()
  const heroRef = useRef<HTMLDivElement>(null)
  const heroSectionScroll = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const productOpacity = useTransform(heroSectionScroll.scrollYProgress, [0, 0.85], [1, 0])

  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">

      {/* ═══════ HERO — DOLOR ═══════ */}
      <section ref={heroRef} className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/hero-bg.webp" alt="" className="w-full h-full object-cover opacity-30" aria-hidden="true" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black" />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#39FF14]/[0.03] rounded-full blur-[150px] pointer-events-none" />

        <div className="relative z-10 min-h-screen flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-4 lg:gap-0 px-4 md:px-8 lg:px-16 pt-20 md:pt-24 pb-12">
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-xl lg:max-w-2xl">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#39FF14]/20 bg-[#39FF14]/5 mb-5 md:mb-6">
              <BadgeCheck className="w-3.5 h-3.5 text-[#39FF14]" />
              <span className="text-[#39FF14] text-xs md:text-sm font-medium tracking-wide">100% Natural · Sin laxantes · Registro INVIMA</span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight">
              <span className="block">¿Hinchado, pesado</span>
              <span className="block">y sin poder</span>
              <span className="block bg-gradient-to-r from-[#39FF14] via-[#5fff47] to-[#39FF14] bg-clip-text text-transparent bg-[length:200%_auto] animate-[shimmer_3s_linear_infinite]">ir al baño?</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.6 }} className="mt-3 md:mt-5 text-base md:text-lg text-white/50 leading-relaxed">
              En solo <span className="text-[#39FF14] font-bold">7 días</span> puedes sentir tu colon limpio, sin inflamación y sin gases. Fórmula natural que <span className="text-white/80 font-semibold">no irrita ni causa dolores estomacales</span>.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.9 }} className="mt-5 md:mt-7 flex flex-col items-center lg:items-start gap-3">
              <GlowButton href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hola! Quiero pedir ColiPlus 💚')}`}>
                <MessageCircle className="w-5 h-5" /> Quiero mi Kit + Envío Gratis <ArrowRight className="w-4 h-4" />
              </GlowButton>
              <span className="text-white/25 text-[10px] md:text-xs flex items-center gap-2 flex-wrap justify-center lg:justify-start">
                <span className="flex items-center gap-1"><Truck className="w-3 h-3 text-[#39FF14]/50" /> Envío gratis</span>
                <span className="text-white/10">·</span>
                <span className="flex items-center gap-1"><Banknote className="w-3 h-3 text-[#39FF14]/50" /> Pagas al recibir</span>
              </span>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 1.2 }} className="mt-3 inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border border-amber-500/20 bg-amber-500/[0.06]">
              <Gift className="w-4 h-4 text-amber-400" />
              <span className="text-amber-300/90 text-xs md:text-sm font-semibold">Loción Termoactiva GRATIS con tu compra</span>
              <Sparkles className="w-3 h-3 text-amber-400/60" />
            </motion.div>
          </div>

          <motion.div style={{ opacity: productOpacity }} className="relative flex-shrink-0">
            <FloatingProduct scrollProgress={scrollProgress} />
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 1 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
          <span className="text-white/15 text-[10px] tracking-[0.3em] uppercase">Descubre más</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}><ChevronDown className="w-4 h-4 text-[#39FF14]/30" /></motion.div>
        </motion.div>
      </section>

      {/* ═══════ AGITACIÓN — CHECKLIST ═══════ */}
      <AgitationSection />
      <SectionDivider />

      {/* ═══════ VIDEO ═══════ */}
      <VideoPlayer src="/coliplus-video.mp4" label="🎬 Mira cómo funciona" heading="Descubre el" headingHighlight="poder de ColiPlus" />

      {/* ═══════ SOCIAL PROOF BAR ═══════ */}
      <SocialProofBar />
      <SectionDivider />

      {/* ═══════ INGREDIENTS ═══════ */}
      <IngredientsSection />
      <SectionDivider />

      {/* ═══════ FULL FORMULA ═══════ */}
      <FullFormulaSection />
      <SectionDivider />

      {/* ═══════ HOW IT WORKS ═══════ */}
      <HowItWorksSection />
      <SectionDivider />

      {/* ═══════ OFERTA — 3 KITS ═══════ */}
      <OfferSection />

      {/* ═══════ PAYMENT METHODS ═══════ */}
      <PaymentMethodsSection />

      {/* ═══════ TESTIMONIALS ═══════ */}
      <TestimonialsSection />
      <SectionDivider />

      {/* ═══════ ULTRA GUARANTEE ═══════ */}
      <UltraGuaranteeSection />
      <SectionDivider />

      {/* ═══════ WELCOME VIDEO ═══════ */}
      <VideoPlayer src="/coliplus-bienvenida.mp4" label="🤝 Un mensaje para ti" heading="Te damos la" headingHighlight="bienvenida" accent="warm" variant="personal" />

      {/* ═══════ FAQ ═══════ */}
      <FAQSection />
      <SectionDivider />

      {/* ═══════ FINAL CTA ═══════ */}
      <FinalCTASection />

      {/* Footer */}
      <footer className="bg-black border-t border-white/5 py-10 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Leaf className="w-5 h-5 text-[#39FF14]" />
            <span className="text-white font-bold text-lg">ColiPlus</span>
          </div>
          <p className="text-white/25 text-xs md:text-sm mb-2">Mezcla natural en fibra · Noni, Linaza, Pitaya, Flor de Jamaica, Alcachofa, Semillas de Chía, Espirulina, Té Verde y Stevia</p>
          <p className="text-white/20 text-xs mb-1">Tarro de 450g · Porción 18g · Sabor Manzana Verde · Solo 34 kcal/porción</p>
          <p className="text-white/20 text-xs">© {new Date().getFullYear()} ColiPlus · Producto con Registro INVIMA · Todos los derechos reservados</p>
          <p className="text-white/15 text-[10px] mt-1">Este producto no está diseñado para diagnosticar, tratar, curar o prevenir ninguna enfermedad. Consulte a su médico antes de usar.</p>
        </div>
      </footer>

      <FloatingWhatsApp />
    </main>
  )
}

/* ─────────────────────────────────────────────
   AGITATION SECTION — CHECKLIST DE DOLOR
   ───────────────────────────────────────────── */
function AgitationSection() {
  const { ref, inView } = useInView(0.05)
  return (
    <section ref={ref} className="relative py-16 md:py-24 px-4">
      <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-red-500/[0.03] rounded-full blur-[120px] pointer-events-none" />
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <motion.span initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.6 }} className="inline-block text-red-400/80 text-xs font-bold tracking-[0.25em] uppercase mb-4">Sesgo de confirmación</motion.span>
          <motion.h2 initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.15 }} className="text-3xl md:text-5xl font-extrabold leading-tight mb-4">
            ¿Te pasa esto <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">seguido?</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.6, delay: 0.3 }} className="text-white/35 text-sm md:text-base max-w-md mx-auto">
            Si identificas 2 o más de estos síntomas, tu colon necesita ayuda urgente.
          </motion.p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          {PAIN_POINTS.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30, filter: 'blur(8px)' }} animate={inView ? { opacity: 1, x: 0, filter: 'blur(0px)' } : {}} transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }} className="flex items-center gap-4 bg-gradient-to-r from-red-500/[0.06] to-transparent border border-red-500/[0.08] rounded-xl px-4 py-3.5 hover:border-red-500/20 transition-colors duration-300">
              <span className="text-xl flex-shrink-0">{item.icon}</span>
              <p className="text-white/70 text-sm font-medium">{item.text}</p>
            </motion.div>
          ))}
        </div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 1.1 }} className="mt-8 text-center">
          <p className="text-white/35 text-sm md:text-base max-w-xl mx-auto">
            Eso no es normal y <span className="text-white/70 font-semibold">no tenés por qué vivir así.</span> Miles ya recuperaron su bienestar digestivo con ColiPlus.
          </p>
          <div className="mt-4">
            <GlowButton href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hola! Tengo esos síntomas y quiero probar ColiPlus 💚')}`} size="md">
              <MessageCircle className="w-4 h-4" /> Quiero sentirme bien <ArrowRight className="w-3.5 h-3.5" />
            </GlowButton>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   SOCIAL PROOF BAR
   ───────────────────────────────────────────── */
function SocialProofBar() {
  const { ref, inView } = useInView(0.1)
  return (
    <section ref={ref} className="relative py-6 md:py-8 border-y border-white/[0.04] bg-white/[0.01]">
      <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.8 }} className="max-w-6xl mx-auto px-4 flex flex-wrap items-center justify-center gap-6 md:gap-12">
        {[
          { value: '5.000+', label: 'Clientes satisfechos', icon: Users },
          { value: '4.8/5', label: 'Calificación promedio', icon: Star },
          { value: '#1', label: 'Más vendido Colombia', icon: TrendingUp },
          { value: 'GRATIS', label: 'Obsequio incluido', icon: Gift },
          { value: 'INVIMA', label: 'Registro sanitario', icon: Award },
        ].map((stat, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <stat.icon className="w-4 h-4 text-[#39FF14]/50" />
            <div>
              <span className="text-white font-bold text-sm md:text-base">{stat.value}</span>
              <span className="text-white/25 text-[10px] md:text-xs ml-1.5">{stat.label}</span>
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   INGREDIENTS SECTION
   ───────────────────────────────────────────── */
function IngredientsSection() {
  const { ref, inView } = useInView(0.05)
  return (
    <section ref={ref} className="relative py-16 md:py-24 px-4">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#39FF14]/[0.02] rounded-full blur-[150px] pointer-events-none" />
      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <motion.span initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.5 }} className="inline-block text-[#39FF14] text-xs font-bold tracking-[0.25em] uppercase mb-4">La solución natural</motion.span>
          <motion.h2 initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.1 }} className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
            3 superpoderes, <span className="bg-gradient-to-r from-[#39FF14] to-[#5fff47] bg-clip-text text-transparent">1 solución.</span>
          </motion.h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {INGREDIENTS.map((ingredient, i) => <IngredientCard key={ingredient.id} ingredient={ingredient} index={i} />)}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   FULL FORMULA SECTION
   ───────────────────────────────────────────── */
function FullFormulaSection() {
  const { ref, inView } = useInView(0.1)
  return (
    <section ref={ref} className="relative py-12 md:py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <motion.span initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.5 }} className="inline-block text-[#39FF14] text-xs font-bold tracking-[0.25em] uppercase mb-3">Fórmula completa</motion.span>
          <motion.h3 initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }} className="text-2xl md:text-4xl font-extrabold">9 ingredientes, <span className="bg-gradient-to-r from-[#39FF14] to-[#5fff47] bg-clip-text text-transparent">0 azúcar</span></motion.h3>
          <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.5, delay: 0.2 }} className="mt-2 text-white/35 text-sm">Solo 34 calorías por porción · Endulzado con Stevia · Sabor Manzana Verde</motion.p>
        </div>
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          {ALL_INGREDIENTS.map((ing, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }} animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}} transition={{ duration: 0.5, delay: 0.3 + i * 0.07 }} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 md:p-4 text-center hover:border-[#39FF14]/20 transition-colors duration-300">
              <p className="text-white font-bold text-sm md:text-base">{ing.name}</p>
              <p className="text-white/30 text-[10px] md:text-xs mt-0.5">{ing.role}</p>
            </motion.div>
          ))}
        </div>
        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.5, delay: 1.2 }} className="mt-8 flex flex-wrap items-center justify-center gap-5 md:gap-8 text-white/25 text-xs">
          {[
            { icon: Leaf, label: '100% Natural' }, { icon: ShieldCheck, label: 'Sin Gluten' }, { icon: Sparkles, label: 'Producto Vegano' }, { icon: Heart, label: 'Sin Lactosa' }, { icon: Award, label: 'Registro INVIMA' },
          ].map((badge, i) => (
            <div key={i} className="flex items-center gap-1.5"><badge.icon className="w-3.5 h-3.5 text-[#39FF14]/40" /><span>{badge.label}</span></div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   HOW IT WORKS
   ───────────────────────────────────────────── */
function HowItWorksSection() {
  const { ref, inView } = useInView(0.1)
  const steps = [
    { num: '01', title: 'Mezcla', desc: 'Agrega 1 cucharada (18g) en agua o jugo. Delicioso sabor a manzana verde, sin azúcar añadida.', icon: '🥤' },
    { num: '02', title: 'Bebe', desc: 'Tómalo en ayunas o antes de dormir. La fibra prebiótica actúa desde el primer vaso.', icon: '💧' },
    { num: '03', title: 'Siente', desc: 'En 7-14 días: menos inflamación, mejor tránsito, más energía. Sin dolores, sin laxantes.', icon: '⚡' },
  ]
  return (
    <section ref={ref} className="relative py-16 md:py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <motion.span initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.5 }} className="inline-block text-[#39FF14] text-xs font-bold tracking-[0.25em] uppercase mb-4">Simple y efectivo</motion.span>
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }} className="text-3xl md:text-5xl font-extrabold">Así es como <span className="bg-gradient-to-r from-[#39FF14] to-[#5fff47] bg-clip-text text-transparent">funciona</span></motion.h2>
        </div>
        <div className="relative">
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#39FF14]/10 to-transparent" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
            {steps.map((step, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.3 + i * 0.2 }} className="relative text-center">
                <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6">
                  <div className="absolute inset-0 rounded-full border border-[#39FF14]/20" />
                  <div className="absolute inset-2 rounded-full bg-[#39FF14]/5" />
                  <span className="text-2xl">{step.icon}</span>
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-[#39FF14] rounded-full text-black text-[10px] font-black flex items-center justify-center">{step.num}</span>
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
   OFERTA — 3 KITS CON ANCLAJE DE PRECIO
   ───────────────────────────────────────────── */
function OfferSection() {
  const { ref, inView } = useInView(0.1)
  return (
    <section ref={ref} className="relative py-20 md:py-32 px-4 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#39FF14]/[0.025] rounded-full blur-[160px] pointer-events-none" />
      <div className="relative max-w-5xl mx-auto text-center">
        <motion.span initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.5 }} className="inline-block text-[#39FF14] text-xs font-bold tracking-[0.25em] uppercase mb-4">🔥 Oferta exclusiva hoy</motion.span>
        <motion.h2 initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}} transition={{ duration: 0.7, delay: 0.1 }} className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight">Elige tu Kit</motion.h2>
        <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.5, delay: 0.25 }} className="mt-2 text-white/40 text-sm md:text-base">Tarros de 450g · Sabor Manzana Verde · 25 porciones por tarro</motion.p>

        {/* Urgency */}
        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.5, delay: 0.3 }} className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20">
          <Clock className="w-3.5 h-3.5 text-red-400" />
          <span className="text-red-300 text-xs font-bold">Oferta válida solo por hoy o hasta agotar existencias</span>
        </motion.div>

        {/* 3 Kit Cards */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.35 }} className="mt-8 md:mt-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 max-w-3xl mx-auto">
            {KITS.map((kit, i) => (
              <motion.a
                key={kit.id}
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${kit.msg}`}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                className={`relative rounded-2xl p-5 md:p-6 text-center border transition-all duration-300 cursor-pointer hover:scale-[1.03] block group ${kit.highlight ? 'bg-[#39FF14]/[0.08] border-[#39FF14]/40 shadow-[0_0_40px_rgba(57,255,20,0.12)] ring-2 ring-[#39FF14]/20' : 'bg-white/[0.03] border-white/[0.06] hover:border-[#39FF14]/20'}`}
              >
                {kit.tag && (
                  <span className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] font-black tracking-wide uppercase ${kit.highlight ? 'bg-[#39FF14] text-black shadow-[0_0_15px_rgba(57,255,20,0.4)]' : 'bg-white/10 text-white/50 border border-white/10'}`}>
                    {kit.tag}
                  </span>
                )}
                <p className="text-white/40 text-[10px] md:text-xs font-bold tracking-wider uppercase mb-1 mt-1">{kit.name}</p>
                <p className="text-white/50 text-xs md:text-sm mb-2">{kit.qty}</p>
                <p className={`text-3xl md:text-4xl font-black ${kit.highlight ? 'bg-gradient-to-r from-[#39FF14] to-[#5fff47] bg-clip-text text-transparent' : 'text-white'}`}>{kit.price}</p>
                <p className="text-white/30 text-[10px] md:text-xs mt-1">{kit.unitPrice}</p>
                {kit.savings && (
                  <span className="inline-block mt-2 px-3 py-0.5 rounded-full bg-[#39FF14]/10 text-[#39FF14] text-[10px] font-bold">{kit.savings}</span>
                )}

                {/* CTA button inside card */}
                <div className={`mt-4 flex items-center justify-center gap-2 rounded-full py-3 px-5 text-xs md:text-sm font-bold transition-all duration-300 ${kit.highlight ? 'bg-[#39FF14] text-black group-hover:shadow-[0_0_25px_rgba(57,255,20,0.4)]' : 'bg-white/[0.08] text-white/70 group-hover:bg-[#25D366]/20 group-hover:text-white'}`} style={{ minHeight: '44px' }}>
                  <MessageCircle className="w-4 h-4" /> Pedir por WhatsApp
                </div>

                {/* Shipping + payment inside card */}
                <div className="mt-3 flex items-center justify-center gap-2 text-white/25 text-[9px] md:text-[10px]">
                  <Truck className="w-3 h-3" /> Envío gratis
                  <span className="text-white/10">·</span>
                  <Banknote className="w-3 h-3" /> Pagas al recibir
                </div>
              </motion.a>
            ))}
          </div>

          {/* Gift badge */}
          <div className="mt-6">
            <span className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm font-semibold">
              <Gift className="w-3.5 h-3.5" /> + Loción Termoactiva GRATIS en toda compra
            </span>
          </div>
        </motion.div>

        {/* 🎁 OBSEQUIO */}
        <motion.div initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}} transition={{ duration: 0.7, delay: 0.45 }} className="mt-8 md:mt-10 relative">
          <div className="absolute inset-0 bg-amber-500/[0.04] rounded-3xl blur-[40px] pointer-events-none" />
          <div className="relative bg-gradient-to-br from-amber-500/[0.08] via-amber-400/[0.04] to-transparent border border-amber-500/20 rounded-3xl p-5 md:p-7 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/[0.06] rounded-full blur-[50px] pointer-events-none" />
            <div className="flex flex-col md:flex-row items-center gap-5 md:gap-8">
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 rounded-2xl bg-amber-400/10 blur-[20px]" />
                <img src="/images/termoactiva-product.jpg" alt="Loción Termoactiva Allpa Natural - Obsequio gratis" className="relative w-28 h-28 md:w-36 md:h-36 object-cover rounded-2xl border border-amber-500/20 shadow-[0_0_30px_rgba(245,158,11,0.15)]" loading="lazy" />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center shadow-lg">
                  <Gift className="w-4 h-4 text-black" />
                </div>
              </div>
              <div className="text-center md:text-left flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/25 mb-3">
                  <Gift className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-amber-300 text-[11px] font-bold tracking-[0.2em] uppercase">Obsequio exclusivo</span>
                </div>
                <h3 className="text-xl md:text-2xl font-extrabold text-white mb-1.5">Loción Termoactiva <span className="text-amber-400">Allpa Natural</span></h3>
                <p className="text-white/50 text-sm leading-relaxed mb-3 max-w-md">Analgésico y antiinflamatorio tópico con <span className="text-white/70 font-medium">Árnica, Castaño de Indias, Caléndula, Hamamelis, Uña de Gato y Chuchuhuasi</span>. Alivia dolores musculares, torceduras, calambres y contracturas. 18ml.</p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  {['Torceduras', 'Esguinces', 'Calambres', 'Contracturas', 'Tortícolis'].map((use, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500/[0.08] border border-amber-500/15 rounded-full text-amber-300/80 text-[10px] font-medium">
                      <Zap className="w-2.5 h-2.5" />{use}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex-shrink-0 text-center">
                <div className="text-3xl md:text-4xl font-black text-amber-400">GRATIS</div>
                <p className="text-white/30 text-[10px] mt-1">Valor: $25.000 COP</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Trust seals near CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.6 }} className="mt-10 md:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          {[
            { icon: Truck, label: 'Envío Gratis', sub: 'A toda Colombia' },
            { icon: ShieldCheck, label: 'Pago Contra Entrega', sub: 'Pagas al recibir en casa' },
            { icon: Award, label: 'Registro INVIMA', sub: 'Producto certificado' },
          ].map((badge, i) => (
            <div key={i} className="flex items-center gap-3 bg-white/[0.03] rounded-2xl px-5 py-4 border border-white/[0.06] hover:border-[#39FF14]/15 transition-colors duration-300">
              <div className="w-11 h-11 rounded-full bg-[#39FF14]/10 flex items-center justify-center flex-shrink-0"><badge.icon className="w-5 h-5 text-[#39FF14]" /></div>
              <div className="text-left"><p className="text-white text-sm font-semibold">{badge.label}</p><p className="text-white/35 text-xs">{badge.sub}</p></div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   PAYMENT METHODS
   ───────────────────────────────────────────── */
function PaymentMethodsSection() {
  const { ref, inView } = useInView(0.1)
  return (
    <section ref={ref} className="relative py-12 md:py-20 px-4 border-y border-white/[0.04]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <motion.span initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.5 }} className="inline-block text-[#39FF14] text-xs font-bold tracking-[0.25em] uppercase mb-3">Paga como prefieras</motion.span>
          <motion.h3 initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }} className="text-2xl md:text-4xl font-extrabold">Todos los <span className="bg-gradient-to-r from-[#39FF14] to-[#5fff47] bg-clip-text text-transparent">medios de pago</span></motion.h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {PAYMENT_METHODS.map((pm, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-center hover:border-[#39FF14]/20 transition-colors duration-300 flex flex-col items-center gap-2">
              <pm.icon className="w-5 h-5 text-[#39FF14]/70" />
              <p className="text-white text-xs font-semibold leading-tight">{pm.label}</p>
              <p className="text-white/25 text-[10px]">{pm.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   TESTIMONIALS
   ───────────────────────────────────────────── */
function TestimonialsSection() {
  const { ref, inView } = useInView(0.1)
  const testimonials = [
    { name: 'Gustavo A. Sabogal', text: 'Excelente producto la verdad lo recomiendo me ayudó mucho con mi ansiedad y estreñimiento y de paso baje de peso gracias', stars: 5, time: '13 sem', verified: true, screenshot: '/images/testimonio-3.jpg' },
    { name: 'María Isabel Mendoza', text: 'Llevo tres días tomándolo excelente lo recomiendo gracias por tan buen producto', stars: 5, time: '12 sem', verified: true, screenshot: '/images/testimonio-2.jpg' },
    { name: 'Juan Gabriel Mendoza', text: 'Es super pero super bueno tenía 90 kilos de peso y en 15 días baje a 84 kilos', stars: 5, time: '11 sem', verified: true, screenshot: '/images/testimonio-4.jpg' },
    { name: 'Licencia Sabogal', text: 'Al fin un producto que me ayudó a aliviar mi estreñimiento, sobrepeso y ansiedades lo recomiendo muy bueno', stars: 5, time: '12 sem', verified: true, screenshot: '/images/testimonio-1.jpg' },
    { name: 'Esmeralda Ruiz', text: 'Muy buen producto, son muy puntuales con la entrega', stars: 5, time: '38 sem', verified: true, screenshot: null },
    { name: 'Irene Arroyo', text: 'Realmente es muy bueno, me ha ayudado mucho gracias Dios y gracias a sus creadores esto es una bendición', stars: 5, time: '1 sem', verified: true, screenshot: null },
  ]
  return (
    <section ref={ref} className="relative py-16 md:py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <motion.span initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.5 }} className="inline-block text-[#39FF14] text-xs font-bold tracking-[0.25em] uppercase mb-4">Resultados reales</motion.span>
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }} className="text-3xl md:text-5xl font-extrabold">Lo que dicen <span className="bg-gradient-to-r from-[#39FF14] to-[#5fff47] bg-clip-text text-transparent">nuestros clientes</span></motion.h2>
          <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.5, delay: 0.2 }} className="mt-3 flex items-center justify-center gap-2">
            <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-4 h-4 text-[#39FF14] fill-[#39FF14]" />)}</div>
            <span className="text-white/30 text-sm">11.8K me gusta en Facebook · +5.000 clientes</span>
          </motion.div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }} animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}} transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 hover:border-[#39FF14]/15 transition-colors duration-300">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex gap-0.5">{Array.from({ length: t.stars }).map((_, si) => <Star key={si} className="w-3.5 h-3.5 text-[#39FF14] fill-[#39FF14]" />)}</div>
                {t.verified && <BadgeCheck className="w-3.5 h-3.5 text-[#39FF14]" />}
              </div>
              <p className="text-white/55 text-sm leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
              <div><p className="text-white font-semibold text-xs">{t.name}</p><span className="text-white/15 text-[9px]">Compra verificada · {t.time}</span></div>
              {t.screenshot && (<div className="mt-3 pt-3 border-t border-white/[0.04]"><img src={t.screenshot} alt={`Reseña de ${t.name}`} className="w-full rounded-lg border border-white/[0.06] opacity-70 hover:opacity-100 transition-opacity duration-300" loading="lazy" /></div>)}
            </motion.div>
          ))}
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 1 }} className="mt-8 max-w-2xl mx-auto">
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 hover:border-[#39FF14]/15 transition-colors duration-300">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center"><span className="text-blue-400 text-[10px] font-bold">f</span></div>
              <span className="text-white/40 text-xs font-medium">Prueba social en Facebook</span>
              <span className="text-white/20 text-[10px]">11.8K me gusta</span>
            </div>
            <img src="/images/testimonio-facebook.jpg" alt="Reseñas de ColiPlus en Facebook" className="w-full rounded-xl border border-white/[0.06]" loading="lazy" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   ULTRA GUARANTEE
   ───────────────────────────────────────────── */
function UltraGuaranteeSection() {
  const { ref, inView } = useInView(0.1)
  return (
    <section ref={ref} className="relative py-16 md:py-24 px-4 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#39FF14]/[0.02] rounded-full blur-[150px] pointer-events-none" />
      <div className="relative max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <motion.span initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.5 }} className="inline-block text-[#39FF14] text-xs font-bold tracking-[0.25em] uppercase mb-4">Garantía total</motion.span>
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }} className="text-3xl md:text-5xl font-extrabold">Compra con <span className="bg-gradient-to-r from-[#39FF14] to-[#5fff47] bg-clip-text text-transparent">total confianza</span></motion.h2>
        </div>

        {/* INVIMA */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.3 }} className="relative bg-gradient-to-br from-[#39FF14]/[0.06] via-[#39FF14]/[0.02] to-transparent border border-[#39FF14]/20 rounded-3xl p-6 md:p-8 mb-8 overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#39FF14]/[0.04] rounded-full blur-[60px] pointer-events-none" />
          <div className="relative flex flex-col md:flex-row items-center gap-6 md:gap-8">
            <div className="flex-shrink-0 text-center">
              <div className="relative">
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-[#39FF14]/10 border-2 border-[#39FF14]/30 flex items-center justify-center mx-auto">
                  <ShieldCheck className="w-10 h-10 md:w-12 md:h-12 text-[#39FF14]" />
                </div>
              </div>
              <p className="mt-3 text-[#39FF14] text-xs font-bold tracking-widest uppercase">INVIMA</p>
            </div>
            <div className="text-center md:text-left flex-1">
              <h3 className="text-xl md:text-2xl font-extrabold text-white mb-2">Registro INVIMA <span className="text-[#39FF14]">Oficial</span></h3>
              <p className="text-white/50 text-sm leading-relaxed mb-4">ColiPlus cuenta con <span className="text-white/80 font-semibold">Registro Sanitario INVIMA</span>, garantizando inocuidad alimentaria, Buenas Prácticas de Manufactura y control de calidad riguroso.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  { icon: ShieldCheck, text: 'Inocuidad alimentaria comprobada' },
                  { icon: BadgeCheck, text: 'Buenas Prácticas de Manufactura' },
                  { icon: Award, text: 'Control de calidad riguroso' },
                  { icon: Leaf, text: 'Ingredientes verificados y seguros' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-white/60 text-xs">
                    <item.icon className="w-3.5 h-3.5 text-[#39FF14] flex-shrink-0" /><span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Guarantee pillars */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.5 }} className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
          {[
            { icon: Truck, title: 'Recibe primero, paga después', desc: 'Pago contra entrega en toda Colombia. Solo pagas cuando tienes el producto en tus manos.' },
            { icon: ShieldCheck, title: '100% Natural y Certificado', desc: 'Registro INVIMA vigente. Sin químicos añadidos, sin gluten, sin lactosa.' },
            { icon: Heart, title: '+5.000 clientes satisfechos', desc: 'Miles de colombianos ya transformaron su salud digestiva con ColiPlus.' },
          ].map((item, i) => (
            <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 md:p-6 hover:border-[#39FF14]/15 transition-colors duration-300">
              <div className="w-12 h-12 rounded-full bg-[#39FF14]/10 flex items-center justify-center mb-4"><item.icon className="w-6 h-6 text-[#39FF14]" /></div>
              <h4 className="text-white font-bold text-sm md:text-base mb-2">{item.title}</h4>
              <p className="text-white/40 text-xs md:text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </motion.div>

        {/* Testimonial screenshots */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.7 }} className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-5 md:p-7">
          <div className="flex items-center gap-2 mb-5">
            <BadgeCheck className="w-4 h-4 text-[#39FF14]" />
            <span className="text-white/50 text-xs font-bold tracking-wider uppercase">Reseñas verificadas de clientes reales</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { src: '/images/testimonio-3.jpg', name: 'Gustavo A.' },
              { src: '/images/testimonio-2.jpg', name: 'María Isabel' },
              { src: '/images/testimonio-4.jpg', name: 'Juan Gabriel' },
              { src: '/images/testimonio-1.jpg', name: 'Licencia S.' },
            ].map((img, i) => (
              <div key={i} className="relative group">
                <img src={img.src} alt={`Reseña verificada de ${img.name}`} className="w-full rounded-xl border border-white/[0.06] group-hover:border-[#39FF14]/20 transition-colors duration-300" loading="lazy" />
                <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 rounded-md backdrop-blur-sm">
                  <span className="text-white/60 text-[9px] font-medium">{img.name}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   FINAL CTA
   ───────────────────────────────────────────── */
function FinalCTASection() {
  const { ref, inView } = useInView(0.1)
  return (
    <section ref={ref} className="relative py-24 md:py-36 px-4 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-[#39FF14]/[0.04] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-[#39FF14]/[0.03] rounded-full blur-[100px]" />
      </div>
      <div className="relative max-w-3xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.6 }} className="mb-8">
          <img src="/coliplus.webp" alt="ColiPlus" className="w-24 h-24 md:w-32 md:h-32 mx-auto object-contain drop-shadow-[0_0_30px_rgba(57,255,20,0.2)]" />
        </motion.div>
        <motion.h2 initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.1 }} className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
          Tu alivio <span className="bg-gradient-to-r from-[#39FF14] to-[#5fff47] bg-clip-text text-transparent">empieza hoy</span>
        </motion.h2>
        <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.6, delay: 0.2 }} className="text-white/45 text-base md:text-lg max-w-xl mx-auto mb-4">
          No esperes un día más con inflamación, gases y estreñimiento. Pide tu Kit ColiPlus y siente la diferencia desde la primera semana.
        </motion.p>

        {/* Gift reminder */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.5, delay: 0.25 }} className="mb-6 inline-flex items-center gap-3 px-5 py-3 rounded-2xl border border-amber-500/20 bg-amber-500/[0.06]">
          <img src="/images/termoactiva-product.jpg" alt="Loción Termoactiva obsequio" className="w-10 h-10 rounded-lg object-cover border border-amber-500/20" loading="lazy" />
          <div className="text-left">
            <p className="text-amber-300 text-sm font-bold">+ Loción Termoactiva GRATIS</p>
            <p className="text-white/30 text-[10px]">Árnica · Caléndula · Chuchuhuasi · 18ml</p>
          </div>
          <Gift className="w-5 h-5 text-amber-400 ml-1" />
        </motion.div>

        {/* Price summary */}
        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.5, delay: 0.3 }} className="mb-8">
          <div className="flex flex-wrap items-center justify-center gap-3 text-white/30 text-sm">
            <span>1 tarro: <span className="font-semibold text-white/50">$75.900</span></span>
            <span className="text-white/10">·</span>
            <span>2 tarros: <span className="font-semibold text-[#39FF14]/70">$113.850</span> <span className="text-[#39FF14]/50 text-[10px] font-bold">-25%</span></span>
            <span className="text-white/10">·</span>
            <span>3 tarros: <span className="font-bold text-[#39FF14]">$151.800</span> <span className="text-[#39FF14] text-[10px] font-bold">-33%</span></span>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.4 }} className="flex flex-col items-center gap-4">
          <GlowButton href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hola! Quiero pedir ColiPlus + Loción GRATIS 💚')}`} className="shadow-[0_0_60px_rgba(57,255,20,0.2)]">
            <MessageCircle className="w-5 h-5" /> Pedir por WhatsApp <ArrowRight className="w-4 h-4" />
          </GlowButton>
          <div className="flex items-center gap-2 text-white/25 text-xs">
            <Truck className="w-3 h-3 text-[#39FF14]/50" /> Envío gratis
            <span className="text-white/10">·</span>
            <Banknote className="w-3 h-3 text-[#39FF14]/50" /> Pagas al recibir
            <span className="text-white/10">·</span>
            <ShieldCheck className="w-3 h-3 text-[#39FF14]/50" /> INVIMA
          </div>
        </motion.div>

        {/* Urgency */}
        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.6, delay: 0.7 }} className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/15">
          <Clock className="w-3.5 h-3.5 text-red-400" />
          <span className="text-red-300/80 text-xs font-medium">Oferta válida solo por hoy o hasta agotar existencias</span>
        </motion.div>
      </div>
    </section>
  )
}
