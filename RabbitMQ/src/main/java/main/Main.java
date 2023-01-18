package main;

import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.net.URISyntaxException;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import com.rabbitmq.tools.json.JSONWriter;


public class Main {
    static List<String> measurementValue = new ArrayList<>();
    static Random rand = new Random();
    static Integer NUMBER_OF_SENSORS = 2;
    static String QUEUE_NAME = "device_consumption";

    public static void readCSV(){

        try (BufferedReader br = new BufferedReader(new FileReader("src/main/resources/sensor.csv"))) {
            String line;
            while ((line = br.readLine()) != null) {
                measurementValue.add(line);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static String readDeviceId(int index){
        try (BufferedReader br = new BufferedReader(new FileReader("src/main/resources/deviceId.txt"))) {
            String line="";
            while(index > 0) {
                line = br.readLine();
                index--;
            }
            String[] values = line.split("=");
            return values[1];
        } catch (IOException e) {
            e.printStackTrace();
        }
        return "No device selected";
    }


    static class MessageSender implements Runnable{
        int id;
        public MessageSender(int id){
            this.id = id;
        }

        @Override
        public void run() {
            String deviceId = readDeviceId(id);
            int position = rand.nextInt(measurementValue.size() - 1);
            String consumption = measurementValue.get(position);
            LocalDate currentDate = LocalDate.now();
            LocalTime time = LocalTime.now();

            Map<String, String> map = new HashMap<String, String>();
            map.put("date", String.valueOf(currentDate));
            map.put("time", String.valueOf(time));
            map.put("device_id", deviceId);
            map.put("measurement_value", consumption);
            JSONWriter rabbitmqJson = new JSONWriter();
            String jsonMessage = rabbitmqJson.write(map);

            ConnectionFactory factory = new ConnectionFactory();
            try{
                factory.setUri("amqps://biuuhtbj:aAJJne_inqaao-8hjptuNxxdFC-Nuucc@goose.rmq2.cloudamqp.com/biuuhtbj");
            } catch (URISyntaxException e) {
                e.printStackTrace();
            } catch (NoSuchAlgorithmException e) {
                e.printStackTrace();
            } catch (KeyManagementException e) {
                e.printStackTrace();
            }

            factory.setVirtualHost("biuuhtbj");
            factory.setUsername("biuuhtbj");
            factory.setPassword("aAJJne_inqaao-8hjptuNxxdFC-Nuucc");

            try (Connection connection = factory.newConnection();
                 Channel channel = connection.createChannel()) {

                channel.queueDeclare(QUEUE_NAME, false, false, false, null);
                channel.basicPublish("", QUEUE_NAME, null, jsonMessage.getBytes());
                System.out.println(" [x] Sent '" + map + "'");
            } catch(Exception e){
                System.out.println(e);
            }
        }
    }


    public static void main(String[] args) {
        readCSV();

        ScheduledExecutorService executor = Executors.newScheduledThreadPool(NUMBER_OF_SENSORS + 1);

        for(int i = 0; i < NUMBER_OF_SENSORS; i ++){
            executor.scheduleAtFixedRate(new MessageSender(i+1), 0, 10, TimeUnit.SECONDS);
        }
    }
}
