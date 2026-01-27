package com.learn.demo.runners;

import io.cucumber.junit.Cucumber;
import io.cucumber.junit.CucumberOptions;
import org.junit.runner.RunWith;

@RunWith(Cucumber.class)
@CucumberOptions(
        features = "src/test/resources/features",    // Path to .feature files
        glue = {"com.learn.demo.steps",
                "com.learn.demo.config"},             // Package for step definitions
        plugin = {"pretty", "html:target/cucumber-report.html"}
)
public class TestRunner {
}
