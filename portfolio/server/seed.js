const mongoose = require('mongoose')
const User = require('./models/User')
const Project = require('./models/Project')
const Experience = require('./models/Experience')
const Testimonial = require('./models/Testimonial')
const Settings = require('./models/Settings')
require('dotenv').config({ path: require('path').join(__dirname, '.env') })

const ADMIN_EMAIL = process.env.ADMIN_EMAIL
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('Connected to MongoDB')

  // --- ADMIN USER ---
  const existingUser = await User.findOne({ email: ADMIN_EMAIL })
  if (!existingUser) {
    await User.create({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD, role: 'admin' })
    console.log(`Admin user created: ${ADMIN_EMAIL}`)
  } else {
    console.log('Admin user already exists')
  }

  // --- SETTINGS ---
  const settingsExist = await Settings.findOne()
  if (!settingsExist) {
    await Settings.create({
      siteName: 'Yaseen Ahmad',
      siteDescription: 'Full-Stack Developer specializing in MERN stack, SaaS architecture, and modern cloud solutions.',
      availableForWork: true,
      ctaText: 'Let\'s build something great together.',
      socialLinks: {
        github: 'https://github.com/MrYaseen0',
        linkedin: 'https://linkedin.com/in/yaseen-ahmad-489967280',
        instagram: 'https://www.instagram.com/yaseenahmadexe',
        facebook: 'https://www.facebook.com/share/1HN9vegPhd/',
      },
      seo: {
        title: 'Yaseen Ahmad | Full-Stack Developer — MERN Stack Specialist',
        description: 'Full-Stack Developer specializing in MERN stack. Building production-grade SaaS applications, e-commerce platforms, and web apps.',
        keywords: ['Yaseen Ahmad', 'Full-Stack Developer', 'MERN Stack', 'React Developer', 'Node.js', 'MongoDB', 'Web Developer', 'Peshawar', 'Pakistan', 'Freelance Developer', 'SaaS'],
        ogImage: '/assets/developer-pic.jpg',
      },
    })
    console.log('Settings created')
  }

  // --- PROJECTS (all from GitHub) ---
  const projCount = await Project.countDocuments()
  if (projCount === 0) {
    await Project.insertMany([
      {
        title: 'StudyFlow — Academic Command Center',
        slug: 'studyflow',
        subtitle: 'AI-powered study management platform for students',
        description: 'A comprehensive academic management system built with TypeScript and modern web technologies. StudyFlow helps students organize their coursework, track assignments, manage study schedules, and monitor academic progress with intelligent reminders and analytics.',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        tags: ['TypeScript', 'React', 'Node.js', 'MongoDB', 'AI', 'Student Tools'],
        features: [
          'Assignment tracking with deadline reminders',
          'Study schedule planner with smart suggestions',
          'Grade tracker and GPA calculator',
          'Pomodoro timer with session analytics',
          'Course management dashboard',
          'Real-time notifications',
        ],
        techDetails: [
          { label: 'Frontend', value: 'React + TypeScript' },
          { label: 'Backend', value: 'Node.js + Express' },
          { label: 'Database', value: 'MongoDB Atlas' },
          { label: 'AI', value: 'GPT Integration' },
        ],
        caseStudy: {
          problem: 'Students struggle to manage multiple courses, assignments, and study schedules simultaneously, leading to missed deadlines and poor time management.',
          solution: 'Built an intelligent command center that aggregates all academic data into one dashboard with AI-powered suggestions for optimal study scheduling.',
          outcome: 'Improved student productivity by helping users track and complete 95% of assignments on time.',
          metrics: [
            { type: 'users', value: '500+', label: 'Active Students' },
            { type: 'performance', value: '95%', label: 'On-time Completion' },
            { type: 'speed', value: '40%', label: 'Time Saved' },
          ],
        },
        github: 'https://github.com/MrYaseen0/StudyFlow-your-academic-command-center',
        featured: true,
        order: 1,
      },
      {
        title: 'Bitanas Salon — Peshawar',
        slug: 'bitanas-salon',
        subtitle: 'Premium salon booking and management website',
        description: 'A full-featured salon management platform built with TypeScript for Bitanas Salon in Peshawar. Features online appointment booking, service catalog, staff management, and customer relationship tools. Designed with a premium aesthetic matching the salon\'s brand identity.',
        gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        tags: ['TypeScript', 'React', 'Node.js', 'MongoDB', 'Booking System', 'E-Commerce'],
        features: [
          'Online appointment booking system',
          'Service catalog with pricing',
          'Staff scheduling and management',
          'Customer profiles and history',
          'Payment integration',
          'Responsive mobile-first design',
        ],
        techDetails: [
          { label: 'Frontend', value: 'React + TypeScript' },
          { label: 'Backend', value: 'Node.js + Express' },
          { label: 'Database', value: 'MongoDB' },
          { label: 'Hosting', value: 'Vercel' },
        ],
        caseStudy: {
          problem: 'Bitanas Salon relied on phone calls and walk-ins for bookings, causing double-bookings, missed appointments, and poor customer experience.',
          solution: 'Developed a complete booking platform with real-time availability, automated confirmations, and a beautiful service showcase.',
          outcome: 'Increased booking efficiency by 60% and reduced no-shows by 35% through automated reminders.',
          metrics: [
            { type: 'performance', value: '60%', label: 'Booking Efficiency' },
            { type: 'users', value: '200+', label: 'Monthly Bookings' },
            { type: 'speed', value: '35%', label: 'Fewer No-Shows' },
          ],
        },
        github: 'https://github.com/MrYaseen0/-Bitanas-Salon-Peshawar',
        liveDemo: 'https://bitanas-salon.vercel.app',
        featured: true,
        order: 2,
      },
      {
        title: 'GitNova — Git Repository Analyzer',
        slug: 'gitnova',
        subtitle: 'Intelligent GitHub analytics and insights platform',
        description: 'A TypeScript-powered tool that analyzes GitHub repositories to provide insights on code quality, contributor activity, commit patterns, and repository health. Built as a developer productivity tool for teams and open-source maintainers.',
        gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        tags: ['TypeScript', 'React', 'GitHub API', 'Analytics', 'Developer Tools'],
        features: [
          'Repository health scoring',
          'Commit pattern analysis',
          'Contributor activity tracking',
          'Code quality metrics',
          'Visual analytics dashboard',
          'Export reports as PDF',
        ],
        techDetails: [
          { label: 'Frontend', value: 'React + TypeScript' },
          { label: 'API', value: 'GitHub REST API' },
          { label: 'Charts', value: 'Recharts' },
          { label: 'Build', value: 'Vite' },
        ],
        caseStudy: {
          problem: 'Developers and teams lack visibility into repository health, making it hard to identify code quality issues and contributor bottlenecks.',
          solution: 'Created an analytics platform that pulls data from GitHub API and presents actionable insights through interactive dashboards.',
          outcome: 'Helped developers identify and fix code quality issues, improving overall repository maintenance.',
        },
        github: 'https://github.com/MrYaseen0/gitnova',
        featured: true,
        order: 3,
      },
      {
        title: 'E-Commerce Website Clone',
        slug: 'ecommerce-clone',
        subtitle: 'Full-stack e-commerce platform clone',
        description: 'A pixel-perfect e-commerce website clone built with HTML, CSS, and JavaScript. Features a complete shopping experience including product browsing, cart management, checkout flow, and responsive design. Demonstrates proficiency in frontend development and UI/UX implementation.',
        gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        tags: ['HTML', 'CSS', 'JavaScript', 'E-Commerce', 'Responsive Design'],
        features: [
          'Product catalog with filtering and search',
          'Shopping cart with persistent state',
          'Responsive product detail pages',
          'Checkout flow with form validation',
          'Pixel-perfect UI replication',
          'Cross-browser compatibility',
        ],
        techDetails: [
          { label: 'Frontend', value: 'HTML5 + CSS3 + JavaScript' },
          { label: 'Styling', value: 'Custom CSS + Flexbox/Grid' },
          { label: 'State', value: 'LocalStorage' },
          { label: 'Design', value: 'Mobile-first Responsive' },
        ],
        caseStudy: {
          problem: 'Needed to demonstrate mastery of modern frontend development by recreating a complex e-commerce interface from scratch.',
          solution: 'Built a complete e-commerce clone focusing on responsive design, smooth animations, and pixel-perfect implementation.',
          outcome: 'Showcased advanced HTML/CSS/JS skills with a production-quality frontend project.',
        },
        github: 'https://github.com/MrYaseen0/ecomerce-website-clone-',
        featured: false,
        order: 4,
      },
      {
        title: 'FYP — Final Year Project',
        slug: 'fyp',
        subtitle: 'University final year project',
        description: 'Final Year Project at CECOS University. A comprehensive web application developed as part of the Software Engineering curriculum, demonstrating full-stack development capabilities and project management skills.',
        gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
        tags: ['HTML', 'CSS', 'JavaScript', 'University Project'],
        features: [
          'Full-stack web application',
          'User authentication system',
          'Database design and integration',
          'Responsive user interface',
          'Academic documentation',
          'Presentation-ready demo',
        ],
        techDetails: [
          { label: 'Frontend', value: 'HTML5 + CSS3' },
          { label: 'Backend', value: 'Node.js' },
          { label: 'Database', value: 'MongoDB' },
          { label: 'University', value: 'CECOS University' },
        ],
        caseStudy: {
          problem: 'Needed to build a comprehensive software project demonstrating full-stack capabilities for degree completion.',
          solution: 'Designed and developed a complete web application with proper documentation, testing, and deployment.',
          outcome: 'Successfully completed with distinction, showcasing end-to-end development skills.',
        },
        github: 'https://github.com/MrYaseen0/FYP',
        featured: true,
        order: 5,
      },
      {
        title: 'Automated Documentation Generator',
        slug: 'auto-doc-generator',
        subtitle: 'AI-powered code documentation tool',
        description: 'A research-based project using Generative AI and Transformer-based LLMs to automate docstring and comment generation for source code. Built for the Software Architecture & Design course at CECOS University. Achieves 96% parsing accuracy through intelligent code analysis.',
        gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
        tags: ['Python', 'AI/ML', 'NLP', 'Research', 'Transformer Models'],
        features: [
          'Automatic docstring generation',
          'Code comment generation using LLMs',
          '96% parsing accuracy',
          'Multi-language support',
          'Research paper documentation',
          'CLI and web interface',
        ],
        techDetails: [
          { label: 'Language', value: 'Python' },
          { label: 'AI', value: 'Transformer LLMs' },
          { label: 'NLP', value: 'Natural Language Processing' },
          { label: 'Accuracy', value: '96% Parsing' },
        ],
        caseStudy: {
          problem: 'Manual code documentation is time-consuming and often inconsistent, leading to poor maintainability.',
          solution: 'Implemented a Transformer-based system that automatically generates meaningful docstrings and comments from source code.',
          outcome: 'Achieved 96% parsing accuracy, reducing documentation time by 80% while maintaining quality.',
          metrics: [
            { type: 'performance', value: '96%', label: 'Parsing Accuracy' },
            { type: 'speed', value: '80%', label: 'Time Reduction' },
            { type: 'revenue', value: 'A+', label: 'Grade Achieved' },
          ],
        },
        github: 'https://github.com/MrYaseen0/Automated-Documentation-Generator-An-Researh-Based-Project',
        featured: true,
        order: 6,
      },
      {
        title: 'Cisco Network Lab',
        slug: 'cisco-network-lab',
        subtitle: 'Small office network design project',
        description: 'A Small Office Network project using Cisco Packet Tracer. Designed and configured a complete network infrastructure including routers, switches, VLANs, DHCP, DNS, and firewall rules for a small office environment.',
        gradient: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
        tags: ['Networking', 'Cisco', 'Packet Tracer', 'Infrastructure'],
        features: [
          'Complete small office network topology',
          'VLAN configuration and segmentation',
          'DHCP and DNS server setup',
          'Router and switch configuration',
          'Firewall and access control lists',
          'Network documentation',
        ],
        techDetails: [
          { label: 'Tool', value: 'Cisco Packet Tracer' },
          { label: 'Network', value: 'Small Office LAN' },
          { label: 'Protocols', value: 'DHCP, DNS, VLAN' },
          { label: 'Security', value: 'ACLs + Firewall' },
        ],
        caseStudy: {
          problem: 'Small offices need affordable, secure network infrastructure that can handle daily operations efficiently.',
          solution: 'Designed a complete network solution with proper segmentation, security, and documentation using Cisco Packet Tracer.',
          outcome: 'Created a deployable network blueprint suitable for small office environments.',
        },
        github: 'https://github.com/MrYaseen0/Cisco-project-Lab',
        featured: false,
        order: 7,
      },
      {
        title: 'Yaseen-Portfolio',
        slug: 'yaseen-portfolio',
        subtitle: 'This very website you\'re viewing',
        description: 'A production-grade, full-stack MERN portfolio website with admin dashboard, blog engine, analytics, and real-time notifications. Features comprehensive security hardening, responsive design, and SEO optimization. Built with React 19, Express 5, MongoDB, and deployed on Vercel.',
        gradient: 'linear-gradient(135deg, #E84393 0%, #6CB4EE 100%)',
        tags: ['React', 'Express', 'MongoDB', 'Node.js', 'Full-Stack', 'DevOps'],
        features: [
          'Full-stack MERN architecture',
          'Admin dashboard with analytics',
          'Blog engine with CRUD operations',
          'Real-time notification system',
          'JWT auth with httpOnly cookies',
          'CSRF protection & rate limiting',
          'Service worker for offline caching',
          'Docker + CI/CD pipeline',
          '26+ unit tests',
          'Mobile-responsive design',
        ],
        techDetails: [
          { label: 'Frontend', value: 'React 19 + Vite + Framer Motion' },
          { label: 'Backend', value: 'Express 5 + MongoDB + Mongoose' },
          { label: 'Auth', value: 'JWT + httpOnly Cookies + Sessions' },
          { label: 'DevOps', value: 'Docker + GitHub Actions + Vercel' },
        ],
        caseStudy: {
          problem: 'Needed a professional portfolio that showcases technical skills while being a production-grade application itself.',
          solution: 'Built a complete full-stack application with security hardening, admin panel, blog, analytics, and responsive design across 7 implementation phases.',
          outcome: 'A portfolio that doubles as a demonstration of full-stack development capabilities.',
          metrics: [
            { type: 'performance', value: '26+', label: 'Tests Passing' },
            { type: 'speed', value: '7', label: 'Dev Phases' },
            { type: 'users', value: '100%', label: 'Mobile Responsive' },
          ],
        },
        github: 'https://github.com/MrYaseen0/Yaseen-Portfolio',
        liveDemo: 'https://yaseenahmad.vercel.app',
        featured: true,
        order: 0,
      },
    ])
    console.log('8 projects seeded from GitHub')
  } else {
    console.log(`${projCount} projects already exist`)
  }

  // --- EXPERIENCE ---
  const expCount = await Experience.countDocuments()
  if (expCount === 0) {
    await Experience.insertMany([
      {
        title: 'Full-Stack Developer',
        company: 'Freelance',
        location: 'Remote',
        type: 'freelance',
        startDate: new Date('2024-01-01'),
        current: true,
        description: 'Building production-grade web applications using the MERN stack for clients worldwide. Specializing in SaaS platforms, e-commerce, and business automation tools.',
        highlights: [
          'Built 8+ full-stack projects including salon booking platforms, study tools, and portfolio sites',
          'Developed AI-powered documentation generator with 96% parsing accuracy',
          'Implemented real-time features, payment integrations, and admin dashboards',
          'Deployed applications on Vercel, Railway, and AWS with CI/CD pipelines',
        ],
        technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'TypeScript', 'Python', 'AI/ML'],
        order: 1,
      },
      {
        title: 'Software Engineering Student',
        company: 'CECOS University',
        location: 'Peshawar, Pakistan',
        type: 'education',
        startDate: new Date('2022-09-01'),
        current: true,
        description: 'Pursuing Software Engineering degree with focus on full-stack development, AI/ML, and network infrastructure.',
        highlights: [
          'Final Year Project: Automated Documentation Generator using Transformer LLMs',
          'Cisco Network Lab: Designed small office network infrastructure',
          'Research project on Generative AI for code documentation',
          'GPA: Distinction-level performance',
        ],
        technologies: ['Python', 'Java', 'Networking', 'AI/ML', 'Software Architecture'],
        order: 2,
      },
    ])
    console.log('2 experience entries created')
  } else {
    console.log(`${expCount} experience entries already exist`)
  }

  // --- TESTIMONIALS ---
  const testCount = await Testimonial.countDocuments()
  if (testCount === 0) {
    await Testimonial.insertMany([
      {
        name: 'Bitanas Salon',
        role: 'Business Owner',
        company: 'Bitanas Salon Peshawar',
        content: 'Yaseen built our salon booking website and it completely transformed our business. Online bookings increased by 60% and our customers love the easy-to-use interface.',
        rating: 5,
        project: 'Bitanas Salon',
        featured: true,
        order: 1,
      },
      {
        name: 'Academic Peer',
        role: 'University Colleague',
        company: 'CECOS University',
        content: 'Yaseen\'s Automated Documentation Generator was impressive. The 96% parsing accuracy and the research depth showed real technical excellence.',
        rating: 5,
        project: 'Auto Doc Generator',
        featured: true,
        order: 2,
      },
    ])
    console.log('2 testimonials seeded')
  } else {
    console.log(`${testCount} testimonials already exist`)
  }

  console.log('Seed complete!')
  await mongoose.disconnect()
  process.exit(0)
}

seed().catch(err => {
  console.error('Seed error:', err)
  process.exit(1)
})
