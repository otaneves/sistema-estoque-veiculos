package com.concessionaria.estoque.service;

import com.concessionaria.estoque.model.StatusVeiculo;
import com.concessionaria.estoque.model.Veiculo;
import com.concessionaria.estoque.exception.VeiculoNaoEncontradoException;
import com.concessionaria.estoque.repository.VeiculoRepository;
import com.concessionaria.estoque.dto.VeiculoRequestDTO;

import org.springframework.stereotype.Service;

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

    public List<Veiculo> listarDisponiveis(){
        return veiculoRepository.findByStatus(StatusVeiculo.DISPONIVEL);
    }

    public Veiculo salvar(Veiculo veiculo){
        return veiculoRepository.save(veiculo);
    }

    public Veiculo salvar(VeiculoRequestDTO dados){

        Veiculo veiculo = new Veiculo();

        veiculo.setMarca(dados.getMarca());
        veiculo.setModelo(dados.getModelo());
        veiculo.setAno(dados.getAno());
        veiculo.setCor(dados.getCor());
        veiculo.setPreco(dados.getPreco());
        veiculo.setQuilometragem(dados.getQuilometragem());
        veiculo.setStatus(dados.getStatus());

        return salvar(veiculo);
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
