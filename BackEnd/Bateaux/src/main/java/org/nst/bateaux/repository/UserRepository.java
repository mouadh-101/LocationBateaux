package org.nst.bateaux.repository;

import org.nst.bateaux.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User,Long> {
}
