package com.usguri.health_hub.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.usguri.health_hub.config.JwtService;
import com.usguri.health_hub.token.Token;
import com.usguri.health_hub.token.TokenRepository;
import com.usguri.health_hub.token.TokenType;
import com.usguri.health_hub.user.User;
import com.usguri.health_hub.user.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Collections;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Serviço responsável por lidar com as operações de autenticação e autorização.
 *
 * @author Said Rodrigues
 * @version 1.0
 * @since 2023-07-04
 */
@Service
@RequiredArgsConstructor
public class AuthenticationService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;
  private final AuthenticationManager authenticationManager;
  private final TokenRepository tokenRepository;

  /**
   * Registra um novo usuário.
   *
   * @param req Os dados de registro do usuário.
   * @return A resposta de autenticação contendo o token de acesso.
   */
  public AuthenticationResponse register(RegisterRequest req) {
    var user =
        User.builder()
            .firstname(req.getFirstName())
            .lastname(req.getLastName())
            .email(req.getEmail())
            .password(passwordEncoder.encode(req.getPassword()))
            .role(req.getRole())
            .build();
    var savedUser = userRepository.save(user);
    var jwtToken = jwtService.generateToken(user);
    var refreshToken = jwtService.generateRefreshToken(user);
    saveUserToken(savedUser, jwtToken);
    return AuthenticationResponse.builder()
        .accessToken(jwtToken)
        .refreshToken(refreshToken)
        .build();
  }

  /**
   * Autentica um usuário.
   *
   * @param req Os dados de autenticação do usuário.
   * @return A resposta de autenticação contendo o token de acesso.
   */
  public AuthenticationResponse authenticate(AuthenticationRequest req) {
    authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));

    var user =
        userRepository
            .findByEmail(req.getEmail())
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    var jwtToken = jwtService.generateToken(user);
    var refreshToken = jwtService.generateRefreshToken(user);
    revokeAllUserTokens(user);
    saveUserToken(user, jwtToken);
    return AuthenticationResponse.builder()
        .accessToken(jwtToken)
        .refreshToken(refreshToken)
        .build();
  }

  private void revokeAllUserTokens(User user) {
    var validTokens = tokenRepository.findAllValidTokenByUserId(user.getId());
    if (validTokens.isEmpty()) return;
    validTokens.forEach(
        (t) -> {
          t.setExpired(true);
          t.setRevoked(true);
        });
    tokenRepository.saveAll(validTokens);
  }

  private void saveUserToken(User user, String jwtToken) {
    var token =
        Token.builder()
            .user(user)
            .token(jwtToken)
            .tokenType(TokenType.BEARER)
            .expired(false)
            .revoked(false)
            .build();
    tokenRepository.save(token);
  }

  /**
   * Atualiza o token de acesso.
   *
   * @param request A solicitação HTTP.
   * @param response A resposta HTTP.
   * @throws IOException Se ocorrer um erro ao atualizar o token de acesso.
   */
  public void refreshToken(HttpServletRequest request, HttpServletResponse response)
      throws IOException {
    final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
    final String refreshToken;
    final String userEmail;
    String headerStart = "Bearer ";
    if (authHeader == null || !authHeader.startsWith(headerStart)) {
      return;
    }

    refreshToken = authHeader.substring(headerStart.length());
    userEmail = jwtService.extractUsername(refreshToken);
    if (userEmail != null) {
      var userDetails = this.userRepository.findByEmail(userEmail).orElseThrow();
      if (jwtService.isTokenValid(refreshToken, userDetails)) {
        var accessToken = jwtService.generateToken(userDetails);
        revokeAllUserTokens(userDetails);
        saveUserToken(userDetails, accessToken);
        var authResponse =
            AuthenticationResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();

        new ObjectMapper().writeValue(response.getOutputStream(), authResponse);
      }
    }
  }

  /**
   * Obtém os detalhes do usuário atualmente autenticado.
   *
   * @param email O email do usuário autenticado.
   * @return Os detalhes do usuário.
   */
  public User getMyUserDetails(String email) {
    User userFromDb =
        userRepository
            .findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    return User.builder()
        .id(userFromDb.getId())
        .tokens(Collections.emptyList())
        .email(userFromDb.getEmail())
        .lastname(userFromDb.getLastname())
        .firstname(userFromDb.getFirstname())
        .role(userFromDb.getRole())
        .build();
  }
}
