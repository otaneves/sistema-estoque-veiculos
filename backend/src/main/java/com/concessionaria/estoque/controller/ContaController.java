package com.concessionaria.estoque.controller;

import com.concessionaria.estoque.dto.UsuarioResponse;
import com.concessionaria.estoque.repository.UsuarioRepository;
import java.security.Principal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ContaController {
    private final UsuarioRepository usuarios;

    public ContaController(UsuarioRepository usuarios) {
        this.usuarios = usuarios;
    }

    @GetMapping("/conta")
    public UsuarioResponse atual(Principal principal) {
        return UsuarioResponse.fromEntity(usuarios.findByEmail(principal.getName()).orElseThrow());
    }
}