import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
} from '@nestjs/websockets';
import { OnModuleInit } from '@nestjs/common';
import { Server } from 'socket.io';
import { KafkaProducerService } from '../kafka/kafka.producer';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnModuleInit {
    @WebSocketServer()
    server: Server;

    constructor(private readonly kafkaProducer: KafkaProducerService) { }

    onModuleInit() {
        this.server.on('connection', (client) => {
            console.log(`Client connected: ${client.id}`);
        });
    }

    @SubscribeMessage('placeOrder')
    async handleOrder(@MessageBody() order: any) {
        console.log('📦 Order has been placed:', order);

        // Kafka event
        await this.kafkaProducer.placeOrder({
            type: 'ORDER_PLACED',
            payload: {
                order,
                timestamp: Date.now(),
            },
        });
    }
}
