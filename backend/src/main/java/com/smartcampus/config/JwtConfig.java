package com.smartcampus.config;

import com.smartcampus.repository.UserRepository;
import com.smartcampus.security.JwtAuthenticationFilter;
import com.smartcampus.security.JwtTokenProvider;
import com.smartcampus.security.OAuth2UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.AuthenticatedPrincipalOAuth2AuthorizedClientRepository;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizedClientRepository;

@Configuration
@RequiredArgsConstructor
public class JwtConfig {

    private final UserRepository userRepository;

    @Bean
    public JwtTokenProvider jwtTokenProvider() {
        return new JwtTokenProvider();
    }

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter(
            JwtTokenProvider tokenProvider,
            UserDetailsService userDetailsService) {
        return new JwtAuthenticationFilter(tokenProvider, userDetailsService);
    }

    @Bean
    public OAuth2UserService oauth2UserService() {
        return new OAuth2UserService(userRepository);
    }
}
