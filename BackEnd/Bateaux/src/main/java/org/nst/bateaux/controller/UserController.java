package org.nst.bateaux.controller;

import org.nst.bateaux.dto.auth.RegisterRequest;
import org.nst.bateaux.dto.user.UserData;
import org.nst.bateaux.dto.user.UserDataWithName;
import org.nst.bateaux.entity.User;
import org.nst.bateaux.service.Interface.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
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


}
