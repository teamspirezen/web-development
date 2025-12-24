import os
import re

# Configuration
WORKSPACE_DIR = r"d:\Work Sprietzen\Spirezen v3\Spirezen v3"
SOURCE_FILE = os.path.join(WORKSPACE_DIR, "index.html")
FOOTER_MARKER_START = "<!-- ===== GLASS FOOTER ===== -->"
FOOTER_MARKER_END = "</footer>"
SCRIPT_TAG = '<script src="footer.js"></script>'

def get_master_footer():
    with open(SOURCE_FILE, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Extract footer block
    pattern = re.compile(re.escape(FOOTER_MARKER_START) + r".*?" + re.escape(FOOTER_MARKER_END), re.DOTALL)
    match = pattern.search(content)
    
    if not match:
        raise Exception("Could not find master footer in index.html")
    
    return match.group(0)

def update_files(master_footer):
    updated_count = 0
    # Walk through directory
    for root, dirs, files in os.walk(WORKSPACE_DIR):
        for file in files:
            if file.endswith(".html") and file != "index.html":
                file_path = os.path.join(root, file)
                process_file(file_path, master_footer)
                updated_count += 1
    return updated_count

def process_file(file_path, master_footer):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # 1. Replace Footer
    # Try finding the standard marker first
    pattern = re.compile(r"<!-- ===== GLASS FOOTER ===== -->.*?</footer>", re.DOTALL)
    
    if pattern.search(content):
        new_content = pattern.sub(master_footer, content)
    else:
        # Fallback: Try to find any <footer>...</footer> block if the specific comment isn't there
        # but be careful not to replace something else. 
        # Given the project structure, looking for <footer class="footer-container"...</footer> might be safer if comment is missing
        fallback_pattern = re.compile(r"<footer class=\"footer-container\".*?</footer>", re.DOTALL)
        if fallback_pattern.search(content):
             new_content = fallback_pattern.sub(master_footer, content)
        else:
            print(f"Skipping footer replacement in {os.path.basename(file_path)}: No suitable footer block found.")
            new_content = content

    # 2. Inject footer.js if missing
    if "footer.js" not in new_content:
        # Insert before </body>
        if "</body>" in new_content:
            new_content = new_content.replace("</body>", f"{SCRIPT_TAG}\n</body>")
        else:
            new_content += f"\n{SCRIPT_TAG}"
            
    # Write back if changed
    if content != new_content:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"Updated: {os.path.basename(file_path)}")

if __name__ == "__main__":
    try:
        footer_block = get_master_footer()
        print("Successfully extracted master footer.")
        count = update_files(footer_block)
        print(f"Processed {count} files.")
    except Exception as e:
        print(f"Error: {e}")
