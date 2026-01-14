import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { Kafka, Producer, Partitioners } from 'kafkajs';

@Injectable()
export class KafkaProducerService
    implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(KafkaProducerService.name);
    private kafka = new Kafka({
        clientId: 'ws-service',
        brokers: ['localhost:9092'],
    });

    private producer: Producer = this.kafka.producer({
        createPartitioner: Partitioners.LegacyPartitioner,
    });

    async onModuleInit() {
        await this.producer.connect();
        this.logger.log('🚀 [Kafka] Producer connected 🚀');
    }

    async placeOrder(order: any) {
        await this.producer.send({
            topic: 'order-placement',
            messages: [
                {
                    value: JSON.stringify(order),
                },
            ],
        });
    }

    async onModuleDestroy() {
        await this.producer.disconnect();
    }
}
