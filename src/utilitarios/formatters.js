// Formata CPF removendo caracteres não numéricos
export const formatCPF = (cpf) => {
  return cpf.replace(/\D/g, '');
};

// Formata data para ISO
export const formatDateToISO = (date = new Date()) => {
  return date.toISOString().split('T')[0];
};

// Formata valor monetário
export const formatCurrency = (value) => {
  return `R$ ${value}`;
};

// Limita tamanho de string
export const truncateString = (str, maxLength) => {
  if (!str) return '';
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};
