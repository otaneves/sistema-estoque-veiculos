package com.concessionaria.estoque.exception;

public class VeiculoNaoEncontradoException extends RuntimeException{

    public VeiculoNaoEncontradoException(Long id){
        super("Veículo de ID: " + id + " não encontrado");
    }

}
