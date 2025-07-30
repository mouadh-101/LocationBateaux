package org.nst.bateaux.dto.reservation;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class ReservationTypeSettingsDto {
    Long id;
    boolean full_day_enabled;
    boolean half_day_enabled;
    boolean two_hours_enabled;
    Double fullDayPrice;
    Double halfDayPrice;
    Double twoHoursPrice;
}
