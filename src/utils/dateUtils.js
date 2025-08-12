// Converte datas no formato DD/MM/YYYY para objeto Date
export const parseBrazilianDate = (dateString) => {
  if (!dateString) return null;
  
  // Se já estiver no formato ISO, usa diretamente
  if (dateString.includes('-') && dateString.length === 10) {
    return new Date(dateString);
  }
  
  // Tenta converter formato brasileiro DD/MM/YYYY
  if (dateString.includes('/')) {
    const [day, month, year] = dateString.split('/');
    return new Date(`${year}-${month}-${day}`);
  }
  
  // Se não for possível converter, retorna null
  console.warn(`Data em formato desconhecido: ${dateString}`);
  return null;
};
