package com.learn.demo.ui;

import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class SignUpTest extends BaseTest {

    @Test
    public void testSignUp() throws InterruptedException {
        driver.get("http://localhost:5173/register"); // adjust frontend URL

        driver.findElement(By.id("name")).sendKeys("test user");
        driver.findElement(By.id("email")).sendKeys("testuser@gmail.com");
        driver.findElement(By.id("password")).sendKeys("password123");
        driver.findElement(By.id("confirmPassword")).sendKeys("password123");

        driver.findElement(By.xpath("//button[@type='submit']")).click();

        Thread.sleep(2000);

        assertTrue(driver.getPageSource().contains("Welcome") ||
                driver.getPageSource().contains("Sign in"));
    }
}
