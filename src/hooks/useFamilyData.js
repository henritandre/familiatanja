import { useState, useEffect } from 'react'
import { collection, getDocs, doc, getDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'

// Hook para buscar dados da família do Firebase
export const useFamilyData = () => {
  const [familyData, setFamilyData] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchFamilyData = async () => {
      try {
        setLoading(true)
        
        // Buscar todos os membros da coleção 'familia'
        const membersCollection = collection(db, 'familia')
        const membersSnapshot = await getDocs(membersCollection)
        
        const members = {}
        membersSnapshot.forEach((doc) => {
          const data = doc.data()
          members[doc.id] = {
            id: doc.id, // Usar o Document ID como ID interno
            nomeCompleto: data['Nome Completo'],
            nome: data.Nome,
            sobrenome: data.Sobrenome,
            apelido: data.Apelido,
            sexo: data.Sexo,
            nascimento: data.Nascimento,
            falecimento: data.Falecimento,
            localNascimento: data['Local de Nascimento'],
            localFalecimento: data['Local de Falecimento'],
            moraEm: data['Mora em'],
            casadoCom: data['Casado Com'],
            mae: data.Mãe === '99' ? null : data.Mãe,
            pai: data.Pai === '99' ? null : data.Pai,
            outrosMae: data['Outros Mãe'],
            outrosPai: data['Outros Pai'],
            foto: `/api/placeholder/100/100` // Placeholder para fotos
          }
        })
        
        setFamilyData(members)
        setError(null)
      } catch (err) {
        console.error('Erro ao buscar dados da família:', err)
        setError(err.message)
        
        // Usar dados de exemplo se não conseguir conectar ao Firebase
        setFamilyData(getExampleData())
      } finally {
        setLoading(false)
      }
    }

    fetchFamilyData()
  }, [])

  return { familyData, loading, error }
}

// Hook para buscar informações gerais da família
export const useFamilyInfo = () => {
  const [familyInfo, setFamilyInfo] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchFamilyInfo = async () => {
      try {
        setLoading(true)
        
        // Buscar informações gerais da família
        const infoDoc = doc(db, 'familiaTanja', 'infoGeral')
        const infoSnapshot = await getDoc(infoDoc)
        
        if (infoSnapshot.exists()) {
          setFamilyInfo(infoSnapshot.data())
        } else {
          // Usar dados de exemplo se não encontrar
          setFamilyInfo(getExampleInfo())
        }
        
        setError(null)
      } catch (err) {
        console.error('Erro ao buscar informações da família:', err)
        setError(err.message)
        
        // Usar dados de exemplo se não conseguir conectar ao Firebase
        setFamilyInfo(getExampleInfo())
      } finally {
        setLoading(false)
      }
    }

    fetchFamilyInfo()
  }, [])

  return { familyInfo, loading, error }
}

// Os dados já estão no Firebase, não precisamos converter planilha

// Função para calcular estatísticas da família
export const calculateFamilyStats = (familyData) => {
  const members = Object.values(familyData)
  
  // Contar descendentes diretos e indiretos
  const calculateDescendants = (memberId, visited = new Set()) => {
    if (visited.has(memberId)) return { direct: 0, indirect: 0 }
    visited.add(memberId)
    
    const children = members.filter(m => m.pai === memberId || m.mae === memberId)
    let direct = children.length
    let indirect = 0
    
    children.forEach(child => {
      const childDescendants = calculateDescendants(child.id, visited)
      direct += childDescendants.direct
      indirect += childDescendants.indirect
      
      // Cônjuges são considerados indiretos
      if (child.casadoCom && !visited.has(child.casadoCom)) {
        indirect += 1
      }
    })
    
    return { direct, indirect }
  }
  
  // Encontrar os fundadores (pessoas sem pais registrados)
  const founders = members.filter(m => !m.pai && !m.mae && !m.outrosPai && !m.outrosMae)
  
  let totalDirect = 0
  let totalIndirect = 0
  
  founders.forEach(founder => {
    const descendants = calculateDescendants(founder.id)
    totalDirect += descendants.direct
    totalIndirect += descendants.indirect
  })
  
  return {
    totalMembers: members.length,
    totalDirect,
    totalIndirect,
    livingMembers: members.filter(m => !m.falecimento).length
  }
}

// Dados de exemplo para fallback
const getExampleData = () => ({
  "1": {
    id: "1",
    nomeCompleto: "João Silva Tanja",
    nome: "João",
    sobrenome: "Silva Tanja",
    apelido: "Vô João",
    sexo: "M",
    nascimento: "1920-03-15",
    falecimento: "1995-12-20",
    localNascimento: "São Paulo, SP",
    localFalecimento: "São Paulo, SP",
    casadoCom: "2",
    foto: "/api/placeholder/100/100"
  },
  "2": {
    id: "2",
    nomeCompleto: "Maria Santos Tanja",
    nome: "Maria",
    sobrenome: "Santos Tanja",
    apelido: "Vó Maria",
    sexo: "F",
    nascimento: "1925-07-22",
    falecimento: "2000-05-10",
    localNascimento: "Rio de Janeiro, RJ",
    localFalecimento: "São Paulo, SP",
    casadoCom: "1",
    foto: "/api/placeholder/100/100"
  },
  "3": {
    id: "3",
    nomeCompleto: "Carlos Silva Tanja",
    nome: "Carlos",
    sobrenome: "Silva Tanja",
    apelido: "Tio Carlos",
    sexo: "M",
    nascimento: "1950-11-08",
    localNascimento: "São Paulo, SP",
    pai: "1",
    mae: "2",
    foto: "/api/placeholder/100/100"
  }
})

const getExampleInfo = () => ({
  titulo: "Família Tanja",
  subtitulo: "História e Legado",
  textoIntroducao: "A história deste braço da Família Tanja começa da união do Sr. João Silva Tanja e da Srta. Maria Santos Tanja, duas almas que se encontraram em uma época onde o amor verdadeiro era construído com paciência e dedicação. Deles, hoje temos um legado extraordinário de descendentes diretos e indiretos, espalhados pelo mundo, mas unidos pelos laços invisíveis da família e pelos valores que eles plantaram."
})

