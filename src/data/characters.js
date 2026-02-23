/**
 * Array de personagens (D&D / RPG)
 * Cada personagem possui: id, nome, classe(s), nível, corTema, bio e caminhos de imagens
 */
const characters = [
  {
    id: "char-001",
    nome: "Ulfgar",
    titulo: "O Sangue de Jotun",
    classe: ["Bárbaro", "Caminho do Gigante"],
    multiclasseTooltip: "Bruxo: Demônio",
    nivel: 5,
    alinhamento: "Caótico e Bom",
    corTema: "#60a5fa",
    corAcento: "#eab308",
    citacao: "O ferro das algemas é frio, mas meu sangue ainda ferve.",
    bio: "Herdeiro do sangue dos gigantes, Ulfgar busca nos conflitos e no cárcere o limite de sua inabalável resistência. Enviado em uma missão de onde poucos retornam, ele vaga em busca de um artefato de poder que garanta sua ascensão. Ulfgar não busca a morte, mas a glória necessária para finalmente ser chamado de Homem-Gigante.",
    personalidade: ["Honrado", "Instintivo", "Resiliente"],
    rating: 5,
    stats: { str: 16, strDisplay: '15+1', dex: 13, con: 14, int: 8, wis: 9, wisDisplay: '8+1', cha: 13 },
    classePericias: ["Atletismo", "Percepção"],
    classeTalento: "Polearm Master",
    antecedente: "Personalizado",
    antecedentePericias: ["Arcanismo", "Furtividade"],
    antecedenteFerramentas: ["Ferramentas de pedreiro", "Ferramentas de ladrão"],
    antecedenteTraco: "Pesquisador",
    equipamento: [
      {
        origem: "Bárbaro",
        itens: [
          "Uma glaive (arma principal)",
          "Uma besta leve",
          "Mochila de explorador e 4 azagaias"
        ]
      },
      {
        origem: "Investigador",
        itens: [
          "Uma lupa",
          "Fio negro, item 47 da tabela de Trinkets de Horror",
          "Um conjunto de roupas comuns",
          "10 po"
        ]
      }
    ],
    imagens: {
      avatar: "/imagens/fotos/Ulfgar.png",
      conceptArt: "/imagens/fotos/Ulfgar.png"
    }
  },
  {
    id: "char-002",
    nome: "Kairós",
    titulo: "O Arquiteto dos Segundos",
    classe: ["Clérigo", "Domínio da Paz", "Mago", "Magia Cronúrgica"],
    multiclasse: true,
    multiclasseFromIndex: 2,
    classeTagStyles: [
      { bg: 'bg-rose-500/20', text: 'text-rose-300', border: 'border-rose-500/50' },
      { bg: 'bg-amber-500/20', text: 'text-amber-300', border: 'border-amber-500/50' },
      { bg: 'bg-red-500/20', text: 'text-red-300', border: 'border-red-500/50' },
      { bg: 'bg-rose-600/25', text: 'text-rose-200', border: 'border-rose-600/50' }
    ],
    nivel: 1,
    alinhamento: "Neutro Bom",
    corTema: "#dc2626",
    corAcento: "#b91c1c",
    citacao: "A fé me ensinou a aceitar o fim; o tempo me ensinou a impedi-lo. Eu não busco a eternidade, apenas os dez segundos que me foram roubados.",
    bio: "Kairós carrega o peso de um minuto que nunca passou. Exilado de sua ordem após tentar desafiar as leis do fluxo vital, ele trocou as orações por cálculos cronomânticos. Suas tatuagens, outrora símbolos de bênçãos de cura, tornaram-se um mapa complexo de eras e possibilidades. Ele é um homem de poucas palavras e muita fumaça, cujo olhar calmo esconde uma mente que processa mil realidades por segundo. Para Kairós, a lealdade é a única constante no caos do tempo, e ele jurou que, desta vez, o ponteiro não parará antes que ele complete sua missão.",
    personalidade: ["Altruísta", "Disciplinado", "Obstinado"],
    rating: 5,
    stats: { str: 9, dex: 14, con: 14, conDisplay: '13+1', int: 17, intDisplay: '15+2', wis: 13, cha: 8 },
    classePericias: ["Intuição", "Medicina"],
    classeTalento: "",
    antecedente: "Personalizado",
    antecedentePericias: ["Arcanismo", "Furtividade"],
    antecedenteFerramentas: ["Ferramentas de ferreiro", "Ferramentas de sapateiro"],
    antecedenteTraco: "",
    equipamento: [
      {
        origem: "Clérigo",
        itens: [
          "Uma maça",
          "Cota de escamas",
          "Uma besta leve e 20 virotes",
          "Um escudo",
          "Mochila de explorador",
          "Um emblema"
        ]
      },
      {
        origem: "Caçador de Recompensas Urbanos",
        itens: [
          "Um conjunto de roupas adequadas às suas funções",
          "Uma bolsa contendo 20 po"
        ]
      }
    ],
    imagens: {
      avatar: "/imagens/fotos/Kairos.jpg",
      conceptArt: "/imagens/fotos/Kairos.jpg"
    }
  }
];

export default characters;
