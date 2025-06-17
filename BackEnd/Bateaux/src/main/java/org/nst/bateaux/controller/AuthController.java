package org.nst.bateaux.controller;

import org.nst.bateaux.dto.auth.AuthenticationRequest;
import org.nst.bateaux.dto.auth.AuthenticationResponse;
import org.nst.bateaux.dto.auth.RegisterRequest;
import org.nst.bateaux.service.Interface.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    IUserService userService;
    @PostMapping("/login")
    AuthenticationResponse login(@RequestBody AuthenticationRequest user)
    {
        return userService.login(user);
    }
    @PostMapping("/register")
    AuthenticationResponse register (@RequestBody RegisterRequest user)
    {
        return userService.register(user);
    }
}
