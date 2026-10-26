package com.concessionaria.estoque.service;

import com.concessionaria.estoque.model.Veiculo;
import com.concessionaria.estoque.exception.VeiculoNaoEncontradoException;

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

    public Veiculo buscarPorId(Long id){
        return veiculoRepository.findById(id).orElseThrow(() -> new VeiculoNaoEncontradoException(id));
    }

    public Veiculo salvar(Veiculo veiculo){
        return veiculoRepository.save(veiculo);
    }

    public Veiculo atualizar(Long id, Veiculo dadosAtualizados){

        Veiculo veiculo = buscarPorId(id);

        veiculo.setMarca(dadosAtualizados.getMarca());
        veiculo.setModelo(dadosAtualizados.getModelo());
        veiculo.setAno(dadosAtualizados.getAno());
        veiculo.setCor(dadosAtualizados.getCor());
        veiculo.setPreco(dadosAtualizados.getPreco());
        veiculo.setQuilometragem(dadosAtualizados.getQuilometragem());
        veiculo.setStatus(dadosAtualizados.getStatus());

        return veiculoRepository.save(veiculo);
    }

    public void excluir(Long id){

        Veiculo veiculo = buscarPorId(id);
        veiculoRepository.delete(veiculo);
    }










}
