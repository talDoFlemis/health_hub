package com.usguri.health_hub.config;

import static com.usguri.health_hub.user.Role.*;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutHandler;

/**
 * Configuração de segurança do Spring Security.
 *
 * <p>Esta classe define as configurações de segurança para a aplicação Spring Boot voltada para uma
 * clínica médica. Ela define as regras de autorização para os endpoints da API, configura a
 * autenticação baseada em tokens JWT e define as permissões necessárias para acessar os recursos do
 * sistema.
 *
 * @author Said Rodrigues
 * @version 1.0
 * @since 2023-07-04
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableMethodSecurity
public class SecurityConfiguration {
  private final JwtAuthenticationFilter jwtAuthFilter;
  private final AuthenticationProvider authenticationProvider;
  private final LogoutHandler logoutHandler;

  /**
   * Configura o filtro de segurança.
   *
   * @param httpSecurity O objeto HttpSecurity usado para configurar as regras de segurança.
   * @return O objeto SecurityFilterChain configurado.
   * @throws Exception Se ocorrer um erro durante a configuração do filtro de segurança.
   */
  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
    httpSecurity
        .csrf()
        .disable()
        .cors()
        .and()
        .authorizeHttpRequests()
        .requestMatchers(
            "/api/auth/**",
            "/v3/api-docs",
            "/v3/api-docs/**",
            "/swagger-resources",
            "/swagger-resources/**",
            "/configuration/ui",
            "/configuration/security",
            "/swagger-ui/**",
            "/webjars/**",
            "/swagger-ui.html")
        .permitAll()
        .requestMatchers("/actuator/health")
        .permitAll()
        .requestMatchers("/api/patient/**")
        .hasAnyRole(ADMIN.name(), PATIENT.name(), ATTENDANT.name())
        .requestMatchers("/api/appointment/**")
        .hasAnyRole(ADMIN.name(), ATTENDANT.name())
        .anyRequest()
        .authenticated()
        .and()
        .sessionManagement()
        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        .and()
        .authenticationProvider(authenticationProvider)
        .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
        .logout()
        .logoutUrl("/api/auth/logout")
        .addLogoutHandler(logoutHandler)
        .logoutSuccessHandler(
            (request, response, authentication) -> SecurityContextHolder.clearContext());

    return httpSecurity.build();
  }
}
