package com.concessionaria.estoque.service;

import com.concessionaria.estoque.model.Veiculo;
import org.springframework.stereotype.Service;
import com.concessionaria.estoque.repository.VeiculoRepository;

import java.util.List;
import java.util.Optional;

@Service
public class VeiculoService {

    private final VeiculoRepository veiculoRepository;

    public VeiculoService(VeiculoRepository veiculoRepository){
        this.veiculoRepository = veiculoRepository;
    }

    public List<Veiculo> listarTodos(){
        return veiculoRepository.findAll();
    }

    public Optional<Veiculo> buscarPorId(Long id){
        return veiculoRepository.findById(id);
    }

    public Veiculo salvar(Veiculo veiculo){
        return veiculoRepository.save(veiculo);
    }

    public Optional<Veiculo> atualizar(Long id, Veiculo dadosAtualizados){

        Optional<Veiculo> veiculoExistente = veiculoRepository.findById(id);

        if (veiculoExistente.isEmpty()) {
            return Optional.empty();
        }

        Veiculo veiculo = veiculoExistente.get();

        veiculo.setMarca(dadosAtualizados.getMarca());
        veiculo.setModelo(dadosAtualizados.getModelo());
        veiculo.setAno(dadosAtualizados.getAno());
        veiculo.setCor(dadosAtualizados.getCor());
        veiculo.setPreco(dadosAtualizados.getPreco());
        veiculo.setQuilometragem(dadosAtualizados.getQuilometragem());
        veiculo.setStatus(dadosAtualizados.getStatus());

        Veiculo veiculoSalvo = veiculoRepository.save(veiculo);

        return Optional.of(veiculoSalvo);
    }

    public boolean excluir(Long id){
        if (!veiculoRepository.existsById(id)){
            return false;
        }

        veiculoRepository.deleteById(id);
        return true;
    }










}
