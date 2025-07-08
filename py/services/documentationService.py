import os
import re
from pathlib import Path
from datetime import datetime

# 📁 Dossier où le script est lancé (où seront stockées les docs)
BASE_DIR = Path(__file__).parent
DOCS_DIR = BASE_DIR / "docs"
DOCS_DIR.mkdir(exist_ok=True)

# 🔍 Fonctions d’analyse
def document_ts_file(file_path: Path) -> str:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    doc = f"# 📄 {file_path.name} — Documentation générée\n"
    doc += f"*Chemin : `{file_path}`*\n\n"
    doc += f"> 🕒 Généré le {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n"

    if file_path.name.endswith(".component.ts"):
        doc += "## 🧠 Composant Angular\n"
        selectors = re.findall(r'selector:\s*[\'"`](.*?)[\'"`]', content)
        if selectors:
            doc += f"- Sélecteur : `{selectors[0]}`\n"
        inputs = re.findall(r'@Input\(\)\s*(\w+)', content)
        outputs = re.findall(r'@Output\(\)\s*(\w+)', content)
        methods = re.findall(r'(\w+)\s*\([^)]*\)\s*{', content)
        doc += f"- Inputs : {', '.join(inputs) or 'aucun'}\n"
        doc += f"- Outputs : {', '.join(outputs) or 'aucun'}\n"
        doc += "- Méthodes :\n"
        for m in methods:
            doc += f"  - `{m}()`\n"

    elif file_path.name.endswith(".service.ts"):
        doc += "## 🛠️ Service Angular\n"
        methods = re.findall(r'(\w+)\([^)]*\)\s*:\s*Observable<.*?>', content)
        for m in methods:
            doc += f"- Méthode API : `{m}()`\n"

    elif file_path.name.endswith(".routing.ts"):
        doc += "## 🧭 Fichier de routing\n"
        routes = re.findall(r"path:\s*[\'\"](.*?)[\'\"]", content)
        for route in routes:
            doc += f"- Route : `{route}`\n"

    else:
        doc += "_Type de fichier non reconnu pour la documentation._\n"

    return doc


def document_html_file(file_path: Path) -> str:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    doc = f"# 📄 {file_path.name} — Documentation HTML\n"
    doc += f"*Chemin : `{file_path}`*\n\n"
    doc += f"> 🕒 Généré le {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n"

    buttons = re.findall(r'<button[^>]*>(.*?)</button>', content, re.DOTALL)
    if buttons:
        doc += f"## 🔘 Boutons ({len(buttons)} trouvés)\n"
        for b in buttons:
            label = re.sub(r'<[^>]*>', '', b).strip()
            if label:
                doc += f"- `{label}`\n"

    links = re.findall(r'\[routerLink\]="?(.*?)"?', content)
    if links:
        doc += f"\n## 🔗 Liens routerLink\n"
        for l in links:
            doc += f"- {l}\n"

    return doc


# 🧠 Génère la doc selon le type de fichier
def generate_doc(file_path: Path) -> str:
    if file_path.name.endswith((".component.ts", ".service.ts", ".routing.ts")):
        return document_ts_file(file_path)
    elif file_path.name.endswith(".html"):
        return document_html_file(file_path)
    else:
        return None


# 🔁 Lancer le processus
def run_documentation_generator(paths: list[str]):
    for path_str in paths:
        path = Path(path_str)

        if not path.exists():
            print(f"❌ Chemin introuvable : {path}")
            continue

        files = []
        if path.is_dir():
            files = list(path.rglob("*.ts")) + list(path.rglob("*.html"))
        elif path.is_file():
            files = [path]

        for file in files:
            if not file.name.endswith((".component.ts", ".service.ts", ".routing.ts", ".html")):
                continue

            doc_content = generate_doc(file)
            if doc_content:
                doc_file_name = f"{file.stem}.md"
                output_path = DOCS_DIR / doc_file_name
                with open(output_path, "w", encoding="utf-8") as out:
                    out.write(doc_content)
                print(f"📘 Documentation générée pour : {file.name}")



