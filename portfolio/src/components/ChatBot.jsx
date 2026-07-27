import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Sparkles, Heart, BotMessageSquare } from 'lucide-react'

const YI_MASCOT = () => (
  <svg width="48" height="48" viewBox="0 0 100 100" fill="none">
    <circle cx="50" cy="50" r="46" fill="#FFF0F6" stroke="#E84393" strokeWidth="2"/>
    <circle cx="50" cy="50" r="42" fill="url(#yiGrad)"/>
    {/* Face */}
    <ellipse cx="36" cy="42" rx="5" ry="6" fill="#1A1A2E"/>
    <ellipse cx="64" cy="42" rx="5" ry="6" fill="#1A1A2E"/>
    <ellipse cx="37" cy="40" rx="2" ry="2.5" fill="white"/>
    <ellipse cx="65" cy="40" rx="2" ry="2.5" fill="white"/>
    {/* Blush */}
    <ellipse cx="26" cy="54" rx="7" ry="4" fill="#FFB6C1" opacity="0.5"/>
    <ellipse cx="74" cy="54" rx="7" ry="4" fill="#FFB6C1" opacity="0.5"/>
    {/* Smile */}
    <path d="M38 58 Q50 70 62 58" stroke="#E84393" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    {/* Hair / antenna */}
    <path d="M44 14 Q50 4 56 14" stroke="#E84393" strokeWidth="3" strokeLinecap="round" fill="none"/>
    <circle cx="50" cy="6" r="4" fill="#E84393"/>
    <circle cx="50" cy="6" r="2" fill="#FD79A8"/>
    {/* Sparkle on antenna */}
    <path d="M50 0 L51 3 L54 2 L51 4 L53 7 L50 5 L48 7 L50 4 L47 2 L49 3 Z" fill="#FFD700" opacity="0.8"/>
    {/* Heart on chest */}
    <path d="M44 74 C44 70 48 68 50 72 C52 68 56 70 56 74 C56 78 50 82 50 82 C50 82 44 78 44 74Z" fill="#E84393" opacity="0.8"/>
    <defs>
      <linearGradient id="yiGrad" x1="0" y1="0" x2="100" y2="100">
        <stop offset="0%" stopColor="#FFF0F6"/>
        <stop offset="100%" stopColor="#FFE4F0"/>
      </linearGradient>
    </defs>
  </svg>
)

const QUICK_REPLIES = [
  { label: '👋 Who are you?', msg: 'Who are you?' },
  { label: '🛠️ Services', msg: 'What services do you offer?' },
  { label: '💼 Projects', msg: 'Show me the projects' },
  { label: '📧 Contact', msg: 'How can I contact Yaseen?' },
  { label: '🚀 Hire Me', msg: 'I want to hire Yaseen' },
  { label: '🧰 MERN Stack', msg: 'Tell me about MERN stack' },
]

const BOT_NAME = 'YI'
const BOT_TAGLINE = 'Yaseen\'s AI Assistant'

function detectIntent(text) {
  const t = text.toLowerCase().trim()

  // Greetings
  if (/^(hi|hello|hey|howdy|salaam|assalam|yo|sup|hola|greetings)/.test(t)) {
    return { category: 'greeting', priority: 10 }
  }

  // Who are you / identity
  if (/(who are you|what are you|your name|tell me about yourself|tum kon|ap ka naam)/.test(t)) {
    return { category: 'identity', priority: 10 }
  }

  // About Yaseen
  if (/(who is yaseen|tell me about yaseen|about yaseen|yaseen ahmad|yaseen kaun|yaseen profile|developer)/.test(t)) {
    return { category: 'about_yaseen', priority: 10 }
  }

  // Services
  if (/(service|what do you|what can you|offer|help me|kya kar|capability|expertise)/.test(t)) {
    return { category: 'services', priority: 9 }
  }

  // Projects
  if (/(project|portfolio|work|build|app|website|saas|ecommerce|demo|github)/.test(t)) {
    return { category: 'projects', priority: 9 }
  }

  // Contact
  if (/(contact|email|phone|whatsapp|reach|talk|call|message|hire|get in touch)/.test(t)) {
    return { category: 'contact', priority: 9 }
  }

  // Skills / Tech
  if (/(skill|tech|stack|language|framework|know|use|programming|code)/.test(t)) {
    return { category: 'skills', priority: 8 }
  }

  // Experience
  if (/(experience|background|education|study|university|student|degree|year)/.test(t)) {
    return { category: 'experience', priority: 8 }
  }

  // Pricing
  if (/(price|cost|rate|budget|charge|fee|how much|kitna)/.test(t)) {
    return { category: 'pricing', priority: 8 }
  }

  // Social
  if (/(social|instagram|facebook|tiktok|linkedin|github|follow)/.test(t)) {
    return { category: 'social', priority: 7 }
  }

  // Location
  if (/(where|location|city|country|peshawar|pakistan|live)/.test(t)) {
    return { category: 'location', priority: 7 }
  }

  // Thanks
  if (/(thank|thanks|shukriya|meherbani|appreciate)/.test(t)) {
    return { category: 'thanks', priority: 6 }
  }

  // Bye
  if (/(bye|goodbye|alvida|see you|chalta|tauba)/.test(t)) {
    return { category: 'bye', priority: 6 }
  }

  // Jokes
  if (/(joke|funny|laugh|hasa|maza|humor)/.test(t)) {
    return { category: 'joke', priority: 5 }
  }

  // Compliments
  if (/(nice|great|awesome|amazing|best|beautiful|love|cute|pretty)/.test(t)) {
    return { category: 'compliment', priority: 5 }
  }

  // Availability
  if (/(available|free|busy|schedule|time|when|start|join)/.test(t)) {
    return { category: 'availability', priority: 7 }
  }

  // Hire
  if (/(hire|work with|project|commission|build for|make for|develop)/.test(t)) {
    return { category: 'hire', priority: 9 }
  }

  // MERN Stack
  if (/(mern|mongodb|express|react|node\.js|full.?stack|mean|tech stack)/.test(t)) {
    return { category: 'mern', priority: 7 }
  }

  // Fallback
  return { category: 'fallback', priority: 0 }
}

function getResponse(intent, _conversationCount) {
  const responses = {
    greeting: [
      `Hey there! 🌸 I'm ${BOT_NAME}, Yaseen's cute assistant! How can I help you today?`,
      `Hellooo! ✨ Welcome! I'm ${BOT_NAME} — ask me anything about Yaseen or his work!`,
      `Hi hi! 🎀 So nice to see you! I'm here to help you learn about Yaseen Ahmad!`,
      `Salaam! 🌺 I'm ${BOT_NAME}, your friendly guide! What would you like to know?`,
    ],
    identity: [
      `I'm ${BOT_NAME} 🤖💕 — Yaseen Ahmad's personal AI assistant! I'm not powered by any API (I'm locally smart 🧠), and I'm here to guide you through everything about Yaseen — his skills, projects, services, and how to reach him!`,
      `My name is ${BOT_NAME}! ✨ I'm a locally intelligent bot (no cloud needed ☁️❌) created to help you explore Yaseen's portfolio. Ask me anything!`,
    ],
    about_yaseen: [
      `Yaseen Ahmad is a passionate Full-Stack Developer from Peshawar, Pakistan! 🇵🇰 He's a Software Engineering student who builds production-grade SaaS apps with Next.js, React, TypeScript & more. He's skilled in both frontend magic ✨ and backend power 🔧!`,
      `Yaseen is a Full-Stack Developer who loves building real products! From SaaS dashboards to e-commerce platforms — he does it all. Check out the Projects section for his work! 💼`,
    ],
    services: [
      `Yaseen offers these amazing services 🛠️:\n\n🌐 Web Development (React, Next.js)\n📱 Mobile Development (React Native)\n⚡ Backend Engineering (Node.js, Express)\n🗄️ Database Design (PostgreSQL, MongoDB)\n🎨 UI/UX Design (Figma, Tailwind)\n☁️ SaaS Architecture\n\nWant details on any? Just ask! 😊`,
      `Here's what Yaseen can build for you 🚀:\n\n✅ Full-stack web apps\n✅ Mobile apps\n✅ REST & GraphQL APIs\n✅ Database design\n✅ Beautiful UIs\n✅ Complete SaaS products\n\nWhich one interests you? 🤔`,
    ],
    projects: [
      `Yaseen has built some incredible projects! 💼\n\n📊 SaaS Dashboard — Full admin panel with Stripe\n🛒 E-Commerce Platform — Modern online store\n🤖 AI Content Generator — GPT-powered tool\n💬 Social Media App — Real-time platform\n📝 Portfolio Generator — One-click builder\n✅ Task Management — Kanban board\n\nGo to the Projects section to see details! 🚀`,
    ],
    contact: [
      `Here's how to reach Yaseen 📬:\n\n📧 Email: yaseenahmad.exe@gmail.com\n📱 WhatsApp: +92 318 937 0042\n🔗 GitHub: github.com/MrYaseen0\n💼 LinkedIn: linkedin.com/in/yaseen-ahmad\n📸 Instagram: @yaseenahmadexe\n🎵 TikTok: @mryaseen.exe\n\nYou can also use the Contact section or the WhatsApp button! 💚`,
    ],
    skills: [
      `Yaseen's tech stack 🧰:\n\n🎨 Frontend: React, Next.js, TypeScript, Tailwind CSS\n⚙️ Backend: Node.js, Express.js, Python\n🗄️ Database: PostgreSQL, MongoDB, Prisma, Redis\n☁️ Cloud: Vercel, Railway, Supabase\n📱 Mobile: React Native, Expo\n🛠️ Tools: Git, Figma, Postman\n\nHe's always learning more! 📚`,
    ],
    experience: [
      `Yaseen is a Software Engineering student 💻🎓 who's been building real-world projects since early in his journey. He focuses on production-grade SaaS applications and has experience with full-stack development, from database design to deployment. He's actively building and learning every day! 🚀`,
    ],
    pricing: [
      `For pricing and project discussions 💰, it's best to reach out to Yaseen directly!\n\n📱 WhatsApp: +92 318 937 0042\n📧 Email: yaseenahmad.exe@gmail.com\n\nHe offers competitive rates and custom quotes based on project scope! 🤝`,
    ],
    hire: [
      `Want to hire Yaseen? 🚀 That's awesome! Click the "Hire Me" button in the navbar to fill out a quick project request form. He'll review it and get back to you within 24 hours! 📬\n\nYou can also reach him directly:\n📱 WhatsApp: +92 318 937 0042\n📧 Email: yaseenahmad.exe@gmail.com`,
      `Great choice! 💕 To hire Yaseen, use the "Hire Me" button at the top of the page — it's a simple 3-step form where you share your project details, budget, and timeline. Yaseen will respond quickly! ⚡`,
    ],
    mern: [
      `Yaseen is a MERN stack expert! 🔥\n\n🟨 MongoDB — Schema design, aggregation, indexing\n🟢 Express.js — REST APIs, middleware, auth\n🔴 React — Hooks, Context, Framer Motion, Next.js\n🟩 Node.js — Server logic, WebSockets, jobs\n\nHe also works with PostgreSQL, Prisma, TypeScript, and deploys on Vercel, Railway & Supabase! 💪`,
      `The MERN stack is Yaseen's bread and butter! 🍞\n\nMongoDB + Express + React + Node.js = Full-stack JavaScript power! ⚡\n\nHe builds production apps with this stack daily — from SaaS dashboards to real-time social apps. Check his Projects section! 🚀`,
    ],
    social: [
      `Here are all of Yaseen's social links 🔗:\n\n💻 GitHub: github.com/MrYaseen0\n💼 LinkedIn: linkedin.com/in/yaseen-ahmad-489967280\n📸 Instagram: @yaseenahmadexe\n📘 Facebook: facebook.com/share/1HN9vegPhd/\n🎵 TikTok: @mryaseen.exe\n\nGive him a follow! 🌟`,
    ],
    location: [
      `Yaseen is based in Peshawar, Pakistan 🇵🇰📍 — but he works with clients worldwide! 🌍 His location doesn't limit his reach at all!`,
    ],
    thanks: [
      `You're welcome! 🌸 Happy to help!`,
      `Aww, anytime! 💕 Feel free to ask more!`,
      `No problem at all! 😊 I'm here if you need anything else!`,
      `My pleasure! 🎀 Don't hesitate to ask!`,
    ],
    bye: [
      `Goodbye! 👋🌸 It was great chatting with you! Come back anytime!`,
      `See you later! 💕 Hope I helped! Don't forget to check out Yaseen's work!`,
      `Bye bye! ✨ Have an amazing day! 🌺`,
    ],
    joke: [
      `Why do programmers prefer dark mode? Because light attracts bugs! 🐛😄`,
      `Why did the developer go broke? Because he used up all his cache! 💸😂`,
      `How many programmers does it take to change a light bulb? None — that's a hardware problem! 💡🤣`,
      `What's a programmer's favorite hangout place? Foo Bar! 🍺😄`,
    ],
    compliment: [
      `Aww, that's so sweet! 🥰 You're pretty amazing too!`,
      `Thank you! 💕 That means a lot! Yaseen would be happy to hear that!`,
      `You're making me blush! 🌸 — well, blushing is hard when you're a bot, but still! 😄`,
    ],
    availability: [
      `Yaseen is actively available for projects! 🟢\n\nYou can reach him via:\n📱 WhatsApp: +92 318 937 0042\n📧 Email: yaseenahmad.exe@gmail.com\n\nHe typically responds within a few hours! ⚡`,
    ],
    fallback: [
      `Hmm, that's an interesting question! 🤔 I'm not sure I fully understand, but I can help you with:\n\n• About Yaseen\n• His services & skills\n• His projects\n• How to contact him\n• Social links\n\nTry asking about one of these! 🌸`,
      `I'm not quite sure about that 🧐, but I know a lot about Yaseen! Ask me about his work, skills, or how to reach him! 💕`,
      `Oops, that went over my cute little head! 🙈 Try asking about Yaseen's projects, services, or contact info! 🌟`,
    ],
  }

  const pool = responses[intent.category] || responses.fallback
  return pool[Math.floor(Math.random() * pool.length)]
}

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 0' }}>
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 0.5, delay: i * 0.12, repeat: Infinity }}
          style={{
            width: 6, height: 6, borderRadius: '50%',
            background: '#E84393',
          }}
        />
      ))}
    </div>
  )
}

function FloatingHearts() {
  return (
    <div style={{ position: 'absolute', top: -10, right: -10, pointerEvents: 'none' }}>
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 0, x: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            y: [-10, -35 - i * 10],
            x: [0, (i - 1) * 12],
            scale: [0, 0.6 + i * 0.15, 0],
          }}
          transition={{ duration: 2, delay: i * 0.4, repeat: Infinity, repeatDelay: 3 }}
        >
          <Heart size={12} color="#E84393" fill="#E84393" />
        </motion.div>
      ))}
    </div>
  )
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [unread, setUnread] = useState(0)
  const [showQuick, setShowQuick] = useState(true)
  const [pulse] = useState(true)
  const chatRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    const greet = {
      id: 1,
      role: 'bot',
      text: `Hi there! 🌸 I'm ${BOT_NAME}, ${BOT_TAGLINE}! How can I help you today?`,
      time: new Date(),
    }
    setMessages([greet])
  }, [])

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [messages, isTyping])

  useEffect(() => {
    if (isOpen) {
      setUnread(0)
      const timer = setTimeout(() => inputRef.current?.focus(), 300)
      const handleKeyDown = (e) => {
        if (e.key !== 'Tab' || !chatRef.current) return
        const chatWindow = chatRef.current.closest('.yi-chatbot')
        if (!chatWindow) return
        const focusable = chatWindow.querySelectorAll('input, button, [tabindex]:not([tabindex="-1"])')
        if (focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey) {
          if (document.activeElement === first) { e.preventDefault(); last.focus() }
        } else {
          if (document.activeElement === last) { e.preventDefault(); first.focus() }
        }
      }
      document.addEventListener('keydown', handleKeyDown)
      return () => { clearTimeout(timer); document.removeEventListener('keydown', handleKeyDown) }
    }
  }, [isOpen])

  const send = (text) => {
    if (!text.trim()) return

    const userMsg = {
      id: Date.now(),
      role: 'user',
      text: text.trim(),
      time: new Date(),
    }

    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)
    setShowQuick(false)

    const intent = detectIntent(text)
    const delay = 600 + Math.random() * 800

    setTimeout(() => {
      const reply = getResponse(intent, messages.length)
      const botMsg = {
        id: Date.now() + 1,
        role: 'bot',
        text: reply,
        time: new Date(),
      }
      setMessages(prev => [...prev, botMsg])
      setIsTyping(false)
      if (!isOpen) setUnread(prev => prev + 1)
    }, delay)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    send(input)
  }

  return (
    <>
      {/* FAB Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            aria-label="Open chat assistant"
            className="yi-fab"
          >
            <motion.div
              animate={pulse ? {
                boxShadow: [
                  '0 0 0 0 rgba(232,67,147,0.4)',
                  '0 0 0 14px rgba(232,67,147,0)',
                ],
              } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{
                width: 62,
                height: 62,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #E84393, #FD79A8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                position: 'relative',
              }}
            >
              <YI_MASCOT />
              {unread > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{
                    position: 'absolute',
                    top: -2,
                    right: -2,
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    background: '#FF4757',
                    color: 'white',
                    fontSize: 11,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid white',
                  }}
                >
                  {unread}
                </motion.div>
              )}
              <FloatingHearts />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="yi-chatbot"
            style={{
              position: 'fixed',
              bottom: 90,
              right: 20,
              width: 380,
              maxHeight: 600,
              background: '#FFFFFF',
              borderRadius: 24,
              border: '1.5px solid #F8C8DC',
              boxShadow: '0 16px 64px rgba(232,67,147,0.18), 0 2px 12px rgba(0,0,0,0.06)',
              zIndex: 1001,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{
              background: 'linear-gradient(135deg, #E84393 0%, #FD79A8 100%)',
              padding: '18px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <YI_MASCOT />
                </motion.div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 17, color: 'white', display: 'flex', alignItems: 'center', gap: 6 }}>
                    {BOT_NAME} <Sparkles size={14} color="#FFD700" />
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)' }}>
                    <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: '#7CFC00', marginRight: 5 }} />
                    Online now
                  </div>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(false)}
                style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 10, width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}
              >
                <X size={18} />
              </motion.button>
            </div>

            {/* Messages */}
            <div
              ref={chatRef}
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                background: '#FFF9F5',
                minHeight: 320,
                maxHeight: 400,
              }}
            >
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.25 }}
                  style={{
                    display: 'flex',
                    justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    alignItems: 'flex-end',
                    gap: 8,
                  }}
                >
                  {msg.role === 'bot' && (
                    <div style={{
                      width: 30,
                      height: 30,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #E84393, #FD79A8)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      fontSize: 14,
                    }}>
                      <BotMessageSquare size={14} color="white" />
                    </div>
                  )}
                  <div style={{
                    maxWidth: '78%',
                    padding: '12px 16px',
                    borderRadius: msg.role === 'user'
                      ? '18px 18px 4px 18px'
                      : '18px 18px 18px 4px',
                    background: msg.role === 'user'
                      ? 'linear-gradient(135deg, #E84393, #FD79A8)'
                      : '#FFFFFF',
                    color: msg.role === 'user' ? '#FFFFFF' : '#1A1A2E',
                    fontSize: 14,
                    lineHeight: 1.6,
                    border: msg.role === 'bot' ? '1px solid #F0E6DE' : 'none',
                    boxShadow: msg.role === 'user'
                      ? '0 2px 12px rgba(232,67,147,0.2)'
                      : '0 1px 6px rgba(0,0,0,0.04)',
                    whiteSpace: 'pre-line',
                  }}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                >
                  <div style={{
                    width: 30, height: 30, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #E84393, #FD79A8)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <BotMessageSquare size={14} color="white" />
                  </div>
                  <div style={{
                    padding: '10px 16px',
                    background: '#FFFFFF',
                    borderRadius: '18px 18px 18px 4px',
                    border: '1px solid #F0E6DE',
                  }}>
                    <TypingIndicator />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Quick Replies */}
            <AnimatePresence>
              {showQuick && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{
                    padding: '8px 16px',
                    display: 'flex',
                    gap: 6,
                    flexWrap: 'wrap',
                    background: '#FFF9F5',
                    borderTop: '1px solid #F0E6DE',
                  }}
                >
                  {QUICK_REPLIES.map((qr) => (
                    <motion.button
                      key={qr.label}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => send(qr.msg)}
                      style={{
                        padding: '7px 12px',
                        background: '#FFFFFF',
                        border: '1px solid #F8C8DC',
                        borderRadius: 100,
                        fontSize: 12,
                        fontWeight: 500,
                        color: '#E84393',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                        whiteSpace: 'nowrap',
                      }}
                      className="yi-quick-reply"
                    >
                      {qr.label}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              style={{
                padding: '12px 16px',
                display: 'flex',
                gap: 8,
                background: '#FFFFFF',
                borderTop: '1px solid #F0E6DE',
              }}
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  background: '#FFF9F5',
                  border: '1.5px solid #F0E6DE',
                  borderRadius: 14,
                  fontSize: 14,
                  color: '#1A1A2E',
                  outline: 'none',
                  fontFamily: 'inherit',
                  transition: 'border-color 0.2s',
                }}
                className="yi-input"
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.92 }}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  background: 'linear-gradient(135deg, #E84393, #FD79A8)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'white',
                  flexShrink: 0,
                  boxShadow: '0 2px 10px rgba(232,67,147,0.3)',
                }}
              >
                <Send size={18} />
              </motion.button>
            </form>

            {/* Footer */}
            <div style={{
              padding: '8px 16px',
              textAlign: 'center',
              fontSize: 11,
              color: '#B0B0C8',
              background: '#FFFFFF',
              borderTop: '1px solid #F0E6DE',
            }}>
              Powered by <span style={{ color: '#E84393', fontWeight: 600 }}>YI</span> • Made with 💕 by Yaseen
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .yi-fab {
          position: fixed;
          bottom: 28px;
          right: 28px;
          z-index: 999;
          border: none;
          background: none;
          cursor: pointer;
          padding: 0;
        }
        .yi-input:focus {
          border-color: #E84393 !important;
          box-shadow: 0 0 0 3px rgba(232,67,147,0.08);
          background: #FFFFFF !important;
        }
        .yi-input::placeholder { color: #C0B8D0; }
        .yi-quick-reply:hover {
          background: #FFF0F6 !important;
          border-color: #E84393 !important;
        }
        @media (max-width: 480px) {
          .yi-chatbot {
            width: calc(100vw - 16px) !important;
            right: 8px !important;
            bottom: 80px !important;
            max-height: 75vh !important;
            border-radius: 18px !important;
          }
          .yi-fab {
            bottom: 16px !important;
            right: 16px !important;
          }
        }
      `}</style>
    </>
  )
}
