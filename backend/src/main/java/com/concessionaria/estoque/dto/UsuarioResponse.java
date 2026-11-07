package com.concessionaria.estoque.dto;

import com.concessionaria.estoque.model.Perfil;
import com.concessionaria.estoque.model.Usuario;

public record UsuarioResponse(
        Long id,
        String nome,
        String email,
        Perfil perfil
) {

    public static UsuarioResponse fromEntity(Usuario usuario) {
        return new UsuarioResponse(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getPerfil()
        );
    }

}
