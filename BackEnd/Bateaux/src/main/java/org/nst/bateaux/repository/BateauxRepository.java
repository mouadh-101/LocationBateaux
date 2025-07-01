package org.nst.bateaux.repository;

import org.nst.bateaux.entity.Bateaux;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BateauxRepository extends JpaRepository<Bateaux,Long> {
    @Query("""
    SELECT b FROM Bateaux b
    JOIN b.avis a
    GROUP BY b
    ORDER BY AVG(a.note) DESC
    LIMIT 4
    """)
    List<Bateaux> findTop5ByOrderByAvisNoteDesc();

}
