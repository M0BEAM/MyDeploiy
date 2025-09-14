import time
import os
import traceback
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.edge.service import Service
from selenium.webdriver.edge.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from webdriver_manager.microsoft import EdgeChromiumDriverManager
from concurrent.futures import ThreadPoolExecutor

# Create a folder for screenshots
os.makedirs("screenshots", exist_ok=True)

# Provided user IDs (will rotate if threads > 3)
USER_IDS = [
    "69fb970d-e83a-4e39-b90e-878960a3e7ff",
    "b8f98e83-0d48-488d-804e-dde514d9effa",
    "76141cf0-0a8f-4777-8b0e-fac18bf57620"
]

GITHUB_REPO = "https://github.com/mydeploy3/static.git"
DEPLOY_URL = "http://localhost:3000/dashboard/deploy/static/new"

def run_deploy_instance(thread_index):
    user_id = USER_IDS[thread_index % len(USER_IDS)]
    site_title = f"solo{thread_index + 1}"

    options = Options()
    # options.add_argument("--headless")  # Uncomment to run headless
    options.add_argument("--disable-gpu")
    options.add_argument("--window-size=1280,800")
    try:
        driver = webdriver.Edge(
        service=Service(EdgeChromiumDriverManager().install()),
        options=options
        )

        wait = WebDriverWait(driver, 50)
 
    
        # Step 1: Go to the base site to set domain context for cookies
        driver.get("http://localhost:3000")

        # Step 2: Go to deploy page
        driver.get(DEPLOY_URL)

        # Step 3: Fill the form
        wait.until(EC.presence_of_element_located((By.NAME, "userId"))).send_keys(user_id)
        wait.until(EC.presence_of_element_located((By.NAME, "siteTitle"))).send_keys(site_title)
        repo_input = wait.until(EC.element_to_be_clickable((By.NAME, "repo")))
        repo_input.clear()
        repo_input.send_keys(GITHUB_REPO)

        # Step 4: Click deploy button
        deploy_button = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "[data-testid='deploy-btn']")))
        deploy_button.click()

        # Step 5: Wait a bit for success or error message
        time.sleep(2)

        try:
            success = driver.find_element(By.CLASS_NAME, "success-message")
            print(f"✅ User {user_id[:6]}... deployed '{site_title}' — {success.text}")
        except NoSuchElementException:
            try:
                error = driver.find_element(By.CLASS_NAME, "error-message")
                print(f"❌ User {user_id[:6]}... failed to deploy '{site_title}' — UI Error: {error.text}")
            except NoSuchElementException:
                print(f"❌ User {user_id[:6]}... failed to deploy '{site_title}' — No visible error message")

        # Screenshot after deploy attempt
        driver.save_screenshot(f"screenshots/deploy_{site_title}.png")

    except Exception as e:
        # Save screenshot and print full traceback & debug info
        driver.save_screenshot(f"screenshots/exception_{site_title}.png")
        print(f"❌ User {user_id[:6]}... failed to deploy '{site_title}' — Exception:")
        traceback.print_exc()
        print(f"Current URL: {driver.current_url}")
        print(f"Page source snippet:\n{driver.page_source[:1000]}")

    finally:
        driver.quit()

def simulate_concurrent_deployments(user_count=5):
    print(f"🚀 Simulating {user_count} concurrent deploys...\n")
    with ThreadPoolExecutor(max_workers=user_count) as executor:
        for i in range(user_count):
            executor.submit(run_deploy_instance, thread_index=i)

if __name__ == "__main__":
    simulate_concurrent_deployments(user_count=5)
