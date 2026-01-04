package com.elearning.tutorservice.service;

import com.elearning.tutorservice.dto.request.CareerEntryRequest;
import com.elearning.tutorservice.dto.response.CareerEntryResponse;

import java.util.List;
import java.util.UUID;

public interface CareerEntryService {
    
    CareerEntryResponse createCareerEntry(UUID tutorId, CareerEntryRequest request);
    
    CareerEntryResponse updateCareerEntry(UUID tutorId, UUID entryId, CareerEntryRequest request);
    
    void deleteCareerEntry(UUID tutorId, UUID entryId);
    
    List<CareerEntryResponse> getCareerEntriesByTutorId(UUID tutorId);
    
    List<CareerEntryResponse> getEducationsByTutorId(UUID tutorId);
    
    List<CareerEntryResponse> getExperiencesByTutorId(UUID tutorId);
}
