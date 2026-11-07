package com.concessionaria.estoque.dto;

import com.concessionaria.estoque.model.Perfil;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public record UsuarioCadastroRequest (

        @NotBlank
        @Size(max = 100)
        String nome,

        @NotBlank
        @Email
        @Size(max = 150)
        String email,

        @NotBlank
        @Size(min = 12, max = 72)
        String senha,

        @NotNull
        Perfil perfil
) {
}
