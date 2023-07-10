package com.usguri.health_hub.config;

import com.usguri.health_hub.token.TokenRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.stereotype.Service;

/**
 * Serviço responsável por lidar com o processo de logout de usuários.
 *
 * <p>Este serviço implementa a interface `LogoutHandler` do Spring Security e é responsável por
 * invalidar o token JWT durante o processo de logout do usuário. Ele marca o token como expirado e
 * revogado no repositório de tokens.
 *
 * @author Said Rodrigues
 * @version 1.0
 * @since 2023-07-04
 */
@Service
@RequiredArgsConstructor
public class LogoutService implements LogoutHandler {
  private final TokenRepository tokenRepository;

  /**
   * Realiza o logout do usuário, invalidando o token JWT.
   *
   * @param request A requisição HTTP.
   * @param response A resposta HTTP.
   * @param authentication A autenticação atual do usuário.
   */
  @Override
  public void logout(
      HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
    final String authHeader = request.getHeader("Authorization");
    final String jwt;
    String headerStart = "Bearer ";
    if (authHeader == null || !authHeader.startsWith(headerStart)) {
      return;
    }

    jwt = authHeader.substring(headerStart.length());
    var storedToken = tokenRepository.findByToken(jwt).orElse(null);
    if (storedToken != null) {
      storedToken.setExpired(true);
      storedToken.setRevoked(true);
      tokenRepository.save(storedToken);
    }
  }
}
