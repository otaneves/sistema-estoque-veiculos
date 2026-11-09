package com.concessionaria.estoque.controller;

import com.concessionaria.estoque.service.UsuarioService;
import com.concessionaria.estoque.dto.UsuarioResponse;
import com.concessionaria.estoque.dto.UsuarioCadastroRequest;
import com.concessionaria.estoque.dto.UsuarioAtualizacaoRequest;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import jakarta.validation.Valid;
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

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UsuarioResponse cadastrar(@Valid @RequestBody UsuarioCadastroRequest request,
                                     Authentication authentication) {
        return usuarioService.cadastrar(request, authentication);
    }

    @PutMapping("/{id}")
    public UsuarioResponse atualizar(@PathVariable Long id,
                                     @Valid @RequestBody UsuarioAtualizacaoRequest request,
                                     Authentication authentication ) {
        return usuarioService.atualizar(id, request, authentication);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable Long id, Authentication authentication ) {
        usuarioService.excluir(id, authentication);
    }




}
