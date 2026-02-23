/**
 * Cores base para tags de classe (estilo Discord)
 * Ciclo por índice para variedade
 */
const TAG_COLORS = [
  { bg: 'bg-blue-500/20', text: 'text-blue-300', border: 'border-blue-500/50' },
  { bg: 'bg-amber-500/20', text: 'text-amber-300', border: 'border-amber-500/50' },
  { bg: 'bg-emerald-500/20', text: 'text-emerald-300', border: 'border-emerald-500/50' },
  { bg: 'bg-rose-500/20', text: 'text-rose-300', border: 'border-rose-500/50' },
  { bg: 'bg-violet-500/20', text: 'text-violet-300', border: 'border-violet-500/50' },
  { bg: 'bg-cyan-500/20', text: 'text-cyan-300', border: 'border-cyan-500/50' },
];

function getTagStyle(index) {
  return TAG_COLORS[index % TAG_COLORS.length];
}

function getInitials(nome) {
  return nome
    .split(/\s+/)
    .map((s) => s[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function CharacterCard({ character, isActive, onSelect }) {
  const { nome, classe, corTema, imagens } = character;
  const avatarSrc = imagens?.avatar;

  return (
    <button
      type="button"
      onClick={() => onSelect(character)}
      className={`
        w-full max-w-[320px] text-left rounded-xl overflow-hidden
        bg-[#313338] shadow-lg transition-all duration-200
        hover:scale-[1.02] hover:shadow-xl
        focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1e1f22]
        ${isActive
          ? 'ring-2 ring-[#5865f2] ring-offset-2 ring-offset-[#1e1f22] shadow-[0_0_0_1px_#5865f2]'
          : 'ring-2 ring-transparent ring-offset-2 ring-offset-[#1e1f22]'
        }
      `}
    >
      {/* Banner (estilo Discord) */}
      <div
        className="h-16 w-full shrink-0"
        style={{ backgroundColor: corTema }}
      />

      {/* Conteúdo: avatar + nome + tags */}
      <div className="relative px-4 pb-4 pt-0">
        {/* Avatar sobrepondo o banner */}
        <div className="relative -mt-10 flex justify-start">
          <div
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-4 border-[#313338] text-xl font-bold text-white shadow-lg"
            style={{ backgroundColor: corTema }}
          >
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt=""
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              getInitials(nome)
            )}
          </div>
        </div>

        {/* Nome com cor do personagem */}
        <div className="mt-2">
          <span
            className="text-lg font-semibold"
            style={{ color: corTema }}
          >
            {nome}
          </span>
        </div>

        {/* Tags de classe */}
        <div className="mt-2 flex flex-wrap gap-1.5">
          {classe.map((c, i) => {
            const style = getTagStyle(i);
            return (
              <span
                key={`${c}-${i}`}
                className={`
                  inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium
                  ${style.bg} ${style.text} ${style.border}
                `}
              >
                {c}
              </span>
            );
          })}
        </div>
      </div>
    </button>
  );
}
