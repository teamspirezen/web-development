
import os
from pypdf import PdfReader

def extract_text(pdf_path):
    try:
        reader = PdfReader(pdf_path)
        text = f"\n\n========================================\n--- START OF {os.path.basename(pdf_path)} ---\n========================================\n"
        for i, page in enumerate(reader.pages):
            text += f"\n[Page {i+1}]\n"
            text += page.extract_text() + "\n"
        text += f"\n--- END OF {os.path.basename(pdf_path)} ---\n"
        return text
    except Exception as e:
        return f"\nError reading {pdf_path}: {str(e)}\n"

base_dir = r"d:\Work Sprietzen\Spirezen v3\Spirezen v3\Ins"
files = ["Website.pdf", "Content of the website.pdf"]
output_file = r"d:\Work Sprietzen\Spirezen v3\Spirezen v3\pdf_content.txt"

with open(output_file, "w", encoding="utf-8") as f:
    for filename in files:
        path = os.path.join(base_dir, filename)
        if os.path.exists(path):
            f.write(extract_text(path))
        else:
            f.write(f"\nFile not found: {path}\n")

print("Done writing to pdf_content.txt")
