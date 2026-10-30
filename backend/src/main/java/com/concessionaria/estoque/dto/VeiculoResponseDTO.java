package com.concessionaria.estoque.dto;

import com.concessionaria.estoque.model.StatusVeiculo;
import com.concessionaria.estoque.model.Veiculo;

import java.math.BigDecimal;

public class VeiculoResponseDTO {

    private Long id;

    private String marca;

    private String modelo;

    private Integer ano;

    private String cor;

    private BigDecimal preco;

    private Integer quilometragem;

    private StatusVeiculo status;

    public VeiculoResponseDTO(Veiculo veiculo) {
        this.id = veiculo.getId();
        this.marca = veiculo.getMarca();
        this.modelo = veiculo.getModelo();
        this.ano = veiculo.getAno();
        this.cor = veiculo.getCor();
        this.preco = veiculo.getPreco();
        this.quilometragem = veiculo.getQuilometragem();
        this.status = veiculo.getStatus();
    }

    public Long getId() {
        return id;
    }

    public String getMarca() {
        return marca;
    }

    public String getModelo() {
        return modelo;
    }

    public Integer getAno() {
        return ano;
    }

    public String getCor() {
        return cor;
    }

    public BigDecimal getPreco() {
        return preco;
    }

    public Integer getQuilometragem() {
        return quilometragem;
    }

    public StatusVeiculo getStatus() {
        return status;
    }
}
