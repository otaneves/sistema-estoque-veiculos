package com.concessionaria.estoque.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.time.Year;

public class AnoVeiculoValidator
        implements ConstraintValidator<AnoVeiculoValido, Integer> {

    @Override
    public boolean isValid(
            Integer ano,
            ConstraintValidatorContext context) {

        if (ano == null) {
            return true;
        }

        int anoAtual = Year.now().getValue();
        int anoMinimo = anoAtual - 20;

        if (ano >= anoMinimo && ano <= anoAtual) {
            return true;
        }

        String mensagem = "O ano do veiculo deve estar entre "
                + anoMinimo + " e " + anoAtual;

        context.disableDefaultConstraintViolation();

        context.buildConstraintViolationWithTemplate(mensagem)
                .addConstraintViolation();

        return false;
    }
}