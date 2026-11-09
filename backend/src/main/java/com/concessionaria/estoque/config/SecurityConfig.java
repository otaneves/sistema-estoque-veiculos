package com.concessionaria.estoque.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                    .requestMatchers(HttpMethod.GET, "/veiculos/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/veiculos/**").hasAnyRole("FUNCIONARIO", "GERENTE", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/veiculos/**").hasAnyRole("FUNCIONARIO", "GERENTE", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/veiculos/**").hasAnyRole("GERENTE", "ADMIN")
                        .requestMatchers("/usuarios", "/usuarios/**").hasAnyRole("GERENTE", "ADMIN")
                        .anyRequest().authenticated()
                )
                .httpBasic(Customizer.withDefaults());

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


}
