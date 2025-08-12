import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { TrendingUp, Users, Calendar, MapPin, Heart, Award, Clock, Baby } from 'lucide-react'
import { useFamilyData } from '../hooks/useFamilyData'
import { calculateDetailedStats } from '../utils/familyUtils'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d']

const FamilyStats = () => {
  const { familyData, loading, error } = useFamilyData()

  const stats = useMemo(() => {
    if (loading || error) return null
    return calculateDetailedStats(familyData)
  }, [familyData, loading, error])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando estatísticas...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-16 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Erro ao carregar estatísticas: {error}</p>
          <p className="text-gray-600">Exibindo dados de exemplo ou vazios.</p>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-50 py-16 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-xl">Nenhuma estatística disponível.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-thin mb-4 text-gray-900 tracking-tight">
            Estatísticas da Família
          </h2>
          <p className="text-xl text-gray-600 font-light">
            Dados interessantes sobre nossa história familiar
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <motion.div
            className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Users size={36} className="text-blue-500 mb-3" />
            <h3 className="text-4xl font-semibold text-gray-900">{stats.totalMembers}</h3>
            <p className="text-gray-600">Total de Membros</p>
            <p className="text-sm text-gray-500">Registrados na árvore</p>
          </motion.div>

          <motion.div
            className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Heart size={36} className="text-green-500 mb-3" />
            <h3 className="text-4xl font-semibold text-gray-900">{stats.livingMembers}</h3>
            <p className="text-gray-600">Membros Vivos</p>
            <p className="text-sm text-gray-500">Atualmente</p>
          </motion.div>

          <motion.div
            className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Baby size={36} className="text-purple-500 mb-3" />
            <h3 className="text-4xl font-semibold text-gray-900">{stats.totalChildren}</h3>
            <p className="text-gray-600">Total de Filhos</p>
            <p className="text-sm text-gray-500">Média: {stats.averageChildren} por pessoa</p>
          </motion.div>

          <motion.div
            className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Calendar size={36} className="text-orange-500 mb-3" />
            <h3 className="text-4xl font-semibold text-gray-900">{stats.monthWithMostBirthdays}</h3>
            <p className="text-gray-600">Mês com Mais Aniversários</p>
            <p className="text-sm text-gray-500">Mês mais festivo</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          <motion.div
            className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-xl font-medium text-gray-900 mb-4">Aniversários por Mês</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.birthdayData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="aniversarios" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="text-xl font-medium text-gray-900 mb-4">Distribuição por Gênero</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.genderData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stats.genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" className="text-2xl font-bold">
                  {stats.genderData.reduce((sum, entry) => sum + entry.value, 0)}
                </text>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4">
              {stats.genderData.map((entry, index) => (
                <div key={index} className="flex items-center">
                  <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }}></span>
                  <span className="text-sm text-gray-700">{entry.name}: {entry.value} ({((entry.value / stats.totalMembers) * 100).toFixed(0)}%)</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          <motion.div
            className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h3 className="text-xl font-medium text-gray-900 mb-4">Crescimento da Família por Década</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.growthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="decade" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="nascimentos" stroke="#82ca9d" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <h3 className="text-xl font-medium text-gray-900 mb-4">Outras Estatísticas</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Clock size={20} className="text-blue-500" />
                <div>
                  <span className="font-medium">Pessoa Mais Velha:</span>
                  <p className="text-gray-600">{stats.oldestPerson.name} ({stats.oldestPerson.age} anos{stats.oldestPerson.isAlive ? '' : ' - falecido'})</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Baby size={20} className="text-pink-500" />
                <div>
                  <span className="font-medium">Pessoa Mais Nova:</span>
                  <p className="text-gray-600">{stats.youngestPerson.name} ({stats.youngestPerson.age} anos{stats.youngestPerson.isAlive ? '' : ' - falecido'})</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users size={20} className="text-green-500" />
                <div>
                  <span className="font-medium">Maior Diferença de Idade:</span>
                  <p className="text-gray-600">{stats.maxAgeDifference} anos entre irmãos da família {stats.maxAgeDifferenceFamily}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={20} className="text-purple-500" />
                <div>
                  <span className="font-medium">Locais de Nascimento Mais Comuns:</span>
                  <ul className="list-disc list-inside text-gray-600">
                    {stats.locationData.map((loc, index) => (
                      <li key={index}>{loc.location} ({loc.count})</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default FamilyStats

