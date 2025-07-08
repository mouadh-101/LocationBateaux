package org.nst.bateaux.dto.stats;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class StatsUserProfile {
    Long nbBateaux;
    Long nbReservations;
    Long nbReviews;
    Long nbFavorites;
}
