package ro.tuc.ds2020.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ro.tuc.ds2020.entities.Consumption;
import ro.tuc.ds2020.entities.Device;

import java.util.List;
import java.util.Optional;

public interface ConsumptionRepository extends JpaRepository<Consumption, Long> {
    Optional<List<Consumption>> getByDevice(Device device);
}
