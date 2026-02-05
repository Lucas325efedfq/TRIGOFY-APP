import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from '../ProductCard';

const mockProduto = {
  nome: 'Produto Teste',
  preco: '10,00',
  vencimento: '12/2026',
  imagem: null
};

describe('ProductCard', () => {
  it('deve renderizar o nome e o preço do produto corretamente', () => {
    render(<ProductCard produto={mockProduto} isSelected={false} onToggle={() => {}} />);
    
    expect(screen.getByText('Produto Teste')).toBeInTheDocument();
    expect(screen.getByText('R$ 10,00')).toBeInTheDocument();
    expect(screen.getByText('Venc: 12/2026')).toBeInTheDocument();
  });

  it('deve chamar onToggle quando clicado', () => {
    const onToggleMock = jest.fn();
    render(<ProductCard produto={mockProduto} isSelected={false} onToggle={onToggleMock} />);
    
    const card = screen.getByText('Produto Teste').closest('div');
    fireEvent.click(card);
    
    expect(onToggleMock).toHaveBeenCalledTimes(1);
  });

  it('deve mostrar o indicador de seleção quando isSelected for true', () => {
    const { container } = render(<ProductCard produto={mockProduto} isSelected={true} onToggle={() => {}} />);
    
    // Verifica se a classe de borda amarela está presente (indicando seleção)
    expect(container.firstChild).toHaveClass('border-yellow-500');
  });
});
