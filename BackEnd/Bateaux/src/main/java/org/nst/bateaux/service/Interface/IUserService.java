package org.nst.bateaux.service.Interface;

import org.nst.bateaux.entity.User;
import org.springframework.stereotype.Service;

@Service
public interface IUserService {
    User creatUser(User user);

}
