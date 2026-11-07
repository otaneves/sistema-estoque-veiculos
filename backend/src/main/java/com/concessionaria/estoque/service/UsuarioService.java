package com.concessionaria.estoque.service;

import com.concessionaria.estoque.repository.UsuarioRepository;
import com.concessionaria.estoque.dto.UsuarioCadastroRequest;
import com.concessionaria.estoque.model.Perfil;
import com.concessionaria.estoque.model.Usuario;
import com.concessionaria.estoque.dto.UsuarioResponse;
import com.concessionaria.estoque.exception.EmailJaCadastradoException;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import jakarta.validation.Valid;
import java.util.Locale;

@Service
@Validated
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder
    ){
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UsuarioResponse cadastrar(@Valid UsuarioCadastroRequest request, Authentication authentication){

        Perfil perfilAutenticado = obterPerfilAutenticado(authentication);

        validarPermissaoCadastro(
          perfilAutenticado,
          request.perfil()
        );

        String emailNormalizado = request.email().trim().toLowerCase(Locale.ROOT);

        if(usuarioRepository.existsByEmail(emailNormalizado)){
            throw new EmailJaCadastradoException(
                    "Email já cadastrado no sistema."
            );
        }

        String senhaOriginal = request.senha();

        String senhaHash = passwordEncoder.encode(senhaOriginal);

        Usuario novoUsuario = new Usuario();

        novoUsuario.setNome(request.nome());
        novoUsuario.setEmail(emailNormalizado);
        novoUsuario.setPerfil(request.perfil());
        novoUsuario.definirSenhaHash(senhaHash);

        Usuario usuarioSalvo = usuarioRepository.save(novoUsuario);

        return UsuarioResponse.fromEntity(usuarioSalvo);
    }

    private void validarPermissaoCadastro(
        Perfil perfilAutenticado,
        Perfil perfilSolicitado
    ) {
       if (perfilAutenticado == null || perfilSolicitado == null) {
           throw new IllegalArgumentException(
                   "Perfil inválido para cadastro"
           );
       }

        if (perfilAutenticado == Perfil.FUNCIONARIO){
            throw new SecurityException(
                    "Funcionários não podem cadastrar usuários"
            );
        }

        if (perfilAutenticado == Perfil.GERENTE
                && perfilSolicitado != Perfil.FUNCIONARIO) {
            throw new SecurityException(
                    "Gerentes só podem cadastrar funcionários"
            );
        }

    }

    private Perfil obterPerfilAutenticado(Authentication authentication){

        if (authentication == null || !authentication.isAuthenticated()){
            throw new SecurityException("Usuário não autenticado");
        }

        if (authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))){
            return Perfil.ADMIN;
        }

        if (authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_GERENTE"))){
            return Perfil.GERENTE;
        }

        if (authentication.getAuthorities().stream()
            .anyMatch(a -> a.getAuthority().equals("ROLE_FUNCIONARIO"))){
            return Perfil.FUNCIONARIO;
        }

        throw new SecurityException("Usuário sem perfil autorizado");

    }

}
