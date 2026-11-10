package com.concessionaria.estoque.repository;

import com.concessionaria.estoque.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario,Long>{

    Optional<Usuario> findByEmail(String email);

    @org.springframework.data.jpa.repository.Lock(jakarta.persistence.LockModeType.PESSIMISTIC_WRITE)
    java.util.List<Usuario> findByPerfilOrderByIdAsc(com.concessionaria.estoque.model.Perfil perfil);

    boolean existsByEmail(String email);

}
