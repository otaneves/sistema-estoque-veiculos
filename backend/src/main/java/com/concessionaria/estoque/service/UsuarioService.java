package com.concessionaria.estoque.service;

import com.concessionaria.estoque.dto.UsuarioAtualizacaoRequest;
import com.concessionaria.estoque.repository.UsuarioRepository;
import com.concessionaria.estoque.dto.UsuarioCadastroRequest;
import com.concessionaria.estoque.model.Perfil;
import com.concessionaria.estoque.model.Usuario;
import com.concessionaria.estoque.dto.UsuarioResponse;
import com.concessionaria.estoque.exception.EmailJaCadastradoException;
import com.concessionaria.estoque.exception.UsuarioNaoEncontradoException;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;
import jakarta.validation.Valid;
import java.util.Locale;
import java.util.List;

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

    public List<UsuarioResponse> listarTodos(Authentication authentication){

        Perfil perfilAutenticado = obterPerfilAutenticado(authentication);

        if (perfilAutenticado == Perfil.FUNCIONARIO){
            throw new SecurityException(
                "Funcionários não podem consultar usuários."
            );
        }

        List<Usuario> usuarios = usuarioRepository.findAll();

        return usuarios.stream()
                .filter(usuario -> perfilAutenticado == Perfil.ADMIN || usuario.getPerfil() == Perfil.FUNCIONARIO)
                .map(UsuarioResponse::fromEntity)
                .toList();

    }

    public UsuarioResponse buscarPorId(Long id, Authentication authentication){

        Perfil perfilAutenticado = obterPerfilAutenticado(authentication);

        if (perfilAutenticado == Perfil.FUNCIONARIO){
            throw new SecurityException(
                    "Funcionários não podem consultar usuários."
            );
        }

        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new UsuarioNaoEncontradoException(
                        "Usuário não encontrado."
                ));

        if (perfilAutenticado == Perfil.GERENTE
                && usuario.getPerfil() != Perfil.FUNCIONARIO) {
            throw new SecurityException(
                    "Gerentes só podem consultar funcionários."
            );
        }

        return UsuarioResponse.fromEntity(usuario);
    }

    @Transactional
    public UsuarioResponse atualizar(
            Long id, @Valid UsuarioAtualizacaoRequest request, Authentication authentication
    ) {
        Perfil perfilAutenticado = obterPerfilAutenticado(authentication);

        if (perfilAutenticado == Perfil.FUNCIONARIO){
            throw new SecurityException(
                    "Funcionários não podem atualizar usuários"
            );
        }

        List<Usuario> administradores = usuarioRepository.findByPerfilOrderByIdAsc(Perfil.ADMIN);

        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new UsuarioNaoEncontradoException(
                        "Usuário não encontrado."
                ));

        if (perfilAutenticado == Perfil.GERENTE
            && usuario.getPerfil() != Perfil.FUNCIONARIO) {
            throw new SecurityException("Gerentes só podem atualizar funcionários.");
        }

        String emailNormalizado = request.email()
                .trim()
                .toLowerCase(Locale.ROOT);

        boolean emailPertenceOutroUsuario = usuarioRepository
                .findByEmail(emailNormalizado)
                .filter(usuarioExistente ->
                        !usuarioExistente.getId().equals(usuario.getId())
                )
                .isPresent();

        if (emailPertenceOutroUsuario){
            throw new EmailJaCadastradoException(
                    "Email já cadastrado no sistema."
            );
        }

        if (request.perfil() != null && request.perfil() != usuario.getPerfil()) {
            if (perfilAutenticado != Perfil.ADMIN || administradores.stream().noneMatch(
                    admin -> admin.getEmail().equalsIgnoreCase(authentication.getName()))) {
                throw new SecurityException("Somente administradores podem alterar perfis.");
            }
            protegerAdministradores(usuario, administradores);
            usuario.setPerfil(request.perfil());
        }
        usuario.setNome(request.nome());
        usuario.setEmail(emailNormalizado);

        /* A restrição UNIQUE do banco também protege contra
        conflitos de e-mail em atualizações simultâneas*/

        Usuario usuarioAtualizado = usuarioRepository.save(usuario);

        return UsuarioResponse.fromEntity(usuarioAtualizado);
    }

    @Transactional
    public void excluir(Long id, Authentication authentication){

        Perfil perfilAutenticado = obterPerfilAutenticado(authentication);

        if (perfilAutenticado == Perfil.FUNCIONARIO){
            throw new SecurityException(
                    "Funcionários não podem excluir usuários."
            );
        }

        List<Usuario> administradores = usuarioRepository.findByPerfilOrderByIdAsc(Perfil.ADMIN);

        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new UsuarioNaoEncontradoException(
                        "Usuário não encontrado."
                ));

        if (perfilAutenticado == Perfil.GERENTE
            && usuario.getPerfil() != Perfil.FUNCIONARIO) {
            throw new SecurityException(
                    "Gerentes só podem excluir funcionários"
            );
        }

        String emailAutenticado = authentication.getName();

        Usuario usuarioAutenticado = usuarioRepository
                .findByEmail(emailAutenticado)
                .orElseThrow(() -> new UsuarioNaoEncontradoException(
                        "Usuário não encontrado."
                ));

        if (usuario.getId().equals(usuarioAutenticado.getId())) {
            throw new SecurityException(
                    "Você não pode excluir sua própria conta."
            );
        }

        protegerAdministradores(usuario, administradores);
        usuarioRepository.delete(usuario);
    }

    private void protegerAdministradores(Usuario alvo, List<Usuario> administradores) {
        if (alvo.getPerfil() == Perfil.ADMIN && administradores.size() <= 2) {
            throw new SecurityException("É necessário manter pelo menos dois administradores.");
        }
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
