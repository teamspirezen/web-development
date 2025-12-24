import os
import re

# Logic:
# 1. Define the new footer content.
# 2. Iterate through all .html files in the current directory (skipping digitalaesthetics.html as source, though replacing it with itself is harmless).
# 3. Use regex to find <footer class="footer-container" ... </footer>.
# 4. Replace with new content.
# 5. Check if <script src="footer.js"></script> exists. If not, insert it before </body>.

DIRECTORY = r"d:\Work Sprietzen\Spirezen v3\Spirezen v3"

NEW_FOOTER = """<!-- ===== GLASS FOOTER ===== -->
<footer class="footer-container" aria-labelledby="footer-heading">
    <h2 id="footer-heading" class="visually-hidden">Site Footer</h2>

    <div class="footer-inner">
        <div class="footer-grid">
            <!-- Left: About Section -->
            <section class="footer-col footer-about" aria-labelledby="about-title">
                <img src="logo.svg" alt="Spirezen Logo" class="logofooter" />
                <h3 id="about-title" class="visually-hidden">About Spirezen</h3>
                <p class="footer-about-text">
                    At Spirezen Enterprises, we inspire excellence through education,
                    growth, and innovation. Founded with the mission to elevate minds
                    and empower futures, our team is committed to redefining learning
                    experiences in India and beyond.
                </p>
            </section>

            <!-- Center: Quick Links (collapsible on small screens) -->
            <nav class="footer-col footer-links" aria-labelledby="links-title">
                <div class="links-head">
                    <h4 id="links-title">QUICK LINKS</h4>
                    <button class="links-toggle" aria-expanded="false" aria-controls="quick-links-list"
                        aria-label="Toggle quick links">
                        ▾
                    </button>
                </div>
                <ul id="quick-links-list" class="quick-links" role="navigation">
                    <li><a href="index.html">HOME</a></li>
                    <li><a href="about.html">ABOUT US</a></li>
                    <li><a href="team.html">OUR TEAM</a></li>
                    <li><a href="portfolio.html">PORTFOLIO</a></li>
                    <li><a href="contact.html">CONTACT</a></li>
                    <li><a href="join.html">JOIN US</a></li>
                </ul>
            </nav>

            <!-- Right: Address & Contact -->
            <section class="footer-col footer-contact" aria-labelledby="contact-title">
                <h4 id="contact-title">OUR CORPORATE ADDRESS</h4>
                <address class="footer-address">
                    SPIREZEN ENTERPRISES Pvt Ltd.<br />
                    JS Bakers, Uliyampalayam,<br />
                    Thondamuthur, Coimbatore, Tamil Nadu, India — 641109
                </address>

                <h4>MAIL US</h4>
                <p>
                    <a class="footer-email" href="mailto:spirecare@spirezenenterprises.com">
                        spirecare@spirezenenterprises.com
                    </a>
                </p>

                <div class="social-media" aria-label="Social links">
                    <a class="social-link" href="https://www.instagram.com/spirezenenterprises" target="_blank"
                        rel="noopener" aria-label="Instagram">
                        <img src="instatosvg.svg" alt="Instagram" class="social-icon" />
                    </a>
                    <a class="social-link" href="#" target="_blank" rel="noopener" aria-label="Facebook">
                        <img src="facetosvg.svg" alt="Facebook" class="social-icon" />
                    </a>
                    <a class="social-link" href="https://x.com/Spirezen" target="_blank" rel="noopener"
                        aria-label="Twitter">
                        <img src="xtosvg.svg" alt="Twitter" class="social-icon" />
                    </a>
                    <a class="social-link" href="#" target="_blank" rel="noopener" aria-label="LinkedIn">
                        <img src="linkedintosvg.svg" alt="LinkedIn" class="social-icon" />
                    </a>
                </div>
            </section>
        </div>

        <div class="footer-bottom">
            <p>
                © <span id="current-year"></span>
                <span class="highlight">SPIREZEN ENTERPRISES Pvt Ltd.</span>, ALL
                RIGHTS RESERVED.
            </p>
            <button class="back-to-top" aria-label="Back to top">↑</button>
        </div>
    </div>
</footer>"""

SCRIPT_TAG = '<script src="footer.js"></script>'

def update_footer(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Regex to match existing footer
        # Matches <footer ... > ... </footer> non-greedy
        footer_pattern = re.compile(r'<footer.*?</footer>', re.DOTALL)
        
        if not footer_pattern.search(content):
            print(f"No footer found in: {os.path.basename(file_path)}")
            return

        new_content = footer_pattern.sub(NEW_FOOTER, content)

        # Check for footer.js
        if 'src="footer.js"' not in new_content:
             # Insert before </body>
             if '</body>' in new_content:
                 new_content = new_content.replace('</body>', f'\n{SCRIPT_TAG}\n</body>')
             else:
                 new_content += f'\n{SCRIPT_TAG}'

        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print(f"Updated: {os.path.basename(file_path)}")

    except Exception as e:
        print(f"Error processing {os.path.basename(file_path)}: {e}")

def main():
    print("Starting footer update...")
    if not os.path.exists(DIRECTORY):
        print("Directory not found!")
        return

    for filename in os.listdir(DIRECTORY):
        if filename.endswith(".html"):
             # Skip if you want, but user said "everything".
             # digitalaesthetics.html is the source, but replacing it with itself is fine (and ensures consistency if the var above is correct).
             update_footer(os.path.join(DIRECTORY, filename))

    print("Footer update complete.")

if __name__ == "__main__":
    main()
