package org.nst.bateaux.controller;

import org.nst.bateaux.dto.auth.RegisterRequest;
import org.nst.bateaux.dto.user.ChangePasswordRequest;
import org.nst.bateaux.dto.user.UserData;
import org.nst.bateaux.dto.user.UserDataWithName;
import org.nst.bateaux.entity.User;
import org.nst.bateaux.service.Interface.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    IUserService userService;

    @PostMapping
    public ResponseEntity<User> creatUser(@RequestBody RegisterRequest user) {
        User created = userService.creatUser(user);
        return ResponseEntity.status(201).body(created);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserDataWithName>> getAllUsers() {
        List<UserDataWithName> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @PutMapping
    public ResponseEntity<UserDataWithName> updateUser(@RequestBody UserDataWithName user) {
        UserData loggedInUser = (UserData) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        UserDataWithName updated = userService.updateUser(loggedInUser.getId(), user);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/ban/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> bannUser(@PathVariable("id") Long id) {
        userService.banUser(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/unBan/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> unBannUser(@PathVariable("id") Long id) {
        userService.unBanUser(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/changePassword")
    public ResponseEntity<Void> changePassword(@RequestBody ChangePasswordRequest request) {
        UserData loggedInUser = (UserData) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        userService.changePassword(loggedInUser.getId(), request);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    public ResponseEntity<UserDataWithName> getLoggedInUser() {
        UserData loggedInUser = (UserData) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        UserDataWithName user = userService.findUserById(loggedInUser.getId());
        return ResponseEntity.ok(user);
    }
}
