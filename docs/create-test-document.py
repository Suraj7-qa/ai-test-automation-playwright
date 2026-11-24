from docx import Document
from docx.shared import Inches, Pt
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_CELL_VERTICAL_ALIGNMENT
from docx.enum.section import WD_SECTION
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from pathlib import Path
import re

ROOT = Path(r"C:\Users\suraj\Demo-Web-Shop\Demo-Web-Shop")
OUTPUT = ROOT / "docs" / "Demo-Web-Shop-Test-Documentation.docx"
SOURCES = [
    (ROOT / "docs" / "Test-Plan-E2E.md", "Test Plan"),
    (ROOT / "docs" / "Traceability-Matrix.md", "Traceability Matrix"),
]

def set_cell_shading(cell, fill):
    tc_pr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:fill"), fill)
    tc_pr.append(shd)

def set_repeat_table_header(row):
    tr_pr = row._tr.get_or_add_trPr()
    tbl_header = OxmlElement("w:tblHeader")
    tbl_header.set(qn("w:val"), "true")
    tr_pr.append(tbl_header)

def add_markdown_table(document, lines):
    rows = []
    for line in lines:
        if line.strip().startswith("|"):
            parts = [p.strip() for p in line.strip().strip("|").split("|")]
            if all(re.fullmatch(r"[-: ]+", p) for p in parts):
                continue
            rows.append(parts)
    if not rows:
        return
    table = document.add_table(rows=len(rows), cols=len(rows[0]))
    table.style = "Table Grid"
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = True
    for r_idx, row_data in enumerate(rows):
        for c_idx, value in enumerate(row_data):
            cell = table.rows[r_idx].cells[c_idx]
            cell.text = value
            cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
            if r_idx == 0:
                set_cell_shading(cell, "1F4E78")
                for run in cell.paragraphs[0].runs:
                    run.font.bold = True
                    run.font.color.rgb = __import__("docx").shared.RGBColor(255, 255, 255)
    set_repeat_table_header(table.rows[0])
    document.add_paragraph()

def add_frontmatter(document, text):
    if not text.startswith("---"):
        return
    match = re.match(r"^---\s*\n(.*?)\n---\s*\n", text, re.S)
    if not match:
        return
    document.add_heading("Document Metadata", level=2)
    for line in match.group(1).splitlines():
        if ":" in line:
            key, value = line.split(":", 1)
            p = document.add_paragraph(style="List Bullet")
            p.add_run(key.strip() + ": ").bold = True
            p.add_run(value.strip().strip('"'))

def add_markdown(document, source):
    text = source.read_text(encoding="utf-8")
    text = re.sub(r"^---\s*\n.*?\n---\s*\n", "", text, count=1, flags=re.S)
    lines = text.splitlines()
    i = 0
    in_table = False
    table_lines = []

    while i < len(lines):
        line = lines[i].rstrip()
        stripped = line.strip()

        if stripped.startswith("|"):
            table_lines.append(line)
            in_table = True
            i += 1
            continue

        if in_table:
            add_markdown_table(document, table_lines)
            table_lines = []
            in_table = False

        if not stripped:
            i += 1
            continue

        heading = re.match(r"^(#{1,6})\s+(.*)$", stripped)
        if heading:
            level = len(heading.group(1))
            document.add_heading(heading.group(2), level=min(level, 9))
        elif re.match(r"^[-*]\s+", stripped):
            p = document.add_paragraph(style="List Bullet")
            p.add_run(re.sub(r"^[-*]\s+", "", stripped))
        elif re.match(r"^\d+[.)]\s+", stripped):
            p = document.add_paragraph(style="List Number")
            p.add_run(re.sub(r"^\d+[.)]\s+", "", stripped))
        elif stripped.startswith(">"):
            p = document.add_paragraph()
            r = p.add_run(stripped.lstrip("> "))
            r.italic = True
        elif stripped.startswith("---"):
            p = document.add_paragraph()
            p.paragraph_format.space_after = Pt(8)
        else:
            paragraph = document.add_paragraph()
            paragraph.add_run(stripped)
        i += 1

    if in_table:
        add_markdown_table(document, table_lines)

document = Document()
section = document.sections[0]
section.top_margin = Inches(0.75)
section.bottom_margin = Inches(0.75)
section.left_margin = Inches(0.75)
section.right_margin = Inches(0.75)

styles = document.styles
styles["Normal"].font.name = "Aptos"
styles["Normal"].font.size = Pt(10)
for level, size in [(1, 18), (2, 15), (3, 12), (4, 11)]:
    styles[f"Heading {level}"].font.name = "Aptos Display"
    styles[f"Heading {level}"].font.size = Pt(size)
    styles[f"Heading {level}"].font.bold = True
    styles[f"Heading {level}"].font.color.rgb = __import__("docx").shared.RGBColor(31, 78, 121)

title = document.add_heading("Demo Web Shop - Test Documentation", level=1)
title.alignment = WD_ALIGN_PARAGRAPH.CENTER
subtitle = document.add_paragraph()
subtitle.alignment = WD_ALIGN_PARAGRAPH.CENTER
subtitle.add_run("Test Plan and Traceability Matrix").bold = True
meta = document.add_paragraph()
meta.alignment = WD_ALIGN_PARAGRAPH.CENTER
meta.add_run("Generated: 2026-11-23\nAuthor: Suraj Navgire")
document.add_page_break()

for index, (source, document_name) in enumerate(SOURCES):
    document.add_heading(document_name, level=1)
    add_markdown(document, source)
    if index < len(SOURCES) - 1:
        document.add_page_break()

core_properties = document.core_properties
core_properties.title = "Demo Web Shop - Test Documentation"
core_properties.subject = "Test Plan and Traceability Matrix"
core_properties.author = "Suraj Navgire"
core_properties.keywords = "Playwright, Test Plan, Traceability, Automation"

document.save(OUTPUT)
print(OUTPUT)
