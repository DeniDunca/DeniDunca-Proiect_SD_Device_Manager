# Proiect_SD_Device_Manager
Full stack application that uses Java-SpringBoot, ReactJS and postgreSQL database. 

The project represents a website for Device Management. The website can be accesed by admin and users.
The admin can execute CRUD operations on the users table and on the devices table and can also add or remove devices from user.
The user can see his devices and can see a real-time chart with the consumption of each device for every hour. He is also notified when the consumtion per hour for a specific device exceedes the maximum consumtion value.
In order to implement this I used RabbitMQ as a way to store on cloud a queue with the messeges that contain the consumtion information. This way it simulates the use of multiple devices by multiple users ant the same time. The Consumption chart on the user interface is updated with WebSockets every time a message is received from the queue.
The aplication also contains a chat feature, where users can directly comunicate with the admin and the admin can comunicate with multime users at the same time. This was implemented using WebSockets, the messages are send and received in real time. I also used WebSockets to notify when the message was seen by the receiver and when the other person it started to type in the chat.
For the security part I implemented a JWT security on every Rest call uSing a generated token so the calls cannot be accesed unless the user is authenticated. Also on the fronted I created private routes so that the user cannot acces admin pages.
This project has also the configurations (docker-compose.yaml and Dockerfile) to deploy on docker localy by using "docker-compose build" and "docker-compose up" commands.