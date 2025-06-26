package org.example.etc;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        // Allow all origins (use patterns so you can still allow credentials if you ever need them)
        config.setAllowedOriginPatterns(List.of("*"));
        config.setAllowedMethods(List.of("*"));    // GET, POST, PUT, DELETE, OPTIONS, etc.
        config.setAllowedHeaders(List.of("*"));    // any header
        config.setAllowCredentials(false);         // false is fine if you don't need cookies

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> auth.anyRequest().permitAll())
                .httpBasic(b -> b.disable())
                .formLogin(f -> f.disable());
        return http.build();
    }
}
