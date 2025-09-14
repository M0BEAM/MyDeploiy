import time
import pickle
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.edge.service import Service
from selenium.webdriver.edge.options import Options
from webdriver_manager.microsoft import EdgeChromiumDriverManager
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def test_sqli(driver):
    print("🔍 Testing SQL Injection vulnerability...")

    # Clear email and password
    email_input = driver.find_element(By.NAME, "email")
    password_input = driver.find_element(By.NAME, "password")
    email_input.clear()
    password_input.clear()

    # Inject a basic SQLi payload
    sqli_payload = "' OR '1'='1"
    email_input.send_keys(sqli_payload)
    password_input.send_keys("randompass")

    driver.find_element(By.CSS_SELECTOR, "[data-testid='login-submit']").click()
    time.sleep(2)

    # Detect if login succeeded or error message is suspiciously absent
    page_source = driver.page_source.lower()
    if "invalid" not in page_source and "error" not in page_source:
        print("⚠️ Potential SQL Injection vulnerability detected!")
    else:
        print("✅ No SQL Injection vulnerability detected.")

def test_xss(driver):
    print("🔍 Testing XSS vulnerability...")

    # Clear email and password
    email_input = driver.find_element(By.NAME, "email")
    password_input = driver.find_element(By.NAME, "password")
    email_input.clear()
    password_input.clear()

    # Inject a simple XSS payload
    xss_payload = "<script>alert('xss')</script>"
    email_input.send_keys(xss_payload)
    password_input.send_keys("randompass")

    driver.find_element(By.CSS_SELECTOR, "[data-testid='login-submit']").click()
    time.sleep(2)

    # Check if the alert is triggered or payload reflected in page source
    # Since Selenium blocks alert by default, check page source for payload
    if xss_payload.lower() in driver.page_source.lower():
        print("⚠️ Potential XSS vulnerability detected!")
    else:
        print("✅ No XSS vulnerability detected.")

def run_login_and_tests():
    options = Options()
    # options.add_argument("--headless")  # Uncomment to run headless
    try:
        driver = webdriver.Edge(
        service=Service(EdgeChromiumDriverManager().install()),
        options=options
        )

  
        driver.get("http://localhost:3000/")

        # Click "Sign In"
        button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, "[data-testid='open-signin']"))
        )
        driver.execute_script("arguments[0].scrollIntoView(true);", button)
        time.sleep(0.5)
        driver.execute_script("arguments[0].click();", button)

        # Wait for login modal
        WebDriverWait(driver, 10).until(
            EC.visibility_of_element_located((By.NAME, "email"))
        )

        # Run SQL Injection test
        test_sqli(driver)

        # Refresh modal or page to reset form
        driver.refresh()
        WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, "[data-testid='open-signin']"))
        )
        button = driver.find_element(By.CSS_SELECTOR, "[data-testid='open-signin']")
        driver.execute_script("arguments[0].click();", button)
        WebDriverWait(driver, 10).until(
            EC.visibility_of_element_located((By.NAME, "email"))
        )

        # Run XSS test
        test_xss(driver)

        # Refresh modal or page again
        driver.refresh()
        WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, "[data-testid='open-signin']"))
        )
        button = driver.find_element(By.CSS_SELECTOR, "[data-testid='open-signin']")
        driver.execute_script("arguments[0].click();", button)
        WebDriverWait(driver, 10).until(
            EC.visibility_of_element_located((By.NAME, "email"))
        )

        # Now do the real login with valid credentials
        driver.find_element(By.NAME, "email").clear()
        driver.find_element(By.NAME, "email").send_keys("myDeploy@gmail.com")
        driver.find_element(By.NAME, "password").clear()
        driver.find_element(By.NAME, "password").send_keys("123456")
        driver.find_element(By.CSS_SELECTOR, "[data-testid='login-submit']").click()
        time.sleep(2)

        # Save cookies (optional)
        with open("cookies.pkl", "wb") as f:
            pickle.dump(driver.get_cookies(), f)

        print("✅ Login via modal successful.")

    finally:
        driver.quit()

if __name__ == "__main__":
    run_login_and_tests()
