// ─── CSS injecté une seule fois ───────────────────────────────────────────────
import { useRef, useState, useCallback, useEffect } from "react";

const CSS = `
@import url('https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.9.0/dist/tabler-icons.min.css');
 
.rte-wrap {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  width: 100%;
  max-width: 800px;
}
 
/* ── Toolbar ── */
.rte-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 3px;
  padding: 8px 10px;
  background: #f8f7f5;
  border: 1px solid #e0ddd6;
  border-bottom: none;
  border-radius: 10px 10px 0 0;
  align-items: center;
}
.rte-sep {
  width: 1px;
  height: 20px;
  background: #dddad2;
  margin: 0 3px;
  flex-shrink: 0;
}
 
/* ── Boutons toolbar ── */
.rte-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border: 1px solid transparent;
  border-radius: 6px;
  background: transparent;
  cursor: pointer;
  color: #666;
  font-size: 15px;
  transition: background 0.12s, color 0.12s, border-color 0.12s;
  padding: 0;
  flex-shrink: 0;
}
.rte-btn:hover {
  background: #fff;
  color: #1a1a1a;
  border-color: #ccc;
}
.rte-btn.active {
  background: #fff;
  color: #1a1a1a;
  border-color: #aaa;
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.06);
}
.rte-btn:disabled {
  opacity: 0.35;
  cursor: default;
}
 
/* ── Select format ── */
.rte-select {
  height: 28px;
  padding: 0 8px;
  font-size: 12px;
  font-family: inherit;
  border: 1px solid #dddad2;
  border-radius: 6px;
  background: #fff;
  color: #1a1a1a;
  cursor: pointer;
  outline: none;
  flex-shrink: 0;
}
.rte-select:focus {
  border-color: #888;
}
 
/* ── Bouton couleur ── */
.rte-color-btn {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  width: 30px;
  height: 30px;
  border: 1px solid #dddad2;
  border-radius: 6px;
  cursor: pointer;
  background: #fff;
  padding: 4px;
  flex-shrink: 0;
  transition: border-color 0.12s;
}
.rte-color-btn:hover {
  border-color: #aaa;
}
.rte-color-swatch {
  width: 18px;
  height: 5px;
  border-radius: 2px;
}
.rte-color-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  pointer-events: none;
}
 
/* ── Zone d'édition ── */
.rte-editor {
  min-height: 200px;
  max-height: 520px;
  overflow-y: auto;
  padding: 14px 18px;
  border: 1px solid #e0ddd6;
  border-radius: 0 0 10px 10px;
  background: #fff;
  color: #1a1a1a;
  font-size: 15px;
  line-height: 1.75;
  outline: none;
  transition: border-color 0.15s;
  word-break: break-word;
}
.rte-editor:focus {
  border-color: #888;
  box-shadow: 0 0 0 3px rgba(0,0,0,0.05);
}
.rte-editor:empty::before {
  content: attr(data-placeholder);
  color: #bbb;
  pointer-events: none;
}
 
/* ── Styles typographiques dans l'éditeur ── */
.rte-editor h1 { font-size: 1.9em; font-weight: 600; margin: 0.4em 0; }
.rte-editor h2 { font-size: 1.5em; font-weight: 600; margin: 0.4em 0; }
.rte-editor h3 { font-size: 1.2em; font-weight: 600; margin: 0.4em 0; }
.rte-editor p  { margin: 0.2em 0; }
.rte-editor pre {
  font-family: "Fira Code", "Courier New", monospace;
  background: #f3f2ef;
  border: 1px solid #e0ddd6;
  border-radius: 6px;
  padding: 10px 14px;
  font-size: 13px;
  overflow-x: auto;
}
.rte-editor ul, .rte-editor ol { padding-left: 1.6em; margin: 0.3em 0; }
.rte-editor a { color: #1a6ef5; text-decoration: underline; }
.rte-editor blockquote {
  border-left: 3px solid #dddad2;
  margin: 0.5em 0;
  padding: 4px 0 4px 16px;
  color: #555;
  font-style: italic;
}
 
/* ── Footer ── */
.rte-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  padding: 0 2px;
}
.rte-count {
  font-size: 12px;
  color: #999;
}
.rte-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}
.rte-clear-btn {
  font-size: 12px;
  font-family: inherit;
  color: #888;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background 0.12s, color 0.12s;
}
.rte-clear-btn:hover {
  background: #f0ede8;
  color: #1a1a1a;
}
.rte-submit-btn {
  font-size: 13px;
  font-family: inherit;
  color: #fff;
  background: #1a1a1a;
  border: none;
  cursor: pointer;
  padding: 6px 16px;
  border-radius: 6px;
  font-weight: 500;
  transition: background 0.12s, transform 0.08s;
}
.rte-submit-btn:hover  { background: #333; }
.rte-submit-btn:active { transform: scale(0.97); }
 
/* ── Dark mode ── */
@media (prefers-color-scheme: dark) {
  .rte-toolbar  { background: #1e1e1e; border-color: #333; }
  .rte-sep      { background: #3a3a3a; }
  .rte-btn      { color: #aaa; }
  .rte-btn:hover, .rte-btn.active { background: #2c2c2c; color: #f0f0f0; border-color: #555; }
  .rte-select   { background: #2c2c2c; border-color: #444; color: #f0f0f0; }
  .rte-color-btn { background: #2c2c2c; border-color: #444; }
  .rte-editor   { background: #141414; border-color: #333; color: #f0f0f0; }
  .rte-editor:focus { border-color: #666; box-shadow: 0 0 0 3px rgba(255,255,255,0.04); }
  .rte-editor pre { background: #1e1e1e; border-color: #333; color: #f0f0f0; }
  .rte-editor a { color: #6fa8ff; }
  .rte-editor blockquote { border-color: #444; color: #aaa; }
  .rte-clear-btn:hover { background: #2a2a2a; color: #f0f0f0; }
  .rte-submit-btn { background: #f0f0f0; color: #111; }
  .rte-submit-btn:hover { background: #fff; }
  .rte-count { color: #666; }
}
`;
 
// ─── Groupes de commandes ─────────────────────────────────────────────────────
const FORMAT_CMDS = [
  { cmd: "bold",          icon: "ti-bold",          title: "Gras (Ctrl+B)" },
  { cmd: "italic",        icon: "ti-italic",         title: "Italique (Ctrl+I)" },
  { cmd: "underline",     icon: "ti-underline",      title: "Souligné (Ctrl+U)" },
  { cmd: "strikeThrough", icon: "ti-strikethrough",  title: "Barré" },
];
 
const ALIGN_CMDS = [
  { cmd: "justifyLeft",   icon: "ti-align-left",    title: "Aligner à gauche" },
  { cmd: "justifyCenter", icon: "ti-align-center",  title: "Centrer" },
  { cmd: "justifyRight",  icon: "ti-align-right",   title: "Aligner à droite" },
  { cmd: "justifyFull",   icon: "ti-align-justified", title: "Justifié" },
];
 
const LIST_CMDS = [
  { cmd: "insertUnorderedList", icon: "ti-list",         title: "Liste à puces" },
  { cmd: "insertOrderedList",   icon: "ti-list-numbers", title: "Liste numérotée" },
];
 
const INDENT_CMDS = [
  { cmd: "outdent", icon: "ti-indent-decrease", title: "Réduire le retrait" },
  { cmd: "indent",  icon: "ti-indent-increase", title: "Augmenter le retrait" },
];
 
const LINK_CMDS = [
  { cmd: "createLink", icon: "ti-link",   title: "Insérer un lien" },
  { cmd: "unlink",     icon: "ti-unlink", title: "Supprimer le lien" },
];
 
const HISTORY_CMDS = [
  { cmd: "undo", icon: "ti-arrow-back-up",    title: "Annuler (Ctrl+Z)" },
  { cmd: "redo", icon: "ti-arrow-forward-up", title: "Rétablir (Ctrl+Y)" },
];
 
const ALL_STATEFUL = [
  "bold", "italic", "underline", "strikeThrough",
  "insertUnorderedList", "insertOrderedList",
  "justifyLeft", "justifyCenter", "justifyRight", "justifyFull",
];
 
// ─── Composant principal ──────────────────────────────────────────────────────
export default function RichTextarea({
  placeholder = "Commencez à écrire ici…",
  minHeight = 200,
  initialValue = "",
  onChange,
  onSubmit,
  submitLabel = "Envoyer",
  showSubmit = false,
  showClear = true,
}) {
  const editorRef = useRef(null);
  const colorInputRef = useRef(null);
  const [activeSet, setActiveSet] = useState(new Set());
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [color, setColor] = useState("#e24b4a");
 
  // Injecter le CSS une seule fois
  useEffect(() => {
    const id = "rte-styles";
    if (!document.getElementById(id)) {
      const style = document.createElement("style");
      style.id = id;
      style.textContent = CSS;
      document.head.appendChild(style);
    }
  }, []);
 
  // Valeur initiale
  useEffect(() => {
    if (editorRef.current && initialValue) {
      editorRef.current.innerHTML = initialValue;
      updateState();
    }
  }, []); // eslint-disable-line
 
  const updateState = useCallback(() => {
    const active = new Set(ALL_STATEFUL.filter(c => {
      try { return document.queryCommandState(c); } catch { return false; }
    }));
    setActiveSet(active);
 
    const text = editorRef.current?.innerText ?? "";
    const chars = text.replace(/\n/g, "").length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    setCharCount(chars);
    setWordCount(words);
    onChange?.(editorRef.current?.innerHTML ?? "");
  }, [onChange]);
 
  const exec = useCallback((cmd, value = null) => {
    if (cmd === "createLink") {
      const url = prompt("URL du lien :", "https://");
      if (url) document.execCommand("createLink", false, url);
    } else {
      document.execCommand(cmd, false, value);
    }
    editorRef.current?.focus();
    updateState();
  }, [updateState]);
 
  const handleFormat = useCallback((e) => {
    document.execCommand("formatBlock", false, e.target.value);
    editorRef.current?.focus();
    updateState();
  }, [updateState]);
 
  const handleColorChange = useCallback((e) => {
    const val = e.target.value;
    setColor(val);
    document.execCommand("foreColor", false, val);
    editorRef.current?.focus();
    updateState();
  }, [updateState]);
 
  const handleClear = useCallback(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = "";
      editorRef.current.focus();
      updateState();
    }
  }, [updateState]);
 
  const handleSubmit = useCallback(() => {
    onSubmit?.({
      html: editorRef.current?.innerHTML ?? "",
      text: editorRef.current?.innerText ?? "",
    });
  }, [onSubmit]);
 
  // Empêcher le comportement par défaut sur mousedown pour ne pas perdre la sélection
  const preventBlur = (e) => e.preventDefault();
 
  const ToolbarBtn = ({ cmd, icon, title }) => (
    <button
      className={`rte-btn${activeSet.has(cmd) ? " active" : ""}`}
      title={title}
      aria-label={title}
      aria-pressed={activeSet.has(cmd)}
      onMouseDown={preventBlur}
      onClick={() => exec(cmd)}
    >
      <i className={`ti ${icon}`} aria-hidden="true" />
    </button>
  );
 
  const Separator = () => <div className="rte-sep" aria-hidden="true" />;
 
  return (
    <div className="rte-wrap" role="group" aria-label="Éditeur de texte enrichi">
      {/* ── Barre d'outils ── */}
      <div className="rte-toolbar" role="toolbar" aria-label="Options de mise en forme">
        {/* Format de bloc */}
        <select
          className="rte-select"
          title="Format du paragraphe"
          aria-label="Format du paragraphe"
          onMouseDown={preventBlur}
          onChange={handleFormat}
          defaultValue="p"
        >
          <option value="p">Paragraphe</option>
          <option value="h1">Titre 1</option>
          <option value="h2">Titre 2</option>
          <option value="h3">Titre 3</option>
          <option value="blockquote">Citation</option>
          <option value="pre">Code</option>
        </select>
 
        <Separator />
 
        {FORMAT_CMDS.map(c => <ToolbarBtn key={c.cmd} {...c} />)}
 
        <Separator />
 
        {ALIGN_CMDS.map(c => <ToolbarBtn key={c.cmd} {...c} />)}
 
        <Separator />
 
        {LIST_CMDS.map(c => <ToolbarBtn key={c.cmd} {...c} />)}
 
        <Separator />
 
        {INDENT_CMDS.map(c => <ToolbarBtn key={c.cmd} {...c} />)}
 
        <Separator />
 
        {LINK_CMDS.map(c => <ToolbarBtn key={c.cmd} {...c} />)}
 
        <Separator />
 
        {/* Couleur du texte */}
        <label
          className="rte-color-btn"
          title="Couleur du texte"
          aria-label="Couleur du texte"
          onMouseDown={preventBlur}
          style={{ position: "relative", cursor: "pointer" }}
        >
          <i className="ti ti-letter-a" style={{ fontSize: 14, lineHeight: 1 }} aria-hidden="true" />
          <div className="rte-color-swatch" style={{ background: color }} />
          <input
            ref={colorInputRef}
            type="color"
            className="rte-color-input"
            value={color}
            onChange={handleColorChange}
            tabIndex={-1}
          />
        </label>
 
        <Separator />
 
        {HISTORY_CMDS.map(c => <ToolbarBtn key={c.cmd} {...c} />)}
      </div>
 
      {/* ── Zone d'édition ── */}
      <div
        ref={editorRef}
        className="rte-editor"
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        style={{ minHeight }}
        spellCheck
        onInput={updateState}
        onKeyUp={updateState}
        onMouseUp={updateState}
        onFocus={updateState}
        role="textbox"
        aria-multiline="true"
        aria-label={placeholder}
      />
 
      {/* ── Footer ── */}
      <div className="rte-footer">
        <span className="rte-count">
          {charCount} car. · {wordCount} mot{wordCount !== 1 ? "s" : ""}
        </span>
        <div className="rte-actions">
          {showClear && (
            <button className="rte-clear-btn" onClick={handleClear}>
              Effacer
            </button>
          )}
          {showSubmit && (
            <button className="rte-submit-btn" onClick={handleSubmit}>
              {submitLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}