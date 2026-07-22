package com.ems.service;

import com.ems.dto.DepartmentDTO;
import com.ems.entity.Department;
import com.ems.exception.DuplicateResourceException;
import com.ems.exception.ResourceNotFoundException;
import com.ems.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    public List<DepartmentDTO> getAll() {
        return departmentRepository.findAll().stream().map(this::toDTO).toList();
    }

    public DepartmentDTO create(DepartmentDTO dto) {
        if (departmentRepository.existsByName(dto.getName())) {
            throw new DuplicateResourceException("Department already exists: " + dto.getName());
        }
        Department saved = departmentRepository.save(Department.builder().name(dto.getName()).build());
        return toDTO(saved);
    }

    public void delete(Long id) {
        if (!departmentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Department not found with id: " + id);
        }
        departmentRepository.deleteById(id);
    }

    private DepartmentDTO toDTO(Department d) {
        return DepartmentDTO.builder().id(d.getId()).name(d.getName()).build();
    }
}
