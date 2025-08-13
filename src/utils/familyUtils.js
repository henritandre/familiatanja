// Utilitários para manipulação de dados da família

// Calcular idade

// Formatar data

// Obter informações de relacionamento
export const getRelationshipInfo = (memberId, familyData) => {
  if (!memberId || memberId === "99") return "Ainda não temos este dado"
  const partner = familyData[memberId]
  return partner ? partner.nomeCompleto : "Ainda não temos este dado"
}

// Contar filhos de um membro
export const countChildren = (memberId, familyData) => {
  const members = Object.values(familyData)
  return members.filter(member => 
    member.pai === memberId || member.mae === memberId
  ).length
}

// Contar netos de um membro
export const countGrandchildren = (memberId, familyData) => {
  const members = Object.values(familyData)
  const children = members.filter(member => 
    member.pai === memberId || member.mae === memberId
  )
  
  let grandchildrenCount = 0
  children.forEach(child => {
    grandchildrenCount += countChildren(child.id, familyData)
  })
  
  return grandchildrenCount
}

// Obter filhos de um membro
export const getChildren = (memberId, familyData) => {
  const members = Object.values(familyData)
  return members.filter(member => 
    (String(member.pai) === String(memberId) && String(member.pai) !== "99") || 
    (String(member.mae) === String(memberId) && String(member.mae) !== "99")
  )
}

// Verificar se deve exibir filhos (baseado na lógica de relacionamentos)
export const shouldShowChildren = (parentId, childId, familyData) => {
  const parent = familyData[parentId]
  const child = familyData[childId]
  
  if (!parent || !child) return true
  
  // Se o filho é de um relacionamento específico que não deve ser exibido
  // Esta lógica pode ser expandida baseada nos requisitos específicos
  if (child.pai === "99" || child.mae === "99") {
    // Filhos com ID 99 são de relacionamentos fora do casamento
    // Verificar se devem ser exibidos baseado na configuração
    return false // Por padrão, não exibir
  }
  
  return true
}

// Gerar eventos do calendário baseados nos dados da família
export const calculateAge = (birthDateString, deathDateString = null) => {
  if (!birthDateString) return null;
  const birthDate = new Date(birthDateString + 'T00:00:00Z'); // Força UTC
  if (isNaN(birthDate.getTime())) return null;

  const endDate = deathDateString ? new Date(deathDateString + 'T00:00:00Z') : new Date();
  if (isNaN(endDate.getTime())) return null;

  let age = endDate.getUTCFullYear() - birthDate.getUTCFullYear();
  const monthDiff = endDate.getUTCMonth() - birthDate.getUTCMonth();
  if (monthDiff < 0 || (monthDiff === 0 && endDate.getUTCDate() < birthDate.getUTCDate())) {
    age--;
  }
  return Math.max(0, age);
};

// Formatar data (local BR, mas input UTC)
export const formatDate = (dateString) => {
  if (!dateString) return "Ainda não temos este dado";
  const date = new Date(dateString + 'T00:00:00Z');
  return date.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
};

// Gerar eventos com UTC
export const generateFamilyEvents = (familyData) => {
  const events = [];
  const currentYear = new Date().getUTCFullYear();
  Object.values(familyData).forEach(member => {
    // Aniversários
    if (member.nascimento) {
      const birthDate = new Date(member.nascimento + 'T00:00:00Z');
      const age = calculateAge(member.nascimento, member.falecimento);
      const eventDateThisYear = new Date(Date.UTC(currentYear, birthDate.getUTCMonth(), birthDate.getUTCDate()));
      events.push({
        id: member.id,
        nome: member.nomeCompleto,
        tipo: "aniversario",
        data: eventDateThisYear.toISOString().split('T')[0],
        idade: age,
        falecido: !!member.falecimento
      });
    }
    // Falecimentos
    if (member.falecimento) {
      const deathDate = new Date(member.falecimento + 'T00:00:00Z');
      const yearsSince = currentYear - deathDate.getUTCFullYear();
      events.push({
        id: member.id,
        nome: member.nomeCompleto,
        tipo: "falecimento",
        data: deathDate.toISOString().split('T')[0],
        anosDesde: yearsSince
      });
    }
  });
  return events;
};

// Calcular estatísticas detalhadas da família
export const calculateDetailedStats = (familyData) => {
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
  const members = Object.values(familyData);
  const membersMap = new Map(members.map(member => [String(member.id), member]));

  const getDirectChildren = (parentId) => {
    return members.filter(member =>
      (String(member.pai) === String(parentId) && String(member.pai) !== "99") ||
      (String(member.mae) === String(parentId) && String(member.mae) !== "99")
    );
  };

  // Founders como antes, sort por ID menor (avô ID1 first)
  const potentialFounders = members.filter(member =>
    (!member.pai && !member.mae) ||
    (String(member.pai) === "99" && String(member.mae) === "99")
  );

  const allChildrenIds = new Set();
  members.forEach(member => {
    if (member.pai && String(member.pai) !== "99") allChildrenIds.add(String(member.id));
    if (member.mae && String(member.mae) !== "99") allChildrenIds.add(String(member.id));
  });

  let founders = potentialFounders.filter(member => !allChildrenIds.has(String(member.id)));
  founders.sort((a, b) => parseInt(a.id) - parseInt(b.id));

  // Merge casados: Avô root, avó spouse
  if (founders.length > 1) {
    const primary = founders[0];
    const spouseCandidate = founders.find(f => String(f.casadoCom) === String(primary.id));
    if (spouseCandidate) {
      founders = [primary]; // Só root, spouse adicionado depois
    }
  }

  const buildBranch = (memberId, level = 0, visited = new Set()) => {
    const memberKey = String(memberId);
    if (visited.has(memberKey)) return null; // Skip duplicata
    visited.add(memberKey);

    const member = membersMap.get(memberKey);
    if (!member) return null;

    const spouseId = member.casadoCom ? String(member.casadoCom) : null;
    const spouse = spouseId && spouseId !== "99" ? membersMap.get(spouseId) : null;

    // Children do casal, unique
    const childrenFromMember = getDirectChildren(memberId);
    const childrenFromSpouse = spouseId ? getDirectChildren(spouseId) : [];
    const uniqueChildrenIds = new Set([...childrenFromMember, ...childrenFromSpouse].map(c => String(c.id)));

    // Filtra children não visitados
    const children = Array.from(uniqueChildrenIds)
      .filter(id => !visited.has(id))
      .map(id => buildBranch(id, level + 1, visited))
      .filter(Boolean);

    return {
      ...member,
      level,
      spouse,
      children
    };
  };

  const tree = founders.map(founder => buildBranch(founder.id, 0, new Set())).filter(Boolean);
  return tree;
};
