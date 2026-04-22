package com.smartcampus.controller;

import com.smartcampus.model.dto.ApiResponse;
import com.smartcampus.model.dto.UserDTO;
import com.smartcampus.model.dto.request.LoginRequestDTO;
import com.smartcampus.model.dto.request.RegistrationRequestDTO;
import com.smartcampus.security.JwtTokenProvider;
import com.smartcampus.security.OAuth2UserService;
import com.smartcampus.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final JwtTokenProvider tokenProvider;
    private final OAuth2UserService oauth2UserService;
    private final UserService userService;

    @PostMapping("/google")
    public ApiResponse<Map<String, Object>> exchangeOAuth2Code(@RequestBody Map<String, String> request) {
        String code = request.get("code");
        String email = request.get("email");
        String name = request.get("name");
        String picture = request.get("picture");
        String googleId = request.get("googleId");

        UserDTO userDTO = userService.getUserByEmail(email);
        String token = tokenProvider.generateTokenFromEmail(email);

        return ApiResponse.success(Map.of(
                "token", token,
                "user", userDTO
        ));
    }

    @PostMapping("/register")
    public ApiResponse<Map<String, Object>> register(@Valid @RequestBody RegistrationRequestDTO request) {
        UserDTO userDTO = userService.registerUser(request);
        String token = tokenProvider.generateTokenFromEmail(userDTO.getEmail());

        return ApiResponse.success(Map.of(
                "token", token,
                "user", userDTO
        ));
    }

    @PostMapping("/login")
    public ApiResponse<Map<String, Object>> login(@Valid @RequestBody LoginRequestDTO request) {
        UserDTO userDTO = userService.loginUser(request);
        String token = tokenProvider.generateTokenFromEmail(userDTO.getEmail());

        return ApiResponse.success(Map.of(
                "token", token,
                "user", userDTO
        ));
    }

    @GetMapping("/me")
    public ApiResponse<UserDTO> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        UserDTO userDTO = userService.getUserByEmail(userDetails.getUsername());
        return ApiResponse.success(userDTO);
    }
}
