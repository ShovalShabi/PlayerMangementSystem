package org.example.etc;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Global CORS configuration.
 */
@Configuration
public class APIConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry
                .addMapping("/**")
                .allowedOriginPatterns("*")   // allow any origin
                .allowedMethods("*")          // allow GET, POST, PUT, DELETE, OPTIONS, etc.
                .allowedHeaders("*")          // allow any header
                .allowCredentials(false);     // must be false if you use "*" origin
    }
}
