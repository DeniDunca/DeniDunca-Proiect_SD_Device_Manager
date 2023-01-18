package ro.tuc.ds2020.receiver;

import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
import com.rabbitmq.client.DeliverCallback;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ro.tuc.ds2020.entities.Consumption;
import ro.tuc.ds2020.entities.Device;
import ro.tuc.ds2020.repositories.ConsumptionRepository;
import ro.tuc.ds2020.repositories.DeviceRepository;

import java.io.IOException;
import java.net.URISyntaxException;
import java.nio.charset.StandardCharsets;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.concurrent.TimeoutException;

@Service
@Transactional
public class MessageConsumer {

    @Autowired
    private DeviceRepository deviceRepository;

    @Autowired
    private ConsumptionRepository consumptionRepository;

    @Autowired
    private SimpMessagingTemplate template;

    public MessageConsumer() {
        ConnectionFactory connectionFactory = new ConnectionFactory();
        try{
            connectionFactory.setUri("amqps://biuuhtbj:aAJJne_inqaao-8hjptuNxxdFC-Nuucc@goose.rmq2.cloudamqp.com/biuuhtbj");
        } catch (URISyntaxException e) {
            e.printStackTrace();
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        } catch (KeyManagementException e) {
            e.printStackTrace();
        }
        connectionFactory.setVirtualHost("biuuhtbj");
        connectionFactory.setUsername("biuuhtbj");
        connectionFactory.setPassword("aAJJne_inqaao-8hjptuNxxdFC-Nuucc");

        try {
            Connection connection = connectionFactory.newConnection();
            Channel channel = connection.createChannel();

            String QUEUE_NAME = "device_consumption";
            channel.queueDeclare(QUEUE_NAME, false, false, false, null);
            System.out.println(" [*] Waiting for messages. To exit press CTRL+C");

            channel.basicConsume(QUEUE_NAME, true, deliverCallback, consumerTag -> { });

        } catch (IOException | TimeoutException e) {
            e.printStackTrace();
        }
    }

    private Consumption transformMessage(String message){
        String[] split = message.split(",");

        String date = split[0].split(":")[1];
        date = date.substring(1,date.length() - 1);

        String measurementValue = split[1].split(":")[1];
        measurementValue = measurementValue.substring(1, measurementValue.length() - 1);

        String device_id = split[2].split(":")[1];
        device_id = device_id.substring(1,device_id.length() - 1);
        Long deviceId = Long.valueOf(device_id);

        String[] timeArray = split[3].split("\"");
        String time = timeArray[timeArray.length - 2];

        LocalDate localDate = LocalDate.parse(date);
        LocalTime localTime = LocalTime.parse(time);

        Device device = deviceRepository.findById(deviceId).get();

        return new Consumption(null,localDate,localTime,measurementValue, device);
    }

    DeliverCallback deliverCallback = (consumerTag, delivery) -> {
        String message = new String(delivery.getBody(), StandardCharsets.UTF_8);
        System.out.println(message);
        transformMessage(message);
        Consumption consumption = transformMessage(message);
        consumptionRepository.save(consumption);
        List<Consumption> deviceConsumptions = consumptionRepository.getByDevice(consumption.getDevice()).get();

        Double consumptionTotal = 0.0;
        for(Consumption cons : deviceConsumptions){
            if(cons.getHour().getHour() == consumption.getHour().getHour() &&
                    cons.getDate().equals(consumption.getDate())){
                consumptionTotal += Double.parseDouble(cons.getEnergyConsumption());
            }
        }
        Double maxDeviceConsumption = Double.parseDouble(consumption.getDevice().getMaxConsumption());

        Long userId = consumption.getDevice().getUserTable().getId();
        System.out.println(userId);
        template.convertAndSend("/notification/socket/api/consumption/" + userId,
                consumptionTotal > maxDeviceConsumption? "limit exceeded" : "ok");

        System.out.println(" [x] Received '" + message + "'");
    };

}
