package com.concessionaria.estoque.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
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
                        .requestMatchers(HttpMethod.POST, "/veiculos/**").hasRole("FUNCIONARIO")
                        .requestMatchers(HttpMethod.PUT, "/veiculos/**").hasRole("FUNCIONARIO")
                        .requestMatchers(HttpMethod.DELETE, "/veiculos/**").hasRole("FUNCIONARIO")
                        .anyRequest().authenticated()
                )
                .httpBasic(Customizer.withDefaults());

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService userDetailsService(PasswordEncoder passwordEncoder) {

        UserDetails funcionario = User.builder()
                .username("funcionario")
                .password(passwordEncoder.encode("SenhaTeste123!"))
                .roles("FUNCIONARIO")
                .build();

        UserDetails visitante = User.builder()
                .username("visitante")
                .password(passwordEncoder.encode("VisitanteTeste123!"))
                .roles("VISITANTE")
                .build();



        return new InMemoryUserDetailsManager(funcionario, visitante);
    }

}
