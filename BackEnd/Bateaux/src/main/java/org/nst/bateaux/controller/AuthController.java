package org.nst.bateaux.controller;

import org.nst.bateaux.dto.auth.AuthenticationRequest;
import org.nst.bateaux.dto.auth.AuthenticationResponse;
import org.nst.bateaux.dto.auth.RegisterRequest;
import org.nst.bateaux.service.Interface.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}
