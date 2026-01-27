import { buscarPedidosUsuario } from './pedidosService';
import { buscarDoacoesUsuario } from './doacoesService';

export const buscarHistoricoCompleto = async (usuario) => {
  try {
    const [pedidos, doacoes] = await Promise.all([
      buscarPedidosUsuario(usuario),
      buscarDoacoesUsuario(usuario)
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

    // Combinar e ordenar por data (mais recente primeiro)
    return [...pedidosNormalizados, ...doacoesNormalizadas].sort((a, b) => {
      return new Date(b.data) - new Date(a.data);
    });
  } catch (error) {
    console.error('Erro ao buscar histórico completo:', error);
    throw error;
  }
};
