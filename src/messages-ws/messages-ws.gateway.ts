import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	WebSocketGateway,
} from '@nestjs/websockets'
import { MessagesWsService } from './messages-ws.service'
import { Socket } from 'socket.io'

@WebSocketGateway({ cors: true })
export class MessagesWsGateway
	implements OnGatewayConnection, OnGatewayDisconnect
{
	constructor(private readonly messagesWsService: MessagesWsService) {}
	handleDisconnect(client: Socket) {
		console.log({ client })
	}
	handleConnection(client: Socket, ...args: any[]) {
		console.log({ client, args })
	}
}
