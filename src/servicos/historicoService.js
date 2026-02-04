import { buscarPedidosUsuario } from './pedidosService';
import { buscarDoacoesUsuario } from './doacoesService';
import { buscarCancelamentosUsuario } from './cancelamentosService';
import { buscarVendasUsuario } from './vendasService';

export const buscarHistoricoCompleto = async (usuario) => {
  try {
    const [pedidos, doacoes, cancelamentos, vendas] = await Promise.all([
      buscarPedidosUsuario(usuario),
      buscarDoacoesUsuario(usuario),
      buscarCancelamentosUsuario(usuario),
      buscarVendasUsuario(usuario)
    ]);

    // Normalizar pedidos para o histórico
    const pedidosNormalizados = pedidos.map(p => ({
      ...p,
      tipo: 'COMPRA',
      detalhes: `Valor: R$ ${p.valor}`
    }));

    // Normalizar doações para o histórico
    const doacoesNormalizadas = doacoes.map(d => ({
      ...d,
      tipo: 'DOACAO',
      detalhes: `${d.quantidade} ${d.unidade}`
    }));

    // Normalizar cancelamentos para o histórico
    const cancelamentosNormalizados = cancelamentos.map(c => ({
      ...c,
      tipo: 'CANCELAMENTO',
      detalhes: `${c.quantidade} ${c.unidade}`
    }));

    // Normalizar vendas para o histórico
    const vendasNormalizadas = vendas.map(v => ({
      ...v,
      tipo: 'VENDA',
      detalhes: `Venda: R$ ${v.valor}`
    }));

    // Combinar e ordenar por data (mais recente primeiro)
    return [
      ...pedidosNormalizados, 
      ...doacoesNormalizadas, 
      ...cancelamentosNormalizados,
      ...vendasNormalizadas
    ].sort((a, b) => {
      const dataA = a.data ? new Date(a.data) : new Date(0);
      const dataB = b.data ? new Date(b.data) : new Date(0);
      return dataB - dataA;
    });
  } catch (error) {
    console.error('Erro ao buscar histórico completo:', error);
    throw error;
  }
};
