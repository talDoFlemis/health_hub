package com.usguri.health_hub.auth;

import com.usguri.health_hub.user.User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.security.Principal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador responsável por lidar com as operações de autenticação e autorização.
 *
 * @author Said Rodrigues
 * @version 1.0
 * @since 2023-07-04
 */
@RestController
@RequestMapping(path = "${apiPrefix}/auth")
@RequiredArgsConstructor
public class AuthenticationController {

  private final AuthenticationService authenticationService;

  /**
   * Registra um novo usuário.
   *
   * @param request Os dados do registro do usuário.
   * @return A resposta de autenticação contendo o token de acesso.
   */
  @PostMapping("/register")
  public ResponseEntity<AuthenticationResponse> register(@RequestBody RegisterRequest request) {
    return ResponseEntity.ok(authenticationService.register(request));
  }

  /**
   * Autentica um usuário.
   *
   * @param request Os dados de autenticação do usuário.
   * @return A resposta de autenticação contendo o token de acesso.
   */
  @PostMapping("/authenticate")
  public ResponseEntity<AuthenticationResponse> authenticate(
      @RequestBody AuthenticationRequest request) {
    return ResponseEntity.ok(authenticationService.authenticate(request));
  }

  /**
   * Obtém os detalhes do usuário atualmente autenticado.
   *
   * @param principal O objeto Principal que representa o usuário autenticado.
   * @return Os detalhes do usuário.
   */
  @GetMapping("/user")
  public User getMyUserDetails(Principal principal) {
    return authenticationService.getMyUserDetails(principal.getName());
  }

  /**
   * Atualiza o token de acesso.
   *
   * @param request A solicitação HTTP.
   * @param response A resposta HTTP.
   * @throws IOException Se ocorrer um erro ao atualizar o token de acesso.
   */
  @PostMapping("/refresh")
  public void refreshToken(HttpServletRequest request, HttpServletResponse response)
      throws IOException {
    authenticationService.refreshToken(request, response);
  }
}
