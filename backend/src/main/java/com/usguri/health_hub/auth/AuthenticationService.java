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
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;
  private final AuthenticationManager authenticationManager;
  private final TokenRepository tokenRepository;

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
}
