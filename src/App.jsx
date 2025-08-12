import React, { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import familyPhoto from './assets/family-photo.jpg'
import FamilyTree from './components/FamilyTree'
import FamilyCalendar from './components/FamilyCalendar'
import FamilyStats from './components/FamilyStats'
import './App.css'

function App() {
  const { scrollY } = useScroll()
  const [currentSection, setCurrentSection] = useState(0)

  // Transformações para o scroll
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0])
  const heroY = useTransform(scrollY, [0, 400], [0, -100])
  const secondSectionY = useTransform(scrollY, [200, 800], [100, 0])
  const secondSectionOpacity = useTransform(scrollY, [200, 600], [0, 1])

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const windowHeight = window.innerHeight
      const section = Math.floor(scrollPosition / windowHeight)
      setCurrentSection(section)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      {/* Seção 1 - Hero */}
      <motion.section 
        className="h-screen flex flex-col items-center justify-center relative bg-gradient-to-br from-gray-50 to-white"
        style={{ opacity: heroOpacity, y: heroY }}
      >
        <div className="text-center z-10">
          <motion.h1 
            className="text-6xl md:text-8xl font-thin text-gray-900 mb-4 tracking-tight"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            Família Tanja
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl font-light text-gray-600 tracking-wide"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            História e Legado
          </motion.p>
        </div>
        
        {/* Indicador de scroll */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2"></div>
          </div>
        </motion.div>
      </motion.section>

      {/* Seção 2 - História dos Avós */}
      <motion.section 
        className="min-h-screen flex items-center justify-center relative"
        style={{ y: secondSectionY, opacity: secondSectionOpacity }}
      >
        {/* Background com imagem e blur */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(${familyPhoto})`,
            filter: 'blur(3px) brightness(0.3)'
          }}
        />
        
        {/* Overlay escuro */}
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        
        {/* Conteúdo */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-thin mb-8 tracking-tight">
              Nossa História
            </h2>
            <div className="text-lg md:text-xl font-light leading-relaxed space-y-6">
              <p>
                A história deste braço da Família Tanja começa da união do Sr. [Nome do Avô] 
                e da Srta. [Nome da Avó], duas almas que se encontraram em uma época onde 
                o amor verdadeiro era construído com paciência e dedicação.
              </p>
              <p>
                Deles, hoje temos um legado extraordinário de <span className="font-medium text-blue-300">[X] descendentes diretos</span> e 
                mais <span className="font-medium text-blue-300">[Y] indiretos</span>, espalhados pelo mundo, 
                mas unidos pelos laços invisíveis da família e pelos valores que eles plantaram.
              </p>
              <p>
                Cada geração carrega consigo as histórias, os sonhos e a força 
                que nossos patriarcas nos deixaram como herança mais preciosa.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Seção 3 - Árvore Genealógica */}
      <FamilyTree />

      {/* Seção 4 - Calendário */}
      <FamilyCalendar />

      {/* Seção 5 - Estatísticas */}
      <FamilyStats />
    </div>
  )
}

export default App

