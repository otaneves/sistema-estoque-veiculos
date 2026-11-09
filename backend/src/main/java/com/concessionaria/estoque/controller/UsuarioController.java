package com.concessionaria.estoque.controller;

import com.concessionaria.estoque.service.UsuarioService;
import com.concessionaria.estoque.dto.UsuarioResponse;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PathVariable;
import java.util.List;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping
    public List<UsuarioResponse> listarTodos(Authentication authentication) {
        return usuarioService.listarTodos(authentication);
    }

    @GetMapping("/{id}")
    public UsuarioResponse buscarPorId(@PathVariable Long id, Authentication authentication) {
         return usuarioService.buscarPorId(id, authentication);
    }

}
