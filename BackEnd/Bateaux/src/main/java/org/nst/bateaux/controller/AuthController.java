package org.nst.bateaux.controller;

import jakarta.mail.MessagingException;
import org.nst.bateaux.dto.auth.*;
import org.nst.bateaux.entity.Role;
import org.nst.bateaux.entity.User;
import org.nst.bateaux.repository.UserRepository;
import org.nst.bateaux.service.Interface.IJwtService;
import org.nst.bateaux.service.Interface.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;


import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    IUserService userService;

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(@RequestBody AuthenticationRequest user) {
        AuthenticationResponse response = userService.login(user);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody RegisterRequest user) {
        AuthenticationResponse response = userService.register(user);
        return ResponseEntity.ok(response);
    }
    @PostMapping("/loginAdmin")
    public ResponseEntity<AuthenticationResponse> loginAdmin(@RequestBody AuthenticationRequest user) {
        AuthenticationResponse response = userService.loginAdmin(user);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/google")
    public AuthenticationResponse googleLogin(@RequestBody GoogleLoginRequest request) throws Exception {
        return userService.googleLogin(request);
    }
    @PostMapping("/facebook")
    public AuthenticationResponse facebookLogin(@RequestBody FacebookLoginRequest request) throws Exception{
        return userService.facebookLogin(request);
    }
    @PostMapping("/reset-password")
    public Map<String, String> resetPassword(@RequestBody Map<String, String> request) {
        return userService.resetPassword(request);
    }
    @PostMapping("/forgot-password")
    public Map<String, String> forgotPassword(@RequestBody Map<String, String> request) throws MessagingException {
        return userService.forgotPassword(request);
    }





}
