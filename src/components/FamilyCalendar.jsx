import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Calendar, ChevronLeft, ChevronRight, Gift, Heart, Clock } from 'lucide-react'
import { useFamilyData } from '../hooks/useFamilyData'
import { generateFamilyEvents, calculateAge } from '../utils/familyUtils'

const FamilyCalendar = () => {
  const { familyData, loading, error } = useFamilyData()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState('month') // 'month' ou 'year'

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]

  const today = new Date()
  
  const allFamilyEvents = useMemo(() => {
    if (loading || error) return []
    return generateFamilyEvents(familyData)
  }, [familyData, loading, error])

  // Filtrar eventos próximos (próximos 60 dias)
  const upcomingEvents = useMemo(() => {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setUTCDate(now.getUTCDate() + 60);
    return allFamilyEvents
      .filter(event => {
        const eventDate = new Date(event.data + 'T00:00:00Z');
        const eventDateThisYear = new Date(Date.UTC(now.getUTCFullYear(), eventDate.getUTCMonth(), eventDate.getUTCDate()));
        return eventDateThisYear >= now && eventDateThisYear <= futureDate;
      })
      .sort((a, b) => new Date(a.data) - new Date(b.data))
      .slice(0, 5);
  }, [allFamilyEvents]);

  // Obter eventos do mês atual
  const getCurrentMonthEvents = () => {
    const year = currentDate.getUTCFullYear();
    const month = currentDate.getUTCMonth();
    return allFamilyEvents.filter(event => {
      const eventDate = new Date(event.data + 'T00:00:00Z');
      return eventDate.getUTCMonth() === month && eventDate.getUTCFullYear() === year; // Adicione year pra precisão
    });
  };

  // Obter eventos do ano atual
  const getCurrentYearEvents = () => {
    const year = currentDate.getFullYear()
    
    return allFamilyEvents.filter(event => {
      const eventDate = new Date(event.data)
      return eventDate.getFullYear() === year
    })
  }

  // Navegar entre meses/anos
  const navigateDate = (direction) => {
    const newDate = new Date(currentDate)
    
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + direction)
    } else {
      newDate.setFullYear(newDate.getFullYear() + direction)
    }
    
    setCurrentDate(newDate)
  }

  // Renderizar calendário mensal
  const renderMonthCalendar = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    const dayEvents = monthEvents.filter(event => new Date(event.data + 'T00:00:00Z').getUTCDate() === day);
    const isToday = today.getUTCFullYear() === year && today.getUTCMonth() === month && today.getUTCDate() === day;
    
    const days = []
    const monthEvents = getCurrentMonthEvents()
    
    // Dias vazios no início
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-gray-200"></div>)
    }
    
    // Dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = monthEvents.filter(event => {
        const eventDate = new Date(event.data)
        return eventDate.getDate() === day
      })
      
      const isToday = today.getFullYear() === year && 
                     today.getMonth() === month && 
                     today.getDate() === day
      
      days.push(
        <div key={day} className={`h-24 border border-gray-200 p-2 ${isToday ? 'bg-blue-50' : 'bg-white'}`}>
          <div className={`text-sm font-medium ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
            {day}
          </div>
          <div className="mt-1 space-y-1">
            {dayEvents.map((event, index) => (
              <div 
                key={index}
                className={`text-xs px-2 py-1 rounded-full ${
                  event.tipo === 'aniversario' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-purple-100 text-purple-800'
                }`}
              >
                {event.tipo === 'aniversario' ? '🎂' : '🕊️'} {event.nome.split(' ')[0]}
              </div>
            ))}
          </div>
        </div>
      )
    }
    
    return (
      <div className="grid grid-cols-7 gap-0 border border-gray-200 rounded-lg overflow-hidden">
        {/* Cabeçalho dos dias da semana */}
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
          <div key={day} className="bg-gray-100 p-3 text-center font-medium text-gray-700 border-b border-gray-200">
            {day}
          </div>
        ))}
        {days}
      </div>
    )
  }

  // Renderizar calendário anual
  const renderYearCalendar = () => {
    const yearEvents = getCurrentYearEvents()
    const eventsByMonth = {}
    
    allFamilyEvents.forEach(event => {
      const eventDate = new Date(event.data)
      if (eventDate.getFullYear() === currentDate.getFullYear()) {
        const month = eventDate.getMonth()
        if (!eventsByMonth[month]) eventsByMonth[month] = []
        eventsByMonth[month].push(event)
      }
    })
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {monthNames.map((monthName, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="font-medium text-gray-900 mb-3">{monthName}</h3>
            <div className="space-y-2">
              {eventsByMonth[index] ? eventsByMonth[index].map((event, eventIndex) => (
                <div key={eventIndex} className="flex items-center gap-2 text-sm">
                  {event.tipo === 'aniversario' ? (
                    <Gift size={14} className="text-green-500" />
                  ) : (
                    <Heart size={14} className="text-purple-500" />
                  )}
                  <span className="text-gray-700">
                    {new Date(event.data).getDate()} - {event.nome.split(' ')[0]}
                    {event.tipo === 'aniversario' && (
                      <span className="text-gray-500 ml-1">({event.falecido ? `Faria ${calculateAge(event.data, event.anoFalecimento)}` : `${calculateAge(event.data)}`} anos)</span>
                    )}
                  </span>
                </div>
              )) : (
                <p className="text-gray-400 text-sm">Nenhum evento</p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    )
  }

  const formatEventDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', { 
      day: 'numeric', 
      month: 'long' 
    })
  }

  const getDaysUntilEvent = (dateString) => {
    const eventDate = new Date(dateString)
    const today = new Date()
    const diffTime = eventDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white py-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando calendário...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white py-16 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Erro ao carregar calendário: {error}</p>
          <p className="text-gray-600">Exibindo dados de exemplo ou vazios.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-thin mb-4 text-gray-900 tracking-tight">
            Calendário Familiar
          </h2>
          <p className="text-xl text-gray-600 font-light">
            Acompanhe os momentos importantes da nossa família
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendário principal */}
          <div className="lg:col-span-2">
            {/* Controles de navegação */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigateDate(-1)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                
                <h3 className="text-2xl font-light text-gray-900">
                  {viewMode === 'month' 
                    ? `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`
                    : currentDate.getFullYear()
                  }
                </h3>
                
                <button
                  onClick={() => navigateDate(1)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('month')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    viewMode === 'month' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Mês
                </button>
                <button
                  onClick={() => setViewMode('year')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    viewMode === 'year' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Ano
                </button>
              </div>
            </div>

            {/* Calendário */}
            {viewMode === 'month' ? renderMonthCalendar() : renderYearCalendar()}
          </div>

          {/* Sidebar com próximos eventos */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-6">
                <Clock size={20} className="text-blue-500" />
                <h3 className="text-xl font-medium text-gray-900">Próximos Eventos</h3>
              </div>
              
              <div className="space-y-4">
                {upcomingEvents.length > 0 ? upcomingEvents.map((event, index) => (
                  <motion.div
                    key={index}
                    className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-start gap-3">
                      {event.tipo === 'aniversario' ? (
                        <Gift size={18} className="text-green-500 mt-1" />
                      ) : (
                        <Heart size={18} className="text-purple-500 mt-1" />
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{event.nome}</h4>
                        <p className="text-sm text-gray-600">
                          {formatEventDate(event.data)}
                        </p>
                        {event.tipo === 'aniversario' && (
                          <p className="text-sm text-gray-500">
                            {event.falecido 
                              ? `Faria ${calculateAge(event.nascimento, event.falecimento ? new Date(event.falecimento).getFullYear() : new Date().getFullYear())} anos` 
                              : `${calculateAge(event.nascimento)} anos`
                            }
                          </p>
                        )}
                        {event.tipo === 'falecimento' && (
                          <p className="text-sm text-gray-500">
                            {event.anosDesde} anos desde que se foi
                          </p>
                        )}
                        <p className="text-xs text-blue-600 font-medium mt-1">
                          {getDaysUntilEvent(event.data) === 0 
                            ? 'Hoje!' 
                            : getDaysUntilEvent(event.data) === 1
                            ? 'Amanhã'
                            : `Em ${getDaysUntilEvent(event.data)} dias`
                          }
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )) : (
                  <p className="text-gray-500 text-center py-8">
                    Nenhum evento próximo
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FamilyCalendar

