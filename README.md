# Biblioteca de Personagens — Acervo RPG

Projeto React + Vite para exibir personagens de RPG (card, detalhes, neve, efeitos).

## Estrutura do projeto

```
meu-acervo-rpg/
├── public/           # Assets estáticos (imagens, áudios)
│   ├── audios/
│   └── imagens/
├── src/
│   ├── components/   # Componentes React
│   │   ├── CharacterCard.jsx
│   │   ├── CharacterShowcase.jsx
│   │   └── SnowCanvas.jsx
│   ├── data/        # Dados da aplicação
│   │   └── characters.js
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
└── eslint.config.js
```

## Scripts

- `npm run dev` — servidor de desenvolvimento
- `npm run build` — build para produção
- `npm run preview` — preview do build
- `npm run lint` — ESLint

## Dados

Personagens ficam em `src/data/characters.js`. Edite esse arquivo para alterar ou incluir personagens.

