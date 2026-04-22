package com.smartcampus.controller;

import com.smartcampus.model.dto.ApiResponse;
import com.smartcampus.model.dto.UserDTO;
import com.smartcampus.model.dto.request.RegistrationRequestDTO;
import com.smartcampus.model.enums.Role;
import com.smartcampus.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<List<UserDTO>> getAllUsers() {
        return ApiResponse.success(userService.getAllUsers());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<UserDTO> createUser(@Valid @RequestBody RegistrationRequestDTO request, @RequestParam Role role) {
        return ApiResponse.success(userService.createUser(request, role), "User created successfully");
    }

    @PatchMapping("/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<UserDTO> updateUserRole(@PathVariable Long id, @RequestParam Role newRole) {
        return ApiResponse.success(userService.updateUserRole(id, newRole), "User role updated successfully");
    }
}
