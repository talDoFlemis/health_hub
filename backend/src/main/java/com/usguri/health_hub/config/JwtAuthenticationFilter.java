package com.usguri.health_hub.config;

import com.usguri.health_hub.token.TokenRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Filtro de autenticação JWT.
 *
 * <p>Esse filtro é responsável por realizar a autenticação baseada em tokens JWT em cada
 * requisição. Ele extrai o token JWT do cabeçalho Authorization, valida o token e autentica o
 * usuário correspondente.
 *
 * @author Said Rodrigues
 * @version 1.0
 * @since 2023-07-04
 */
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
  private final JwtService jwtService;
  private final UserDetailsService userDetailsService;
  private final TokenRepository tokenRepository;

  /**
   * Método que executa o filtro durante o processamento de cada requisição.
   *
   * @param request A requisição HTTP.
   * @param response A resposta HTTP.
   * @param filterChain O encadeamento de filtros.
   * @throws ServletException Se ocorrer um erro durante o processamento da requisição.
   * @throws IOException Se ocorrer um erro de E/S durante o processamento da requisição.
   */
  @Override
  protected void doFilterInternal(
      @NonNull HttpServletRequest request,
      @NonNull HttpServletResponse response,
      @NonNull FilterChain filterChain)
      throws ServletException, IOException {
    final String authHeader = request.getHeader("Authorization");
    final String jwt;
    final String userEmail;
    String headerStart = "Bearer ";
    if (authHeader == null || !authHeader.startsWith(headerStart)) {
      filterChain.doFilter(request, response);
      return;
    }

    jwt = authHeader.substring(headerStart.length());
    userEmail = jwtService.extractUsername(jwt);
    if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
      UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);
      var isTokenValid =
          tokenRepository.findByToken(jwt).map(t -> !t.isExpired() && !t.isRevoked()).orElse(false);
      if (jwtService.isTokenValid(jwt, userDetails) && isTokenValid) {
        UsernamePasswordAuthenticationToken authToken =
            new UsernamePasswordAuthenticationToken(
                userDetails, null, userDetails.getAuthorities());
        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(authToken);
      }
    }
    filterChain.doFilter(request, response);
  }
}
