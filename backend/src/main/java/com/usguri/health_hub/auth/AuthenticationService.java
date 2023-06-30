package com.usguri.health_hub.auth;

import com.usguri.health_hub.config.JwtService;
import com.usguri.health_hub.token.Token;
import com.usguri.health_hub.token.TokenRepository;
import com.usguri.health_hub.token.TokenType;
import com.usguri.health_hub.user.Role;
import com.usguri.health_hub.user.User;
import com.usguri.health_hub.user.UserRepository;
import lombok.RequiredArgsConstructor;
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
        var user = User.builder()
                .firstName(req.getFirstName())
                .lastName(req.getLastName())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .role(Role.PATIENT)
                .build();
        var savedUser = userRepository.save(user);
        var jwtToken = jwtService.generateToken(user);
        saveUserToken(savedUser, jwtToken);
        return AuthenticationResponse.builder().token(jwtToken).build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest req) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
        );

        var user =  userRepository.findByEmail(req.getEmail()).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        var jwtToken = jwtService.generateToken(user);
        revokeAllUserTokens(user);
        saveUserToken(user, jwtToken);
        return AuthenticationResponse.builder().token(jwtToken).build();
    }

    private void revokeAllUserTokens(User user){
        var validTokens = tokenRepository.findAllValidTokenByUserId(user.getId());
        if (validTokens.isEmpty()) return;
        validTokens.forEach((t) -> {t.setExpired(true); t.setRevoked(true);});
        tokenRepository.saveAll(validTokens);
    }

    private void saveUserToken(User user, String jwtToken) {
        var token = Token.builder()
                .user(user)
                .token(jwtToken)
                .tokenType(TokenType.BEARER)
                .expired(false)
                .revoked(false)
                .build();
        tokenRepository.save(token);
    }
}
