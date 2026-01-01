import React, { useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";

function EditorPage() {
  const [mode, setMode] = useState("web");
  const [logs, setLogs] = useState([]);

  const [htmlCode, setHtmlCode] = useState(
    "<h1>Hello World</h1>\n<button id='btn'>Click me</button>"
  );
  const [cssCode, setCssCode] = useState(
    "body { font-family: sans-serif; padding: 20px; }\nh1 { color: #3498db; }"
  );
  const [jsCode, setJsCode] = useState(
    "document.getElementById('btn').onclick = () => {\n  console.log('Click detected!');\n  console.log('Width: ' + window.innerWidth);\n};"
  );
  const [pythonCode, setPythonCode] = useState(
    "print('Hello python')\nfor i in range(5):\n  print(i)"
  );
  const [srcDoc, setSrcDoc] = useState("");
  const [isOnPython, setIsOnPython] = useState(false);
  const [pyodide, setPyodide] = useState(null);
  const [isPyLoading, setIsPyLoading] = useState(false);

  // ----------------------------------------------------------------
  // LOGICA MODO WEB (Iframe + PostMessage)
  // ----------------------------------------------------------------

  // Escuchar mensajes que vienen del Iframe (para la consola)
  useEffect(() => {
    const handleMessage = event => {
      // Importante: validar origen en app real
      if (event.data && event.data.type === "console") {
        addToConsole(event.data.message);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const runWebCode = () => {
    setLogs([]); // Limpiar consola

    // Inyectamos un script "espía" que sobrescribe console.log dentro del iframe
    // y envía la info a nuestro React padre.
    const consoleProxyScript = `
      <script>
        const sendToParent = (msg) => window.parent.postMessage({ type: 'console', message: msg }, '*');
        
        // ReWrite console.log
        const originalLog = console.log;
        console.log = (...args) => {
          sendToParent(args.join(' '));
          originalLog.apply(console, args);
        };

        // ReWrite console.error
        window.onerror = (msg, url, line) => {
           sendToParent("Error: " + msg);
        };
      </script>
    `;

    const fullHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <script src="/tailwindcss.js"></script>

          <style>${cssCode}</style>
          ${consoleProxyScript}
        </head>
        <body>
          ${htmlCode}
          <script>${jsCode}<\/script>
        </body>
      </html>
    `;

    setSrcDoc(fullHTML);
  };

  // ----------------------------------------------------------------
  // LOGICA MODO PYTHON
  // ----------------------------------------------------------------

  const initPython = async () => {
    if (pyodide || isPyLoading) return;
    setIsPyLoading(true);
    addToConsole("Cargando motor de Python Local...");

    // 1. Verificamos si el script ya está en el HTML
    if (!window.loadPyodide) {
      const script = document.createElement("script");

      // CAMBIO 1: Apuntar a tu archivo local
      script.src = "/pyodide/pyodide.js";

      script.async = true;
      script.onload = async () => {
        setupPyodideInstance();
      };
      script.onerror = () => {
        addToConsole("Error: No se encontró pyodide.js en /public/pyodide/");
        setIsPyLoading(false);
      };
      document.body.appendChild(script);
    } else {
      setupPyodideInstance();
    }
  };

  const setupPyodideInstance = async () => {
    try {
      // CAMBIO 2: Decirle a Pyodide dónde buscar los archivos .wasm y .tar
      // 'indexURL' es obligatorio cuando lo usas localmente.
      const py = await window.loadPyodide({
        indexURL: "/pyodide/",
      });

      setPyodide(py);
      setIsPyLoading(false);
      addToConsole("Python Local Listo (Sin internet).");
    } catch (e) {
      addToConsole("Error iniciando Pyodide: " + e.message);
      setIsPyLoading(false);
    }
  };

  const runPythonCode = async () => {
    setLogs([]);
    if (!pyodide) {
      await initPython(); // Intentar cargar si no está
      return;
    }

    try {
      pyodide.setStdout({ batched: msg => addToConsole(msg) });
      await pyodide.runPythonAsync(pythonCode);
    } catch (err) {
      addToConsole("Error: " + err.message);
    }
  };

  // Helper común
  const addToConsole = txt => setLogs(prev => [...prev, String(txt)]);

  // ----------------------------------------------------------------
  // RENDER UI
  // ----------------------------------------------------------------
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#222",
        color: "#fff",
      }}
      className="w-full"
    >
      {/* HEADER DE CONTROL */}
      <div
        style={{
          padding: "10px",
          background: "#333",
          borderBottom: "1px solid #444",
          display: "flex",
          gap: "15px",
        }}
      >
        <select
          value={mode}
          onChange={e => {
            setMode(e.target.value);
            if (e.target.value === "python") initPython();
          }}
          style={{ padding: "5px", borderRadius: "4px" }}
        >
          <option
            className="text-black"
            value="web"
            onClick={() => setIsOnPython(false)}
          >
            Modo Web (HTML/CSS/JS)
          </option>
          <option
            className="text-black"
            value="python"
            onClick={() => setIsOnPython(true)}
          >
            Modo Python
          </option>
        </select>

        <button
          className="text-black"
          onClick={mode === "web" ? runWebCode : runPythonCode}
          style={{
            background: "#27ae60",
            border: "none",
            padding: "5px 15px",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          ▶ Ejecutar {mode === "web" ? "Web" : "Python"}
        </button>
      </div>

      {/* CUERPO PRINCIPAL */}
      <div style={{ flex: 1, display: "flex" }}>
        {/* COLUMNA IZQUIERDA (EDITORES) */}
        <div
          style={{
            width: "40%",
            display: "flex",
            flexDirection: "column",
            borderRight: "1px solid #444",
          }}
        >
          {mode === "web" ? (
            <>
              {/* Editor HTML */}
              <div
                style={{
                  flex: 1,
                  borderBottom: "1px solid #444",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <span
                  style={{
                    background: "#444",
                    padding: "2px 10px",
                    fontSize: "12px",
                  }}
                >
                  HTML
                </span>
                <CodeMirror
                  value={htmlCode}
                  height="100%"
                  extensions={[html()]}
                  onChange={setHtmlCode}
                  theme="dark"
                />
              </div>
              {/* Editor CSS */}
              <div
                style={{
                  flex: 1,
                  borderBottom: "1px solid #444",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <span
                  style={{
                    background: "#444",
                    padding: "2px 10px",
                    fontSize: "12px",
                  }}
                >
                  CSS
                </span>
                <CodeMirror
                  value={cssCode}
                  height="100%"
                  extensions={[css()]}
                  onChange={setCssCode}
                  theme="dark"
                />
              </div>
              {/* Editor JS */}
              <div
                style={{ flex: 1, display: "flex", flexDirection: "column" }}
              >
                <span
                  style={{
                    background: "#444",
                    padding: "2px 10px",
                    fontSize: "12px",
                  }}
                >
                  JS
                </span>
                <CodeMirror
                  value={jsCode}
                  height="100%"
                  extensions={[javascript()]}
                  onChange={setJsCode}
                  theme="dark"
                />
              </div>
            </>
          ) : (
            /* Editor Python (Ocupa todo el alto si está activo) */
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  background: "#306998",
                  padding: "2px 10px",
                  fontSize: "12px",
                }}
              >
                PYTHON
              </span>
              <CodeMirror
                value={pythonCode}
                height="100%"
                extensions={[python()]}
                onChange={setPythonCode}
                theme="dark"
              />
            </div>
          )}
        </div>

        {/* COLUMNA DERECHA (RESULTADO + CONSOLA) */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {/* AREA DE VISUALIZACION (PREVIEW) */}
          {mode == "web" && (
            <div style={{ flex: 1, background: "white", position: "relative" }}>
              {mode === "web" ? (
                <iframe
                  title="preview"
                  srcDoc={srcDoc}
                  style={{ width: "100%", height: "100%", border: "none" }}
                  sandbox="allow-scripts" // Importante para seguridad básica
                />
              ) : (
                <div style={{ padding: "20px", color: "#333" }}>
                  <h3>Vista Previa no disponible en Python</h3>
                  <p>
                    Python en este modo solo corre lógica de consola. Mira abajo
                    ↓
                  </p>
                </div>
              )}
            </div>
          )}
          {/* CONSOLA COMPARTIDA */}
          <div
            style={{
              background: "#111",
              color: "#0f0",
              borderTop: "2px solid #555",
              padding: "10px",
              overflowY: "auto",
              fontFamily: "monospace",
            }}
            className={`${mode === "web" ? "h-[150px]" : "h-full"}`}
          >
            <div style={{ color: "#888", marginBottom: "5px" }}>
              CONSOLE TERMINAL:
            </div>
            {logs.map((log, i) => (
              <div
                key={i}
                style={{ borderBottom: "1px solid #222" }}
              >{`> ${log}`}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditorPage;
