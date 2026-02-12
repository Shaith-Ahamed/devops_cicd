package com.learn.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication

@Configuration

@EnableJpaAuditing
@ComponentScan(basePackages = {
		"com.learn.demo.user",
		"com.learn.demo.course","com.learn.demo.enrollment"

})
@EnableJpaRepositories(basePackages = {
		"com.learn.demo.user",
		"com.learn.demo.course","com.learn.demo.enrollment"
})
@EntityScan(basePackages = {
		"com.learn.demo.user",
		"com.learn.demo.course","com.learn.demo.enrollment"
})
public class DemoApplication {

	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}

	@Bean
	public WebMvcConfigurer corsConfigurer() {
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				registry.addMapping("/**")
						.allowedOrigins("*")  // Allow all origins for development
						.allowedMethods("*")
						.allowedHeaders("*");
			}
		};
	}

}
