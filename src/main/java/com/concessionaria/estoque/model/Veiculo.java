package com.concessionaria.estoque.model;

import com.concessionaria.estoque.validation.AnoVeiculoValido;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;

import java.math.BigDecimal;

@Entity
@Table(name= "veiculos")
public class Veiculo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message= "A marca não pode estar vazia")
    private String marca;

    @NotBlank(message= "O modelo não pode estar vazio")
    private String modelo;

    @NotNull(message = "O ano é obrigatório")
    @AnoVeiculoValido
    private Integer ano;

    @NotBlank(message = "A cor não pode ser vazia")
    private String cor;

    @NotNull(message= "O preço é obrigatório")
    @DecimalMin(value ="0.0", message = "O preço não pode ser negativo")
    private BigDecimal preco;

    @NotNull(message = "A quilometragem é obrigatória")
    @Min(value = 0, message = "A quilometragem não pode ser menor que {value}")
    private Integer quilometragem;

    @NotBlank(message = "O status do veiculo é obrigatório")
    private String status;

    public Veiculo() {

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMarca() {
        return marca;
    }

    public void setMarca(String marca) {
        this.marca = marca;
    }

    public String getModelo() {
        return modelo;
    }

    public void setModelo(String modelo) {
        this.modelo = modelo;
    }

    public Integer getAno() {
        return ano;
    }

    public void setAno(Integer ano) {
        this.ano = ano;
    }

    public String getCor() {
        return cor;
    }

    public void setCor(String cor) {
        this.cor = cor;
    }

    public BigDecimal getPreco() {
        return preco;
    }

    public void setPreco(BigDecimal preco) {
        this.preco = preco;
    }

    public Integer getQuilometragem() {
        return quilometragem;
    }

    public void setQuilometragem(Integer quilometragem) {
        this.quilometragem = quilometragem;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
