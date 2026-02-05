import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  // Forneça o caminho para o seu app Next.js para carregar next.config.js e arquivos .env em seu ambiente de teste
  dir: './',
})

// Adicione qualquer configuração personalizada do Jest a ser passada para o Jest
/** @type {import('jest').Config} */
const config = {
  // Adicione mais opções de configuração aqui
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
}

// createJestConfig é exportado desta forma para garantir que next/jest possa carregar a configuração do Next.js que é assíncrona
export default createJestConfig(config)
