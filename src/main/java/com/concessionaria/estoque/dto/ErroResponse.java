package com.concessionaria.estoque.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import org.springframework.http.HttpStatus;

import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_EMPTY)
@JsonPropertyOrder({"status", "erro", "mensagem", "campos"})
public class ErroResponse {

    private int status;
    private String erro;
    private String mensagem;
    private Map<String,String> campos;


    public ErroResponse(int status, String erro, String mensagem){

        this.status = status;
        this.erro= erro;
        this.mensagem = mensagem;

    }

    public ErroResponse(int status, String erro, String mensagem, Map<String, String> campos){

        this.status = status;
        this.erro = erro;
        this.mensagem = mensagem;
        this.campos = campos;

    }

    public static ErroResponse criar(HttpStatus status, String mensagem){

        return new ErroResponse(
                status.value(),
                status.getReasonPhrase(),
                mensagem
        );
    }

    public static ErroResponse criar(HttpStatus status, String mensagem, Map<String, String> campos){

        return new ErroResponse(
                status.value(),
                status.getReasonPhrase(),
                mensagem,
                campos
        );

    }

    public int getStatus() {
        return status;
    }

    public String getErro() {
        return erro;
    }

    public String getMensagem() {
        return mensagem;
    }

    public Map<String, String> getCampos() {
        return campos;
    }
}
