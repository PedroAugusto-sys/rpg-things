/**
 * Array de personagens de exemplo (D&D)
 * Cada personagem possui: id, nome, classe(s), nível, corTema, bio e caminhos de imagens
 */
const characters = [
  {
    id: "char-001",
    nome: "Ulfgar",
    titulo: "O Sangue de Jotun",
    classe: ["Bárbaro", "Caminho do Gigante"],
    nivel: 5,
    alinhamento: "Caótico e Bom",
    corTema: "#60a5fa",
    corAcento: "#eab308",
    citacao: "O ferro das algemas é frio, mas meu sangue ainda ferve.",
    bio: "Herdeiro do sangue dos gigantes, Ulfgar busca nos conflitos e no cárcere o limite de sua inabalável resistência. Enviado em uma missão de onde poucos retornam, ele vaga em busca de um artefato de poder que garanta sua ascensão. Ulfgar não busca a morte, mas a glória necessária para finalmente ser chamado de Homem-Gigante.",
    personalidade: ["Honrado", "Instintivo", "Resiliente"],
    stats: { str: 18, con: 16, dex: 12 },
    imagens: {
      avatar: "/imagens/fotos/Ulfgar.png",
      conceptArt: "/imagens/fotos/Ulfgar.png"
    }
  }
];

export default characters;
