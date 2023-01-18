package ro.tuc.ds2020.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ro.tuc.ds2020.entities.Role;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoleDTO {
    Long id;
    String name;

    public RoleDTO convertEntityToDto(Role role)
    {
        return new RoleDTO(
                role.getId(),
                role.getName()
        );
    }
}
