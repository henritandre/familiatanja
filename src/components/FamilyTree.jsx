import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Heart, Calendar, MapPin, Users, Baby } from 'lucide-react'
import { useFamilyData } from '../hooks/useFamilyData'
import { 
  calculateAge, 
  formatDate, 
  getRelationshipInfo, 
  countChildren, 
  countGrandchildren,
  getChildren,
  buildFamilyTree
} from '../utils/familyUtils'

const FamilyMemberCard = ({ member, familyData, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botão de fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        {/* Foto e nome */}
        <div className="text-center mb-6">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            <img 
              src={`/img/${member.id}.jpg`} 
              alt={member.nomeCompleto}
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">{member.nomeCompleto}</h3>
        </div>

        {/* Informações */}
        <div className="space-y-4 text-left">
          <div className="flex items-center gap-3">
            <Heart size={16} className="text-red-500" />
            <div>
              <span className="font-medium">Apelido:</span>
              <p className="text-gray-600">{member.apelido || "Ainda não temos este dado"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar size={16} className="text-blue-500" />
            <div>
              <span className="font-medium">Data de nascimento:</span>
              <p className="text-gray-600">{formatDate(member.nascimento)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar size={16} className="text-green-500" />
            <div>
              <span className="font-medium">Idade {member.falecimento ? 'ao falecer' : 'atual'}:</span>
              <p className="text-gray-600">
                {member.nascimento ? `${calculateAge(member.nascimento, member.falecimento)} anos` : "Ainda não temos este dado"}
              </p>
            </div>
          </div>

          {member.falecimento && (
            <div className="flex items-center gap-3">
              <Calendar size={16} className="text-gray-500" />
              <div>
                <span className="font-medium">Data de falecimento:</span>
                <p className="text-gray-600">{formatDate(member.falecimento)}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <MapPin size={16} className="text-purple-500" />
            <div>
              <span className="font-medium">Local de nascimento:</span>
              <p className="text-gray-600">{member.localNascimento || "Ainda não temos este dado"}</p>
            </div>
          </div>

          {member.localFalecimento && (
            <div className="flex items-center gap-3">
              <MapPin size={16} className="text-gray-500" />
              <div>
                <span className="font-medium">Local de falecimento:</span>
                <p className="text-gray-600">{member.localFalecimento || "Ainda não temos este dado"}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <Heart size={16} className="text-pink-500" />
            <div>
              <span className="font-medium">Casado(a) com:</span>
              <p className="text-gray-600">{getRelationshipInfo(member.casadoCom, familyData)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Users size={16} className="text-orange-500" />
            <div>
              <span className="font-medium">Quantidade de filhos:</span>
              <p className="text-gray-600">{countChildren(member.id, familyData)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Baby size={16} className="text-yellow-500" />
            <div>
              <span className="font-medium">Quantidade de netos:</span>
              <p className="text-gray-600">{countGrandchildren(member.id, familyData)}</p>
            </div>
          </div>

          {(member.pai || member.mae || member.outrosPai || member.outrosMae) && (
            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">👨‍👩‍👧‍👦 Pais:</h4>
              <p className="text-gray-600">
                <strong>Pai:</strong> {
                  member.pai && member.pai !== "99" 
                    ? familyData[member.pai]?.nomeCompleto || "Ainda não temos este dado"
                    : member.outrosPai || "Ainda não temos este dado"
                }
              </p>
              <p className="text-gray-600">
                <strong>Mãe:</strong> {
                  member.mae && member.mae !== "99" 
                    ? familyData[member.mae]?.nomeCompleto || "Ainda não temos este dado"
                    : member.outrosMae || "Ainda não temos este dado"
                }
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

const FamilyMember = ({ member, onClick, level = 0 }) => {
  return (
    <motion.div
      className="flex flex-col items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: level * 0.1 }}
    >
      <motion.div
        className="w-20 h-20 rounded-full bg-gray-200 cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden border-4 border-white shadow-md"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onClick(member)}
      >
        <img 
          src={`/img/${member.id}.jpg`} 
          alt={member.nome}
          className="w-full h-full object-cover"
        />
      </motion.div>
      <p className="mt-2 text-sm font-medium text-gray-700 text-center">{member.nome}</p>
    </motion.div>
  )
}

const FamilyTree = () => {
  const { familyData, loading, error } = useFamilyData()
  const [selectedMember, setSelectedMember] = useState(null)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados da família...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Erro ao carregar dados: {error}</p>
          <p className="text-gray-600">Usando dados de exemplo...</p>
        </div>
      </div>
    )
  }

  const tree = buildFamilyTree(familyData)
  console.log('Árvore Genealógica Construída:', JSON.stringify(tree, null, 2));

const renderFamilyBranch = (members, level = 0) => (
  <div className="flex flex-col items-center mb-12">
    {members.map(member => (
      <div key={member.id} className="relative">
        {/* Casal como tronco/ramo */}
        <div className="flex items-center justify-center gap-4">
          <FamilyMember member={member} onClick={setSelectedMember} level={level} />
          {member.spouse && (
            <>
              <div className="connector-heart">❤️</div> {/* Conector pro spouse */}
              <FamilyMember member={member.spouse} onClick={setSelectedMember} level={level} />
            </>
          )}
        </div>

        {/* Ramificações pros filhos */}
        {member.children?.length > 0 && (
          <div className="mt-8 w-full">
            {/* Linha horizontal pra distribuir children */}
            <div className="branch-line-horizontal" style={{ width: '100%', height: '1px', background: '#ccc', margin: '10px 0' }}></div>
            <div className="flex justify-around gap-8 flex-wrap">
              {renderFamilyBranch(member.children, level + 1)}
            </div>
          </div>
        )}
      </div>
    ))}
  </div>
);

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-thin mb-4 text-gray-900 tracking-tight">
            Árvore Genealógica
          </h2>
          <p className="text-xl text-gray-600 font-light">
            Clique em qualquer foto para ver mais detalhes
          </p>
        </motion.div>

        {/* Árvore genealógica */}
        {tree.length > 0 ? (
          <div className="text-center">
            <h3 className="text-2xl font-light text-gray-700 mb-6">Fundadores</h3>
            {renderFamilyBranch(tree)}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 text-xl">Nenhum dado familiar encontrado</p>
          </div>
        )}
      </div>

      {/* Modal de detalhes */}
      <AnimatePresence>
        {selectedMember && (
          <FamilyMemberCard 
            member={selectedMember} 
            familyData={familyData}
            onClose={() => setSelectedMember(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default FamilyTree

