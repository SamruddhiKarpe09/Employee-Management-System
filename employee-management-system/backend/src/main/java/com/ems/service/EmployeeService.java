package com.ems.service;

import com.ems.dto.EmployeeDTO;
import com.ems.entity.Department;
import com.ems.entity.Employee;
import com.ems.exception.DuplicateResourceException;
import com.ems.exception.ResourceNotFoundException;
import com.ems.repository.DepartmentRepository;
import com.ems.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;

    public Page<EmployeeDTO> search(String keyword, Long departmentId, Pageable pageable) {
        return employeeRepository.search(keyword, departmentId, pageable).map(this::toDTO);
    }

    public EmployeeDTO getById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
        return toDTO(employee);
    }

    public EmployeeDTO create(EmployeeDTO dto) {
        if (employeeRepository.existsByEmail(dto.getEmail())) {
            throw new DuplicateResourceException("Employee already exists with email: " + dto.getEmail());
        }
        Department department = departmentRepository.findById(dto.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + dto.getDepartmentId()));

        Employee employee = Employee.builder()
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .designation(dto.getDesignation())
                .department(department)
                .dateOfJoining(dto.getDateOfJoining())
                .active(dto.getActive() != null ? dto.getActive() : true)
                .build();

        return toDTO(employeeRepository.save(employee));
    }

    public EmployeeDTO update(Long id, EmployeeDTO dto) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));

        Department department = departmentRepository.findById(dto.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + dto.getDepartmentId()));

        employee.setFirstName(dto.getFirstName());
        employee.setLastName(dto.getLastName());
        employee.setEmail(dto.getEmail());
        employee.setPhone(dto.getPhone());
        employee.setDesignation(dto.getDesignation());
        employee.setDepartment(department);
        employee.setDateOfJoining(dto.getDateOfJoining());
        if (dto.getActive() != null) {
            employee.setActive(dto.getActive());
        }

        return toDTO(employeeRepository.save(employee));
    }

    public void delete(Long id) {
        if (!employeeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Employee not found with id: " + id);
        }
        employeeRepository.deleteById(id);
    }

    private EmployeeDTO toDTO(Employee e) {
        return EmployeeDTO.builder()
                .id(e.getId())
                .firstName(e.getFirstName())
                .lastName(e.getLastName())
                .email(e.getEmail())
                .phone(e.getPhone())
                .designation(e.getDesignation())
                .departmentId(e.getDepartment() != null ? e.getDepartment().getId() : null)
                .departmentName(e.getDepartment() != null ? e.getDepartment().getName() : null)
                .dateOfJoining(e.getDateOfJoining())
                .active(e.getActive())
                .build();
    }
}
