from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.goto("http://localhost:3000", wait_until="networkidle")

    sections = ["about", "career", "ventures", "speaking", "credentials"]

    for sec in sections:
        locator = page.locator(f"#{sec}")
        locator.scroll_into_view_if_needed()
        page.wait_for_timeout(1000)
        locator.screenshot(path=f"screenshots/section_{sec}.png")
        print(f"Captured screenshots/section_{sec}.png")

    browser.close()
