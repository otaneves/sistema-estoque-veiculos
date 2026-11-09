package com.concessionaria.estoque.service;

import com.concessionaria.estoque.repository.UsuarioRepository;
import com.concessionaria.estoque.model.Usuario;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import java.util.List;
import java.util.Locale;


@Service
public class UsuarioDetailsService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioDetailsService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username)
        throws UsernameNotFoundException {

        String emailNormalizado = username.trim()
                .toLowerCase(Locale.ROOT);

        Usuario usuario = usuarioRepository.findByEmail(emailNormalizado)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "Usuário não encontrado."
                ));

        return new User(
                usuario.getEmail(),
                usuario.getSenhaHash(),
                List.of(
                        new SimpleGrantedAuthority(
                                "ROLE_" + usuario.getPerfil().name()
                        )
                )
        );
    }

}
