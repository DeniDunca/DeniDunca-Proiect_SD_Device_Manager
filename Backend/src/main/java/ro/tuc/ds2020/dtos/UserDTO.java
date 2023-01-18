package ro.tuc.ds2020.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ro.tuc.ds2020.entities.UserTable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {

    private Long id;
    private String name;
    private String password;
    private Long role;

    public UserDTO convertEntityToDto(UserTable userTable){
        return new UserDTO(
                userTable.getId(),
                userTable.getName(),
                userTable.getPassword(),
                userTable.getRole().getId()
        );
    }


}
