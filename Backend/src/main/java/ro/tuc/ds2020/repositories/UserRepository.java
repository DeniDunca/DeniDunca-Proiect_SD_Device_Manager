package ro.tuc.ds2020.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ro.tuc.ds2020.entities.UserTable;

import java.util.Optional;

public interface UserRepository extends JpaRepository<UserTable, Long> {
    Optional<UserTable> findByName(String name);

    UserTable findByNameAndPassword(String name, String password);
}
