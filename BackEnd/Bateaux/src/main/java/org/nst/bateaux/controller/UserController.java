package org.nst.bateaux.controller;

import org.nst.bateaux.dto.auth.RegisterRequest;
import org.nst.bateaux.dto.user.ChangePasswordRequest;
import org.nst.bateaux.dto.user.UserData;
import org.nst.bateaux.dto.user.UserDataWithName;
import org.nst.bateaux.entity.User;
import org.nst.bateaux.service.Interface.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
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
    public User creatUser(@RequestBody RegisterRequest user)
    {
        return userService.creatUser(user);
    }
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<UserDataWithName> getAllUsers(){
        return userService.getAllUsers();
    }
    @PutMapping
    public UserDataWithName updateUser(@RequestBody UserDataWithName user)
    {
        UserData loggedInUser = (UserData) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userService.updateUser(loggedInUser.getId(),user);
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/ban/{id}")
    public void bannUser(@PathVariable("id") Long id)
    {
        userService.banUser(id);
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/unBan/{id}")
    public void unBannUser(@PathVariable("id") Long id)
    {
        userService.unBanUser(id);
    }

    @PutMapping("/changePassword")
    public void changePassword(@RequestBody ChangePasswordRequest request)
    {
        UserData loggedInUser = (UserData) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        userService.changePassword(loggedInUser.getId(),request);
    }



}
