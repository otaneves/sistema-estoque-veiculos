package com.concessionaria.estoque.exception;

import com.concessionaria.estoque.dto.ErroResponse;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErroResponse> tratarValidacao(
            MethodArgumentNotValidException exception) {

        Map<String, String> campos = new HashMap<>();

        exception.getBindingResult()
                .getFieldErrors()
                .forEach(erro -> {
                    campos.put(erro.getField(), erro.getDefaultMessage());
                });

        HttpStatus status = HttpStatus.BAD_REQUEST;

        ErroResponse resposta = ErroResponse.criar(
                status,
                "Erro de validação de dados",
                campos
        );

        return ResponseEntity
                .status(status)
                .body(resposta);
    }

    @ExceptionHandler(VeiculoNaoEncontradoException.class)
    public ResponseEntity<ErroResponse> tratarVeiculoNaoEncontrado(
            VeiculoNaoEncontradoException exception) {

        HttpStatus status = HttpStatus.NOT_FOUND;

        ErroResponse erro = new ErroResponse(
                status.value(),
                status.getReasonPhrase(),
                exception.getMessage()
        );

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(erro);
    }
}
