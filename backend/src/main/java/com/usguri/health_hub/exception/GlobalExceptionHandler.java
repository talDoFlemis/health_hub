package com.usguri.health_hub.exception;

import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import java.util.ArrayList;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Classe responsável por lidar com exceções globais na aplicação.
 *
 * <p>Esta classe é anotada com `@RestControllerAdvice`, permitindo que ela intercepte e manipule
 * exceções lançadas por métodos em classes anotadas com `@RestController`. Ela possui métodos para
 * lidar com diferentes tipos de exceções, retornando respostas HTTP apropriadas e mensagens de erro
 * correspondentes.
 *
 * @author Said Rodrigues
 * @version 1.0
 * @since 2023-07-04
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

  /**
   * Manipula exceções de entidade não encontrada.
   *
   * <p>Este método é anotado com `@ExceptionHandler(EntityNotFoundException.class)` e é executado
   * quando uma exceção do tipo `EntityNotFoundException` é lançada. Ele retorna uma resposta HTTP
   * com status 404 (NOT FOUND) e a mensagem de erro correspondente.
   *
   * @param e A exceção `EntityNotFoundException` lançada.
   * @return A mensagem de erro indicando que a entidade não foi encontrada.
   */
  @ResponseStatus(HttpStatus.NOT_FOUND)
  @ExceptionHandler(EntityNotFoundException.class)
  public String handleEntityNotFound(EntityNotFoundException e) {
    return e.getMessage();
  }

  /**
   * Manipula exceções de entidade já existente.
   *
   * <p>Este método é anotado com `@ExceptionHandler(EntityExistsException.class)` e é executado
   * quando uma exceção do tipo `EntityExistsException` é lançada. Ele retorna uma resposta HTTP com
   * status 409 (CONFLICT) e a mensagem de erro correspondente.
   *
   * @param e A exceção `EntityExistsException` lançada.
   * @return A mensagem de erro indicando que a entidade já existe.
   */
  @ResponseStatus(HttpStatus.CONFLICT)
  @ExceptionHandler(EntityExistsException.class)
  public String handleAlreadyExists(EntityExistsException e) {
    return e.getMessage();
  }

  /**
   * Manipula exceções de validação de argumentos do método.
   *
   * <p>Este método é anotado com `@ExceptionHandler(MethodArgumentNotValidException.class)` e é
   * executado quando uma exceção do tipo `MethodArgumentNotValidException` é lançada. Ele retorna
   * uma resposta HTTP com status 400 (BAD REQUEST) e uma lista de objetos `CustomFieldError`
   * contendo os erros de validação dos campos.
   *
   * @param e A exceção `MethodArgumentNotValidException` lançada.
   * @return Uma lista de objetos `CustomFieldError` contendo os erros de validação dos campos.
   */
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  @ExceptionHandler(MethodArgumentNotValidException.class)
  public List<CustomFieldError> handleValidation(MethodArgumentNotValidException e) {
    List<FieldError> fieldErrors = e.getBindingResult().getFieldErrors();
    List<CustomFieldError> customs = new ArrayList<>();
    fieldErrors.forEach(
        error -> customs.add(new CustomFieldError(error.getField(), error.getDefaultMessage())));
    return customs;
  }
}
