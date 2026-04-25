package com.smartcampus.security;

import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.smartcampus.model.entity.User;
import com.smartcampus.model.enums.Role;
import com.smartcampus.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OAuth2UserService {

    private final UserRepository userRepository;

    @Transactional
    public User processOAuthPostLogin(OAuth2User oAuth2User) {
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String googleId = oAuth2User.getAttribute("sub");
        String picture = oAuth2User.getAttribute("picture");

        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            user = User.builder()
                    .email(email)
                    .name(name)
                    .googleId(googleId)
                    .avatarUrl(picture)
                    .role(Role.USER)
                    .isActive(true)
                    .build();
            user = userRepository.save(user);
        } else {
            user.setName(name);
            user.setAvatarUrl(picture);
            user.setGoogleId(googleId);
            user = userRepository.save(user);
        }

        return user;
    }
}

