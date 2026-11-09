package com.concessionaria.estoque.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AutenticacaoTesteController {

    @GetMapping("/teste/autenticacao")
    public String autenticacao(Authentication authentication) {
        return "Autenticado como: " + authentication.getName();
    }
}
