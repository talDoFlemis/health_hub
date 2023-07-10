package com.usguri.health_hub.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

/**
 * Serviço responsável por gerenciar tokens JWT.
 *
 * <p>Este serviço é responsável por gerar tokens JWT, extrair informações dos tokens e validar sua
 * integridade e validade.
 *
 * @author Said Rodrigues
 * @version 1.0
 * @since 2023-07-04
 */
@Service
public class JwtService {
  @Value("${app.security.jwt.secret}")
  private String secretKey;

  @Value("${app.security.jwt.expiration}")
  private long jwtExpiration;

  @Value("${app.security.jwt.refresh.expiration}")
  private long refreshExpiration;

  /**
   * Extrai o nome de usuário (email) do token JWT.
   *
   * @param token O token JWT.
   * @return O nome de usuário extraído do token.
   */
  public String extractUsername(String token) {
    return extractClaim(token, Claims::getSubject);
  }

  /**
   * Extrai uma determinada informação (claim) do token JWT.
   *
   * @param token O token JWT.
   * @param claimResolver O resolvedor de claim responsável por extrair a informação desejada.
   * @param <T> O tipo de dado da informação.
   * @return A informação extraída do token.
   */
  public <T> T extractClaim(String token, Function<Claims, T> claimResolver) {
    final Claims claims = extractAllClaims(token);
    return claimResolver.apply(claims);
  }

  /**
   * Gera um token JWT para um usuário.
   *
   * @param userDetails Os detalhes do usuário.
   * @return O token JWT gerado.
   */
  public String generateToken(UserDetails userDetails) {
    return generateToken(new HashMap<>(), userDetails);
  }

  /**
   * Gera um token JWT com claims extras para um usuário.
   *
   * @param extraClaims As claims extras a serem adicionadas ao token.
   * @param userDetails Os detalhes do usuário.
   * @return O token JWT gerado.
   */
  public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
    return buildToken(extraClaims, userDetails, jwtExpiration);
  }

  /**
   * Gera um token JWT de atualização para um usuário.
   *
   * @param userDetails Os detalhes do usuário.
   * @return O token JWT de atualização gerado.
   */
  public String generateRefreshToken(UserDetails userDetails) {
    return buildToken(new HashMap<>(), userDetails, refreshExpiration);
  }

  private String buildToken(
      Map<String, Object> extraClaims, UserDetails userDetails, long expiration) {
    return Jwts.builder()
        .setClaims(extraClaims)
        .setSubject(userDetails.getUsername())
        .setIssuedAt(new Date(System.currentTimeMillis()))
        .setExpiration(new Date(System.currentTimeMillis() + expiration))
        .signWith(getSignInKey(), SignatureAlgorithm.HS256)
        .compact();
  }

  /**
   * Verifica se um token JWT é válido para um usuário específico.
   *
   * @param token O token JWT.
   * @param userDetails Os detalhes do usuário.
   * @return true se o token for válido, caso contrário false.
   */
  public boolean isTokenValid(String token, UserDetails userDetails) {
    final String username = extractUsername(token);
    return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
  }

  private boolean isTokenExpired(String token) {
    final Date expiredAt = extractClaim(token, Claims::getExpiration);
    return expiredAt.before(new Date());
  }

  private Claims extractAllClaims(String token) {
    return Jwts.parserBuilder()
        .setSigningKey(getSignInKey())
        .build()
        .parseClaimsJws(token)
        .getBody();
  }

  private Key getSignInKey() {
    byte[] keyBytes = Decoders.BASE64.decode(secretKey);
    return Keys.hmacShaKeyFor(keyBytes);
  }
}
