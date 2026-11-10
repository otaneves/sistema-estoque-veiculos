package com.concessionaria.estoque.service;

import com.concessionaria.estoque.model.StatusVeiculo;
import com.concessionaria.estoque.model.Veiculo;
import com.concessionaria.estoque.exception.VeiculoNaoEncontradoException;
import com.concessionaria.estoque.repository.VeiculoRepository;
import com.concessionaria.estoque.dto.VeiculoRequestDTO;
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

    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public List<String> fotosExtras(Long id) {
        return List.copyOf(buscarPorId(id).getFotosExtras());
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

    @org.springframework.transaction.annotation.Transactional
    public Veiculo salvar(VeiculoRequestDTO dados){

        Veiculo veiculo = new Veiculo();

        veiculo.setMarca(dados.getMarca());
        veiculo.setModelo(dados.getModelo());
        veiculo.setAno(dados.getAno());
        veiculo.setCor(dados.getCor());
        veiculo.setPreco(dados.getPreco());
        veiculo.setQuilometragem(dados.getQuilometragem());
        veiculo.setStatus(dados.getStatus());
        veiculo.setFoto(dados.getFoto());
        if (dados.getFotosExtras() != null) veiculo.getFotosExtras().addAll(dados.getFotosExtras());

        return salvar(veiculo);
    }


    @org.springframework.transaction.annotation.Transactional
    public Veiculo atualizar(Long id, VeiculoRequestDTO dadosAtualizados){

        Veiculo veiculo = buscarPorId(id);

        veiculo.setMarca(dadosAtualizados.getMarca());
        veiculo.setModelo(dadosAtualizados.getModelo());
        veiculo.setAno(dadosAtualizados.getAno());
        veiculo.setCor(dadosAtualizados.getCor());
        veiculo.setPreco(dadosAtualizados.getPreco());
        veiculo.setQuilometragem(dadosAtualizados.getQuilometragem());
        veiculo.setStatus(dadosAtualizados.getStatus());
        if (dadosAtualizados.getFotosExtras() != null) {
            veiculo.getFotosExtras().clear();
            veiculo.getFotosExtras().addAll(dadosAtualizados.getFotosExtras());
        }
        if (dadosAtualizados.getFoto() != null) veiculo.setFoto(dadosAtualizados.getFoto());

        return veiculoRepository.save(veiculo);
    }

    public void excluir(Long id){

        Veiculo veiculo = buscarPorId(id);
        veiculoRepository.delete(veiculo);
    }










}
