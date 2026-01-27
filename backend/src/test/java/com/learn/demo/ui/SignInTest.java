package com.learn.demo.ui;

import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class SignInTest extends BaseTest {

    @Test
    public void testSignIn() throws InterruptedException {
        driver.get("http://localhost:5173/login"); // adjust frontend URL

        driver.findElement(By.id("email")).sendKeys("testuser@gmail.com");
        driver.findElement(By.id("password")).sendKeys("password123");

        driver.findElement(By.xpath("//button[@type='submit']")).click();

        Thread.sleep(2000);

        assertTrue(driver.getPageSource().contains("Welcome testuser")
                || driver.getCurrentUrl().contains("/dashboard"));
    }
}
