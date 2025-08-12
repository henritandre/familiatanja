export const buildFamilyTree = (familyData) => {
  const members = Object.values(familyData)
  const membersMap = new Map(members.map(member => [member.id, member]))

  const getDirectChildren = (parentId) => {
    return members.filter(member => 
      (String(member.pai) === String(parentId) && member.pai !== "99") || 
      (String(member.mae) === String(parentId) && member.mae !== "99")
    )
  }

  const founders = members.filter(m => {
    const noFather = !m.pai || m.pai === "99" || m.pai === null || m.pai === undefined
    const noMother = !m.mae || m.mae === "99" || m.mae === null || m.mae === undefined
    return noFather && noMother
  })

  const buildBranch = (memberId, level = 0) => {
    const member = membersMap.get(memberId)
    if (!member) return null

    const children = getDirectChildren(memberId)
    let spouse = null

    if (member.casadoCom && membersMap.has(member.casadoCom)) {
      spouse = membersMap.get(member.casadoCom)
    }

    return {
      ...member,
      level,
      spouse,
      children: children.map(child => buildBranch(child.id, level + 1)).filter(Boolean)
    }
  }

  return founders.map(founder => buildBranch(founder.id, 0)).filter(Boolean)
}
  const members = Object.values(familyData)
  
  // Aniversários por mês
  const birthdaysByMonth = Array(12).fill(0)
  members.forEach(person => {
    if (person.nascimento) {
      const month = new Date(person.nascimento).getMonth()
      birthdaysByMonth[month]++
    }
  })

  const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  const birthdayData = monthNames.map((month, index) => ({
    month,
    aniversarios: birthdaysByMonth[index]
  }))

  // Mês com mais aniversários
  const maxBirthdayMonth = birthdaysByMonth.indexOf(Math.max(...birthdaysByMonth))
  const monthWithMostBirthdays = monthNames[maxBirthdayMonth]

  // Distribuição por gênero
  const genderDistribution = members.reduce((acc, person) => {
    acc[person.sexo] = (acc[person.sexo] || 0) + 1
    return acc
  }, {})

  const genderData = [
    { name: 'Homens', value: genderDistribution.M || 0, color: '#3B82F6' },
    { name: 'Mulheres', value: genderDistribution.F || 0, color: '#EC4899' }
  ]

  // Distribuição por local de nascimento
  const locationDistribution = members.reduce((acc, person) => {
    const location = person.localNascimento || 'Não informado'
    acc[location] = (acc[location] || 0) + 1
    return acc
  }, {})

  const locationData = Object.entries(locationDistribution).map(([location, count]) => ({
    location,
    count
  }))

  // Maior distância entre filhos (em anos)
  let maxAgeDifference = 0
  let maxAgeDifferenceFamily = ''
  
  // Agrupar por família (mesmo sobrenome)
  const families = {}
  members.forEach(person => {
    const familyName = person.sobrenome || person.nomeCompleto.split(' ').slice(-1)[0]
    if (!families[familyName]) families[familyName] = []
    families[familyName].push(person)
  })

  Object.entries(families).forEach(([familyName, familyMembers]) => {
    if (familyMembers.length > 1) {
      const birthYears = familyMembers
        .filter(m => m.nascimento)
        .map(m => new Date(m.nascimento).getFullYear())
        .sort()
      
      if (birthYears.length > 1) {
        const ageDiff = birthYears[birthYears.length - 1] - birthYears[0]
        if (ageDiff > maxAgeDifference) {
          maxAgeDifference = ageDiff
          maxAgeDifferenceFamily = familyName
        }
      }
    }
  })

  // Média de filhos por pessoa
  const totalChildren = members.reduce((sum, person) => {
    return sum + countChildren(person.id, familyData)
  }, 0)
  const averageChildren = members.length > 0 ? (totalChildren / members.length).toFixed(1) : 0

  // Pessoa mais velha e mais nova
  const ages = members
    .filter(person => person.nascimento)
    .map(person => {
      const age = calculateAge(person.nascimento, person.falecimento)
      return {
        name: person.nomeCompleto,
        age: age,
        isAlive: !person.falecimento
      }
    })

  const oldestPerson = ages.length > 0 ? ages.reduce((oldest, current) => 
    current.age > oldest.age ? current : oldest
  ) : { name: 'N/A', age: 0, isAlive: false }

  const youngestPerson = ages.length > 0 ? ages.reduce((youngest, current) => 
    current.age < youngest.age ? current : youngest
  ) : { name: 'N/A', age: 0, isAlive: false }

  // Evolução da família por década
  const familyGrowthByDecade = {}
  members.forEach(person => {
    if (person.nascimento) {
      const decade = Math.floor(new Date(person.nascimento).getFullYear() / 10) * 10
      familyGrowthByDecade[decade] = (familyGrowthByDecade[decade] || 0) + 1
    }
  })

  const growthData = Object.entries(familyGrowthByDecade)
    .map(([decade, count]) => ({
      decade: `${decade}s`,
      nascimentos: count
    }))
    .sort((a, b) => parseInt(a.decade) - parseInt(b.decade))

  return {
    birthdayData,
    monthWithMostBirthdays,
    genderData,
    locationData,
    maxAgeDifference,
    maxAgeDifferenceFamily,
    averageChildren,
    oldestPerson,
    youngestPerson,
    growthData,
    totalMembers: members.length,
    totalChildren,
    livingMembers: members.filter(p => !p.falecimento).length
  }
}

// Construir árvore genealógica hierárquica
export const buildFamilyTree = (familyData) => {
  const members = Object.values(familyData)
  const membersMap = new Map(members.map(member => [member.id, member]))

  const getDirectChildren = (parentId) => {
    return members.filter(member => 
      (String(member.pai) === String(parentId) && member.pai !== "99") || 
      (String(member.mae) === String(parentId) && member.mae !== "99")
    )
  }

  const founders = members.filter(m => {
    const noFather = !m.pai || m.pai === "99" || m.pai === null || m.pai === undefined
    const noMother = !m.mae || m.mae === "99" || m.mae === null || m.mae === undefined
    return noFather && noMother
  })

  const buildBranch = (memberId, level = 0) => {
    const member = membersMap.get(memberId)
    if (!member) return null

    const children = getDirectChildren(memberId)
    let spouse = null

    if (member.casadoCom && membersMap.has(member.casadoCom)) {
      spouse = membersMap.get(member.casadoCom)
    }

    return {
      ...member,
      level,
      spouse,
      children: children.map(child => buildBranch(child.id, level + 1)).filter(Boolean)
    }
  }

  return founders.map(founder => buildBranch(founder.id, 0)).filter(Boolean)
}

