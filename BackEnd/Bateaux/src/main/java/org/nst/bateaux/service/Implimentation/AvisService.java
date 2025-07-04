package org.nst.bateaux.service.Implimentation;
import lombok.AllArgsConstructor;
import org.nst.bateaux.config.BusinessException;
import org.nst.bateaux.dto.avis.AviData;
import org.nst.bateaux.entity.Avis;
import org.nst.bateaux.repository.AvisRepository;
import org.nst.bateaux.repository.BateauxRepository;
import org.nst.bateaux.repository.UserRepository;
import org.nst.bateaux.service.Interface.IAvisService;
import org.nst.bateaux.service.Interface.IUserService;
import org.nst.bateaux.service.mappers.MapToDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class AvisService implements IAvisService {

    @Autowired
    AvisRepository avisRepository ;
    @Autowired
    IUserService userService;
    @Autowired
    UserRepository userRepository;
    @Autowired
    BateauxRepository bateauxRepository;
    @Autowired
    MapToDto mapToDto;


    @Override
    public AviData ajouterAvis(AviData avis, Long bateauId, Long userId)
    {
        Avis newAvis = new Avis();
        newAvis.setNote(avis.getNote());
        newAvis.setCommentaire(avis.getCommentaire());
        newAvis.setDateCreation(LocalDateTime.now());
        newAvis.setBateau(bateauxRepository.findById(bateauId).orElseThrow(() -> new BusinessException("Bateau not found")));
        newAvis.setUtilisateur(userRepository.findById(userId).orElseThrow(() -> new BusinessException("User not found")));

        return mapToDto.mapToAvisDto(avisRepository.save(newAvis));
    }

    @Override
    public void supprimerAvis(Long id)
    {
        avisRepository.deleteById(id);
    }

    @Override
    public AviData updateAvis(Long id,AviData avis)
    {
        Avis i=avisRepository.findById(id).orElse(null);
        i.setNote(avis.getNote());
        i.setCommentaire(avis.getCommentaire());
        i.setDateCreation(avis.getDateCreation());
        return mapToDto.mapToAvisDto(avisRepository.save(i));
    }

    @Override
    public AviData getAvisById(Long id)
    {
        return mapToDto.mapToAvisDto(avisRepository.findById(id).orElseThrow(() -> new BusinessException("Avis not found")));
    }

    @Override
    public List<AviData> getAll() {
        List<AviData> avisList = new ArrayList<>();
        for(Avis i : avisRepository.findAll()) {
            avisList.add(mapToDto.mapToAvisDto(i));
        }
        return avisList;
    }


    @Override
    public List<AviData> getAllAvisByBataeuxId(Long bateauId) {
        List<AviData> avisList = new ArrayList<>();
        for (Avis avis : avisRepository.findAllByBateau(bateauxRepository.findById(bateauId)
                .orElseThrow(() -> new BusinessException("Bateau not found")))) {
            avisList.add(mapToDto.mapToAvisDto(avis));
        }
        return avisList;
    }
}
