package org.nst.bateaux.service.Implimentation;


import org.nst.bateaux.config.BusinessException;
import org.nst.bateaux.dto.auth.AuthenticationRequest;
import org.nst.bateaux.dto.auth.AuthenticationResponse;
import org.nst.bateaux.dto.auth.RegisterRequest;
import org.nst.bateaux.dto.bateau.BateauData;
import org.nst.bateaux.dto.bateau.ImageDto;
import org.nst.bateaux.dto.stats.StatsUserProfile;
import org.nst.bateaux.dto.user.ChangePasswordRequest;
import org.nst.bateaux.dto.user.UserData;
import org.nst.bateaux.dto.user.UserDataWithName;
import org.nst.bateaux.entity.Bateaux;
import org.nst.bateaux.entity.Role;
import org.nst.bateaux.entity.User;
import org.nst.bateaux.repository.BateauxRepository;
import org.nst.bateaux.repository.UserRepository;
import org.nst.bateaux.service.Interface.IJwtService;
import org.nst.bateaux.service.Interface.IUserService;
import org.nst.bateaux.service.mappers.MapToDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
public class UserService implements IUserService {

    @Autowired
    UserRepository userRepository;
    @Autowired
    PasswordEncoder passwordEncoder;
    @Autowired
    IJwtService jwtService;
    @Autowired
    BateauxRepository bateauxRepository;
    @Autowired
    MapToDto mapToDto;

    @Override
    public User creatUser(RegisterRequest user) {
        User newUser=new User() ;
        newUser.setEmail(user.getEmail());
        newUser.setPassword(passwordEncoder.encode(user.getPassword()));
        newUser.setName(user.getName());
        newUser.setRole(user.getRole());
        newUser.setPhone(user.getPhone());
        return userRepository.save(newUser);
    }


    @Override
    public User findUserByEmail(String email) {
        return userRepository.findUserByEmail(email);
    }

    @Override
    public AuthenticationResponse login(AuthenticationRequest request) {
        User user = findUserByEmail(request.getEmail());

        // Check if user exists
        if (user == null) {
            return new AuthenticationResponse(null,"ERROR", "User not found");
        }

        // Check if user is active
        if (!user.isActive()) {
            return new AuthenticationResponse(null,"BANNED", "User is banned or inactive");
        }

        // Validate password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return new AuthenticationResponse(null,"ERROR", "Invalid credentials");
        }

        // Generate token
        String token = jwtService.generateToken(
                user.getEmail(),
                user.getRole(),
                user.getId(),
                user.isActive()
        );

        return new AuthenticationResponse(token,"SUCCESS","Authentication successful");
    }

    @Override
    public AuthenticationResponse register(RegisterRequest user) {
        User newUser=creatUser(user);
        String token = jwtService.generateToken(
                newUser.getEmail(),
                newUser.getRole(),
                newUser.getId(),
                newUser.isActive()
        );

        return new AuthenticationResponse(token,"SUCCESS","Authentication successful");
    }

    @Override
    public List<UserDataWithName> getAllUsers() {
        return userRepository.findAllUserData();
    }

    @Override
    public UserDataWithName updateUser(Long userId, UserDataWithName userData) {
        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException("User not found with ID: " + userId));

        existingUser.setName(userData.getName());
        existingUser.setPhone(userData.getPhone());

        User updatedUser = userRepository.save(existingUser);

        return mapToDto.mapToDtoWithName(updatedUser);
    }

    @Override
    public void banUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException("User not found"));

        if (!user.isActive()) {
            throw new BusinessException("User is already banned");
        }

        user.setActive(false);
        userRepository.save(user);
    }

    @Override
    public void unBanUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException("User not found"));

        if (user.isActive()) {
            throw new BusinessException("User is already Active");
        }

        user.setActive(true);
        userRepository.save(user);
    }

    @Override
    public void changePassword(Long id, ChangePasswordRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new BusinessException("User not found"));

        if (!passwordEncoder.matches(request.getCurentPassword(), user.getPassword())) {
            throw new BusinessException("Current Password doesn't match");
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }


    @Override
    public UserDataWithName findUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new BusinessException("User not found with ID: " + id));
        return mapToDto.mapToDtoWithName(user);
    }

    @Override
    public StatsUserProfile getUserStats(Long userId) {
        return userRepository.getUserStatsById(userId);
    }



}
