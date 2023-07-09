package com.usguri.health_hub.config;

import com.usguri.health_hub.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configurações da aplicação.
 *
 * <p>Essa classe representa as configurações globais da aplicação. Ela é anotada com @Configuration
 * para indicar que é uma classe de configuração do Spring. Ela é responsável por configurar
 * diversos aspectos da aplicação, como autenticação, codificação de senhas e CORS.
 *
 * @author Said Rodrigues
 * @version 1.0
 * @since 2023-07-04
 */
@Configuration
@RequiredArgsConstructor
public class ApplicationConfig {
  private final UserRepository userRepository;

  /**
   * Cria o serviço de detalhes do usuário.
   *
   * <p>Esse método cria o serviço que é responsável por carregar os detalhes do usuário durante a
   * autenticação. Ele utiliza o UserRepository para buscar o usuário com base no nome de usuário
   * (email).
   *
   * @return O serviço de detalhes do usuário.
   */
  @Bean
  public UserDetailsService userDetailsService() {
    return username ->
        userRepository
            .findByEmail(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
  }

  /**
   * Cria o provedor de autenticação.
   *
   * <p>Esse método cria o provedor de autenticação que será usado durante o processo de
   * autenticação. Ele utiliza o UserDetailsService para carregar os detalhes do usuário e o
   * PasswordEncoder para validar a senha.
   *
   * @return O provedor de autenticação.
   */
  @Bean
  public AuthenticationProvider authenticationProvider() {
    DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
    authProvider.setUserDetailsService(userDetailsService());
    authProvider.setPasswordEncoder(passwordEncoder());
    return authProvider;
  }

  /**
   * Cria o gerenciador de autenticação.
   *
   * <p>Esse método cria o gerenciador de autenticação, que é responsável por realizar a
   * autenticação do usuário. Ele utiliza a configuração de autenticação do Spring para obter o
   * gerenciador de autenticação.
   *
   * @param authConfig A configuração de autenticação.
   * @return O gerenciador de autenticação.
   * @throws Exception Se ocorrer um erro ao obter o gerenciador de autenticação.
   */
  @Bean
  public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig)
      throws Exception {
    return authConfig.getAuthenticationManager();
  }

  /**
   * Cria o codificador de senha.
   *
   * <p>Esse método cria o codificador de senha, que é responsável por codificar as senhas dos
   * usuários. Neste caso, é utilizado o BCryptPasswordEncoder para realizar a codificação.
   *
   * @return O codificador de senha.
   */
  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  /**
   * Configuração do CORS.
   *
   * <p>Esse método configura o CORS (Cross-Origin Resource Sharing) para permitir solicitações de
   * origens diferentes. Ele permite que todas as origens ("*") acessem os recursos da aplicação e
   * usem todos os métodos HTTP.
   *
   * @return O configurador do CORS.
   */
  @Bean
  public WebMvcConfigurer corsConfigurer() {
    return new WebMvcConfigurer() {
      @Override
      public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**").allowedOrigins("*").allowedMethods("*");
      }
    };
  }
}
