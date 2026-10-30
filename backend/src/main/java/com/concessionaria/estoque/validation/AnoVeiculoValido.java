package com.concessionaria.estoque.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Constraint(validatedBy = AnoVeiculoValidator.class)
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface AnoVeiculoValido {

    String message() default  "Ano de veiculo inválido";

    Class<?>[] groups() default {};

    Class<? extends Payload> [] payload() default {};
}
