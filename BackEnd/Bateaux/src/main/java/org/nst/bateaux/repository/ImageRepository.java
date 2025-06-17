package org.nst.bateaux.repository;

import org.nst.bateaux.entity.Image;
import org.nst.bateaux.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImageRepository extends JpaRepository<Image,Long> {
}
