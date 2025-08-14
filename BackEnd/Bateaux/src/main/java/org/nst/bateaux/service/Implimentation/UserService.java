package org.nst.bateaux.service.Implimentation;


import com.restfb.DefaultFacebookClient;
import com.restfb.FacebookClient;
import com.restfb.Parameter;
import com.restfb.Version;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.nst.bateaux.config.BusinessException;
import org.nst.bateaux.dto.auth.*;
import org.nst.bateaux.dto.stats.StatsUserProfile;
import org.nst.bateaux.dto.user.ChangePasswordRequest;
import org.nst.bateaux.dto.user.UserDataWithName;
import org.nst.bateaux.entity.PasswordResetToken;
import org.nst.bateaux.entity.Role;
import org.nst.bateaux.entity.User;
import org.nst.bateaux.repository.BateauxRepository;
import org.nst.bateaux.repository.PasswordResetTokenRepository;
import org.nst.bateaux.repository.UserRepository;
import org.nst.bateaux.service.Interface.IJwtService;
import org.nst.bateaux.service.Interface.IUserService;
import org.nst.bateaux.service.mappers.MapToDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.security.SecureRandom;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.UUID;

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
    PasswordResetTokenRepository passwordResetTokenRepository;
    @Autowired
    MapToDto mapToDto;

    @Value("${spring.security.oauth2.client.registration.facebook.client-id}")
    private String facebookClientId;

    @Value("${spring.security.oauth2.client.registration.facebook.client-secret}")
    private String facebookClientSecret;

    @Autowired
    private JavaMailSender mailSender;



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
    public User createUserWithRandomPassword(RegisterRequest user) {
        User newUser = new User();

        newUser.setEmail(user.getEmail());
        newUser.setName(user.getName());
        newUser.setRole(user.getRole());
        newUser.setPhone(user.getPhone());

        // Générer un mot de passe aléatoire
        String randomPassword = generateRandomPassword();
        newUser.setPassword(passwordEncoder.encode(randomPassword));

        User savedUser = userRepository.save(newUser);

        // Afficher ou envoyer par email
        System.out.println("Mot de passe généré pour " + newUser.getEmail() + " : " + randomPassword);
        return savedUser;
    }

    // Génération aléatoire
    private String generateRandomPassword() {
        String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*!";
        int PASSWORD_LENGTH = 10;
        SecureRandom random = new SecureRandom();
        StringBuilder password = new StringBuilder(PASSWORD_LENGTH);
        for (int i = 0; i < PASSWORD_LENGTH; i++) {
            int index = random.nextInt(CHARACTERS.length());
            password.append(CHARACTERS.charAt(index));
        }
        return password.toString();
    }


    @Override
    public User findUserByEmail(String email) {
        return userRepository.findUserByEmailAndIsDeletedFalse(email);
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
        existingUser.setRole(userData.getRole());

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
    public void supprimerUser(Long id)
    {
        User exitingUser=userRepository.findById(id).orElseThrow(()-> new BusinessException("user not found"));
        exitingUser.setDeleted(true);
        userRepository.save(exitingUser);
    }

    @Override
    public StatsUserProfile getUserStats(Long userId) {
        return userRepository.getUserStatsById(userId);
    }

    @Override
    public AuthenticationResponse loginAdmin(AuthenticationRequest request) {
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
        if(user.getRole()!=Role.ADMIN && user.getRole()!=Role.GESTIONNAIRE)
        {
            return new AuthenticationResponse(null,"ERROR", "Accès refusé");
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
    public AuthenticationResponse googleLogin(GoogleLoginRequest request) throws Exception {
        String url = "https://oauth2.googleapis.com/tokeninfo?id_token=" + request.getIdToken();
        RestTemplate restTemplate = new RestTemplate();
        Map<String, Object> response = restTemplate.getForObject(url, Map.class);
        if (response == null || !response.get("aud").equals("702034366364-h92rafiso21l7puiboock14h5f1cuetl.apps.googleusercontent.com")) {
            return new AuthenticationResponse(null, "ERROR", "Invalid Google ID token");
        }
        String email = (String) response.get("email");
        String name = (String) response.get("name");

        User user = userRepository.findUserByEmailAndIsDeletedFalse(email);
        if (user == null) {
            user = new User();
            user.setEmail(email);
            user.setName(name);
            user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString().substring(0, 12)));
            user.setRole(Role.CLIENT);
            user.setActive(true);
            user = userRepository.save(user);
        }

        if (!user.isActive()) {
            return new AuthenticationResponse(null, "BANNED", "User is banned or inactive");
        }

        String token = jwtService.generateToken(
                user.getEmail(),
                user.getRole(),
                user.getId(),
                user.isActive()
        );

        return new AuthenticationResponse(token, "SUCCESS", "Authentication successful");
    }
    @Override
    public AuthenticationResponse facebookLogin(FacebookLoginRequest request) throws Exception {
        FacebookClient facebookClient = new DefaultFacebookClient(
                request.getAccessToken(),
                facebookClientSecret,
                Version.LATEST
        );

        // Fetch user data from Facebook
        User facebookUser = facebookClient.fetchObject(
                "me",
                User.class,
                Parameter.with("fields", "id,email,name")
        );

        if (facebookUser == null || facebookUser.getEmail() == null) {
            return new AuthenticationResponse(null, "ERROR", "Invalid Facebook access token or email not provided");
        }

        String email = facebookUser.getEmail();
        String name = facebookUser.getName();

        // Find or create user
        User user = userRepository.findUserByEmailAndIsDeletedFalse(email);
        if (user == null) {
            user = new User();
            user.setEmail(email);
            user.setName(name != null ? name : "Unknown");
            user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString().substring(0, 12)));
            user.setRole(Role.CLIENT);
            user.setActive(true);
            user = userRepository.save(user);
        }

        if (!user.isActive()) {
            return new AuthenticationResponse(null, "BANNED", "User is banned or inactive");
        }

        String token = jwtService.generateToken(
                user.getEmail(),
                user.getRole(),
                user.getId(),
                user.isActive()
        );

        return new AuthenticationResponse(token, "SUCCESS", "Authentication successful");
    }

    @Override
    public Map<String, String> forgotPassword(Map<String, String> request) throws MessagingException {
        String email = request.get("email");
        User user = userRepository.findUserByEmailAndIsDeletedFalse(email);

        if (user == null) {
            return Map.of("status", "ERROR", "message", "Utilisateur non trouvé");
        }

        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken(
                token,
                user,
                LocalDateTime.now().plusHours(1) // expires in 1h
        );
        passwordResetTokenRepository.save(resetToken);

        String resetUrl = "http://localhost:4200/reset-password?token=" + token;

        // Generate HTML email body
        String emailBody = """
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Réinitialisation du mot de passe</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background-color: #f8fafc;
                    color: #374151;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 40px auto;
                    background: white;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    padding: 30px;
                }
                .header {
                    text-align: center;
                    background: linear-gradient(135deg, #1e40af, #3b82f6);
                    padding: 20px;
                    color: white;
                }
                .header h1 {
                    margin: 0;
                }
                p {
                    font-size: 16px;
                    margin-bottom: 20px;
                }
                .btn {
                    display: inline-block;
                    background: #0682a1;
                    color: white;
                    padding: 14px 28px;
                    text-decoration: none;
                    border-radius: 8px;
                    font-weight: bold;
                    transition: background 0.3s ease;
                }
                .btn:hover {
                    background: #05647a;
                }
                .footer {
                    text-align: center;
                    font-size: 14px;
                    color: #6b7280;
                    margin-top: 30px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Réinitialisation de votre mot de passe</h1>
                </div>
                <p>Bonjour <strong>%s</strong>,</p>
                <p>Nous avons reçu une demande de réinitialisation de votre mot de passe. 
                Cliquez sur le bouton ci-dessous pour procéder :</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="%s" class="btn">Réinitialiser le mot de passe</a>
                </div>
                
                <p>Ce lien expirera dans <strong>1 heure</strong>. 
                Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet e-mail.</p>
                
                <div class="footer">
                    © 2024 AfricaBoat. Tous droits réservés.
                </div>
            </div>
        </body>
        </html>
    """.formatted(user.getName(), resetUrl);

        // Send HTML email
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "UTF-8");
        helper.setTo(email);
        helper.setSubject("Réinitialisation de votre mot de passe");
        helper.setText(emailBody, true); // true = send HTML
        mailSender.send(mimeMessage);

        return Map.of("status", "SUCCESS", "message", "Lien de réinitialisation envoyé à votre email.");
    }


    @Override
    public Map<String, String> resetPassword(Map<String, String> request) {
        String token = request.get("token");
        String newPassword = request.get("password");

        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token);
        if (resetToken == null || resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            return Map.of("status", "ERROR", "message", "Token invalide ou expiré");
        }

        User user = resetToken.getUser();

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Delete the used token
        passwordResetTokenRepository.delete(resetToken);
        // automatically login
        String jwtToken = jwtService.generateToken(
                user.getEmail(),
                user.getRole(),
                user.getId(),
                user.isActive()
        );

        return Map.of( "token",jwtToken,"status", "SUCCESS", "message", "Mot de passe réinitialisé avec succès");
    }

}
