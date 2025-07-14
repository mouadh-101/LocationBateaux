package org.nst.bateaux.controller;

import org.nst.bateaux.dto.auth.AuthenticationRequest;
import org.nst.bateaux.dto.auth.AuthenticationResponse;
import org.nst.bateaux.dto.auth.RegisterRequest;
import org.nst.bateaux.entity.Role;
import org.nst.bateaux.service.Interface.IJwtService;
import org.nst.bateaux.service.Interface.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    IUserService userService;
    @Autowired
    IJwtService jwtService;

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
    public ResponseEntity<AuthenticationResponse> authenticateWithGoogle(@RequestBody Map<String, String> body) {
        return userService.authenticateWithGoogle(body);
    }
    @PostMapping("/facebook")
    public ResponseEntity<AuthenticationResponse> authenticateWithFacebook(@RequestBody Map<String, String> body) {
        return userService.authenticateWithFacebook(body);
    }





}
