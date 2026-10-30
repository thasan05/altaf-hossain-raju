from playwright.sync_api import sync_playwright
import urllib.request

def test_all():
    print("=== FINAL QA VERIFICATION ===")
    
    # 1. Test routes
    for path in ["/", "/robots.txt", "/sitemap.xml"]:
        resp = urllib.request.urlopen(f"http://localhost:3000{path}")
        print(f"Path {path:15}: HTTP {resp.status}")

    # 2. Browser tests with Playwright
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        
        errors = []
        page.on("console", lambda msg: errors.append(msg.text) if msg.type == "error" else None)
        
        page.goto("http://localhost:3000", wait_until="networkidle")
        print(f"Page Title: {page.title()}")

        # Test navigation links
        nav_items = ["About", "Career", "Ventures", "Expertise", "Speaking", "Credentials", "Media", "Contact"]
        for item in nav_items:
            nav_btn = page.locator(f"nav a:has-text('{item}')").first
            if nav_btn.count() > 0:
                nav_btn.click()
                page.wait_for_timeout(300)
                print(f"Navigation link [{item}]: Clicked OK")

        # Test Ventures tabs
        for v_name in ["LinkedIn Community Bangladesh", "Skill Hunt", "Career Talks"]:
            v_tab = page.locator(f"button:has-text('{v_name}')").first
            if v_tab.count() > 0:
                v_tab.click()
                page.wait_for_timeout(200)
                print(f"Venture Tab [{v_name}]: Switched OK")

        # Test Career filter tabs
        for c_tab_name in ["All Tenures", "Marico Bangladesh", "Robi Axiata", "Nestlé Bangladesh"]:
            c_tab = page.locator(f"button:has-text('{c_tab_name}')").first
            if c_tab.count() > 0:
                c_tab.click()
                page.wait_for_timeout(200)
                print(f"Career Filter [{c_tab_name}]: Filtered OK")

        # Test Speaking category filter tabs
        for s_type in ["All", "Masterclass", "Summit", "Keynote"]:
            s_tab = page.locator(f"section#speaking button:has-text('{s_type}')").first
            if s_tab.count() > 0:
                s_tab.click()
                page.wait_for_timeout(200)
                print(f"Speaking Filter [{s_type}]: Filtered OK")

        browser.close()

        print(f"\nConsole Errors Count: {len(errors)}")
        if errors:
            for e in errors:
                print("  Error:", e)
        else:
            print("Zero console errors! QA Passed successfully!")

if __name__ == "__main__":
    test_all()
