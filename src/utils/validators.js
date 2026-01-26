// Valida se CPF tem 11 dígitos
export const isValidCPF = (cpf) => {
  const cleaned = cpf.replace(/\D/g, '');
  return cleaned.length === 11;
};

// Valida se campo está preenchido
export const isFieldFilled = (value) => {
  return value && value.trim() !== '';
};

// Valida múltiplos campos
export const validateFields = (fields) => {
  return fields.every(field => isFieldFilled(field));
};

// Valida email
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};
