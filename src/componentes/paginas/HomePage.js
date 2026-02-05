import React from 'react';
import { Megaphone, XCircle, CheckCircle2, BookOpen, Settings, MessageCircle, Database, ArrowRight, Tag, ClipboardEdit } from 'lucide-react';

const HomePage = ({ 
  setActiveTab, 
  isAdmin, 
  isAprovador,
  temaEscuro 
}) => {
  const bgCard = temaEscuro ? 'bg-zinc-900/50' : 'bg-white';
  const textMain = temaEscuro ? 'text-white' : 'text-zinc-900';
  const textSub = temaEscuro ? 'text-zinc-400' : 'text-zinc-500';
  const borderColor = temaEscuro ? 'border-zinc-800/50' : 'border-zinc-200/50';

  const menuItems = [];

  if (!isAdmin || isAprovador) {
    menuItems.push(
      {
        id: 'doacoes',
        title: 'Doações',
        description: 'Solicitar doação de produtos',
        icon: Megaphone,
        color: 'from-green-400 to-emerald-600',
        shadow: 'shadow-green-500/20',
        action: () => setActiveTab('doacoes')
      },
      {
        id: 'historico',
        title: 'Histórico',
        description: 'Ver meus pedidos',
        icon: BookOpen,
        color: 'from-yellow-400 to-orange-500',
        shadow: 'shadow-yellow-500/20',
        action: () => setActiveTab('historico')
      },
      {
        id: 'cancelamentos',
        title: 'Cancelamentos de Compras',
        description: 'Cancelar pedidos',
        icon: XCircle,
        color: 'from-red-400 to-rose-600',
        shadow: 'shadow-red-500/20',
        action: () => setActiveTab('cancelamentos')
      },
      {
        id: 'suporte',
        title: 'Suporte',
        description: 'Chat com Agente Triger',
        icon: MessageCircle,
        color: 'from-blue-400 to-indigo-600',
        shadow: 'shadow-blue-500/20',
        action: () => setActiveTab('suporte')
      },
      {
        id: 'vendas',
        title: 'Solicitação de Venda',
        description: 'Cadastrar nova venda',
        icon: Tag,
        color: 'from-emerald-400 to-green-600',
        shadow: 'shadow-green-500/20',
        action: () => setActiveTab('vendas')
      },
      {
        id: 'materiais',
        title: 'Materiais para escritório/produção',
        description: 'Solicitar suprimentos',
        icon: BookOpen,
        color: 'from-indigo-400 to-blue-600',
        shadow: 'shadow-indigo-500/20',
        action: () => setActiveTab('materiais')
      },
      {
        id: 'ficha-tecnica',
        title: 'Alteração de Ficha Técnica - P&D',
        description: 'Solicitar revisão de FT',
        icon: ClipboardEdit,
        color: 'from-amber-400 to-orange-600',
        shadow: 'shadow-orange-500/20',
        action: () => setActiveTab('ficha-tecnica')
      }
    );
  }

  if (isAdmin || isAprovador) {
    menuItems.push({
      id: 'aprovacoes',
      title: 'Aprovações',
      description: 'Gerenciar pedidos',
      icon: CheckCircle2,
      color: 'from-emerald-400 to-teal-600',
      shadow: 'shadow-emerald-500/20',
      action: () => setActiveTab('aprovacoes')
    });

    if (isAdmin) {
      menuItems.push({
        id: 'admin-painel',
        title: 'Painel Admin',
        description: 'Dados na nuvem',
        icon: Database,
        color: 'from-violet-400 to-purple-600',
        shadow: 'shadow-purple-500/20',
        action: () => setActiveTab('admin-painel')
      });
    }
  }

  return (
    <div className="pb-32 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Hero Section */}
      <div className={`relative overflow-hidden ${bgCard} p-8 rounded-[2.5rem] border ${borderColor} shadow-xl`}>
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-yellow-500/10 blur-3xl rounded-full" />
        <div className="relative z-10">
          <h2 className={`text-2xl font-black uppercase italic tracking-tighter mb-2 ${textMain}`}>
            Olá, <span className="text-yellow-500">Bem-vindo!</span>
          </h2>
          <p className={`text-sm font-medium leading-relaxed max-w-[200px] ${textSub}`}>
            O que você deseja realizar hoje?
          </p>
        </div>
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-2 gap-4">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isLarge = index === 0 || index === 5; // Make some cards larger for visual interest
          
          return (
            <button
              key={item.id}
              onClick={item.action}
              className={`group relative flex flex-col p-5 rounded-3xl border ${borderColor} ${bgCard} hover:border-yellow-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-500/5 active:scale-95 text-left overflow-hidden ${
                isLarge ? 'col-span-2 flex-row items-center gap-5' : 'col-span-1'
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-[0.03] transition-opacity`} />
              
              <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center shadow-lg ${item.shadow} group-hover:scale-110 transition-transform duration-500`}>
                <Icon size={24} className="text-white" strokeWidth={2.5} />
              </div>
              
              <div className={isLarge ? 'flex-1' : 'mt-4'}>
                <h3 className={`text-sm font-black uppercase tracking-tight ${textMain}`}>
                  {item.title}
                </h3>
                <p className={`text-[10px] font-bold leading-tight mt-1 ${textSub}`}>
                  {item.description}
                </p>
              </div>

              {isLarge && (
                <div className={`p-2 rounded-full ${temaEscuro ? 'bg-zinc-800' : 'bg-zinc-100'} group-hover:bg-yellow-500 group-hover:text-white transition-colors`}>
                  <ArrowRight size={16} />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default HomePage;
