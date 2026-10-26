package com.concessionaria.estoque.controller;

import com.concessionaria.estoque.service.VeiculoService;
import com.concessionaria.estoque.model.Veiculo;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/veiculos")
public class VeiculoController {

    private final VeiculoService veiculoService;

    public VeiculoController(VeiculoService veiculoService){
        this.veiculoService = veiculoService;
    }

    @GetMapping
    public List<Veiculo> listarTodos(){
        return veiculoService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Veiculo> buscarPorId(@PathVariable Long id) {

        Veiculo veiculo = veiculoService.buscarPorId(id);

        return ResponseEntity.ok(veiculo);
    }

    @PostMapping
    public ResponseEntity<Veiculo> cadastrar(@Valid @RequestBody Veiculo veiculo){

        Veiculo veiculoSalvo = veiculoService.salvar(veiculo);

        return ResponseEntity.ok(veiculoSalvo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Veiculo> atualizar(@PathVariable Long id,
                                             @Valid @RequestBody Veiculo dadosAtualizados) {

        Veiculo veiculoAtualizado = veiculoService.atualizar(id,dadosAtualizados);

        return ResponseEntity.ok(veiculoAtualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {

        veiculoService.excluir(id);

        return ResponseEntity.noContent().build();
    }

}
