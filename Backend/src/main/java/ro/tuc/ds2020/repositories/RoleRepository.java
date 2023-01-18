package ro.tuc.ds2020.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ro.tuc.ds2020.entities.Role;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Role getById(Long roleID);
}
