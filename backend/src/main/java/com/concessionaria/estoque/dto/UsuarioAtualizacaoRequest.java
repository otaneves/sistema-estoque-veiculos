package com.concessionaria.estoque.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UsuarioAtualizacaoRequest(
        @NotBlank
        @Size(max =100)
        String nome,

        @NotBlank
        @Email
        @Size(max = 150)
        String email,
        com.concessionaria.estoque.model.Perfil perfil
) {
}
