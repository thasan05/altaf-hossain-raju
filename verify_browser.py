import os
from playwright.sync_api import sync_playwright

os.makedirs("screenshots", exist_ok=True)

def run():
    with sync_playwright() as p:
        # Launch browser
        browser = p.chromium.launch(headless=True)
        
        viewports = [
            ("desktop_1440", 1440, 900),
            ("laptop_1366", 1366, 768),
            ("tablet_768", 768, 1024),
            ("mobile_390", 390, 844),
        ]

        console_errors = []

        for name, width, height in viewports:
            context = browser.new_context(viewport={"width": width, "height": height})
            page = context.new_page()

            page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)

            print(f"Testing viewport: {name} ({width}x{height})")
            page.goto("http://localhost:3000", wait_until="networkidle")

            # Check title
            title = page.title()
            print(f"  Title: {title}")

            # Capture Hero viewport screenshot
            page.screenshot(path=f"screenshots/{name}_hero.png")
            print(f"  Saved screenshots/{name}_hero.png")

            # Capture Full Page screenshot
            page.screenshot(path=f"screenshots/{name}_full.png", full_page=True)
            print(f"  Saved screenshots/{name}_full.png")

            # Test interaction on Desktop: Test career tabs or ventures tabs
            if name == "desktop_1440":
                # Scroll to ventures and click second tab
                ventures_btn = page.locator("button:has-text('Skill Hunt')").first
                if ventures_btn.count() > 0:
                    ventures_btn.click()
                    page.wait_for_timeout(500)
                    page.screenshot(path="screenshots/desktop_ventures_skillhunt.png")
                    print("  Clicked Skill Hunt tab and captured screenshot")

                # Test contact form validation error
                submit_btn = page.locator("button:has-text('Transmit Inquiry')").first
                if submit_btn.count() > 0:
                    submit_btn.click()
                    page.wait_for_timeout(500)
                    page.screenshot(path="screenshots/desktop_contact_validation.png")
                    print("  Tested contact form validation and captured screenshot")

            context.close()

        browser.close()

        print("\n--- Console Errors Check ---")
        if console_errors:
            print(f"Found {len(console_errors)} console errors:")
            for err in console_errors:
                print("  ", err)
        else:
            print("ZERO console errors detected! Perfect!")

if __name__ == "__main__":
    run()
