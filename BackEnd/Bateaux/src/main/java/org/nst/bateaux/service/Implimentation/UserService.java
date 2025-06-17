package org.nst.bateaux.service.Implimentation;

import org.nst.bateaux.entity.User;
import org.nst.bateaux.repository.UserRepository;
import org.nst.bateaux.service.Interface.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService implements IUserService {

    @Autowired
    UserRepository userRepository;
    @Override
    public User creatUser(User user) {
        return userRepository.save(user);
    }
}
