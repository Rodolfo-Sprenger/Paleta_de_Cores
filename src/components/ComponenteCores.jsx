import { useState, useCallback, useEffect } from "react";

// Função que retorna uma string com uma cor aleatória em hexadecimal
function randomHexColor() {
  return (
    "#" +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")
  );
}

// Função para calcular cor do texto baseada no fundo
function getTextColor(hexColor) {
  const hex = hexColor.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#000000" : "#ffffff";
}

export default function ComponenteCores() {
  // Array de cores iniciais
  const [paleta, setPaleta] = useState([
    { hex: "#B31FF2", locked: false },
    { hex: "#4A90E2", locked: false },
    { hex: "#F39C12", locked: false },
    { hex: "#E74C3C", locked: false },
    { hex: "#2ECC71", locked: false },
  ]);

  const [copiado, setCopiado] = useState("");

  const gerarNovaPaleta = useCallback(() => {
    setPaleta((prev) =>
      prev.map((cor) =>
        cor.locked ? cor : { hex: randomHexColor(), locked: false }
      )
    );
  }, []);

  function copiarColor(hex) {
    // Tenta copiar
    navigator.clipboard
      .writeText(hex)
      .then(function () {
        // Se deu certo, mostra feedback positivo
        setCopiado(hex);
        // Remove o feedback depois de 2 segundos
        setTimeout(function () {
          setCopiado("");
        }, 2000);
      })
      .catch(function (erro) {
        // Se deu erro, mostra feedback de erro
        console.log("Não conseguiu copiar:", erro);
        setCopiado("erro");
        // Remove o feedback depois de 2 segundos
        setTimeout(function () {
          setCopiado("");
        }, 2000);
      });
  }

  const toggleLock = useCallback((index) => {
    setPaleta((prev) =>
      prev.map((cor, i) =>
        i === index ? { ...cor, locked: !cor.locked } : cor
      )
    );
  }, []);

  // Atalho de teclado para gerar nova paleta
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.code === "Space" && !event.target.matches("button, input")) {
        event.preventDefault();
        gerarNovaPaleta();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [gerarNovaPaleta]);

  return (
    <div className="flex flex-col min-h-screen bg-purple-200">
      {/* Header com botão de gerar nova paleta */}
      <div className="p-6 flex justify-center bg-purple-200 shadow-sm">
        <div className="flex flex-col items-center gap-2"> 
          <button
            onClick={gerarNovaPaleta}
            className="px-8 py-5 bg-purple-600 text-teal-200 rounded-lg shadow-md hover:bg-purple-700 hover:shadow-lg transition-all duration-200 font-medium border-2"
            aria-label="Gerar nova paleta de cores"
          >
            🎨 Gerar Nova Bytes_Paleta
          </button>
          <span className="text-sm text-gray-500">
            Pressione espaço para gerar nova Bytes_Paleta
          </span>
        </div>
      </div>

      {/* Paleta de cores */}
      <div className="flex flex-row flex-1">
        {paleta.map((cor, index) => {
          const textColor = getTextColor(cor.hex);
          const foiCopiado = copiado === cor.hex;
          const erroAoCopiar = copiado === "erro";

          return (
            <div
              key={index}
              className="w-1/5 flex flex-col justify-between items-center p-6 relative transition-all duration-300 hover:scale-105 rounded-md border-2"
              style={{ backgroundColor: cor.hex }}
            >
              {/* Indicador de cor travada */}
              {cor.locked && (
                <div className="absolute top-2 right-2 opacity-60">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: textColor }}
                  ></div>
                </div>
              )}

              {/* Código da cor com contraste automático */}
              <div className="text-center">
                <p
                  className="text-xl font-bold mb-2 font-mono"
                  style={{ color: textColor }}
                >
                  {cor.hex.toUpperCase()}
                </p>

                {/* Feedback de cópia */}
                {foiCopiado && (
                  <p
                    className="text-sm font-medium animate-pulse"
                    style={{ color: textColor }}
                  >
                    ✓ Copiado!
                  </p>
                )}
                {erroAoCopiar && (
                  <p
                    className="text-sm font-medium"
                    style={{ color: textColor }}
                  >
                    ⚠ Erro ao copiar
                  </p>
                )}
              </div>

              {/* Botões redondos com emojis */}
              <div className="flex flex-row gap-3">
                {/* Botão de copiar */}
                <button
                  className="w-12 h-12 flex items-center justify-center rounded-full shadow-md hover:shadow-lg transition-all duration-200 bg-purple-300 bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm text-xl border-2"
                  style={{ color: textColor }}
                  onClick={() => copiarColor(cor.hex)}
                  disabled={foiCopiado}
                  aria-label={`Copiar cor ${cor.hex}`}
                >
                  {foiCopiado ? "✓" : "📋"}
                </button>

                {/* Botão de travar/destravar */}
                <button
                  className={`w-12 h-12 flex items-center justify-center rounded-full shadow-md hover:shadow-lg transition-all duration-200 text-xl border-2 ${
                    cor.locked
                      ? "bg-red-300 bg-opacity-90 hover:bg-red-300 text-white"
                      : "bg-green-300 bg-opacity-90 hover:bg-green-300 text-white"
                  }`}
                  onClick={() => toggleLock(index)}
                  aria-label={cor.locked ? "Desbloquear cor" : "Bloquear cor"}
                >
                  {cor.locked ? "🔒" : "🔓"}
                </button>
              </div>

              {/* Nome da cor (simulado) */}
              <div className="mt-2 text-center">
                <p
                  className="text-xs opacity-70 font-medium"
                  style={{ color: textColor }}
                >
                  Cor {index + 1}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer com instruções */}
      <div className="bg-purple-200 p-4 shadow-sm">
        <div className="flex justify-center items-center gap-6 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            🔒 <span>Clique para travar/destravar</span>
          </span>
          <span className="flex items-center gap-1">
            📋 <span>Clique para copiar código hex</span>
          </span>
          <span className="flex items-center gap-1">
            ⌨️ <span>Barra de espaço = nova paleta</span>
          </span>
        </div>
      </div>
    </div>
  );
}
