import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway(4000, { cors: true })

// @WebSocketGateway(4000)
export class ChatGateway {
  @WebSocketServer()
  server;

  public handleConnection(client: Socket): void {
    console.log('connected', client.id);
    client.leave(client.id);
    client.data.roomId = `room:lobby`;
    client.join('room:lobby');
    this.server.emit('login', 'login');
  }

  public handleDisconnect(client: Socket): void {
    console.log('disonnected', client.id);
    this.server.emit('login', 'logout');
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() message: string): void {
    console.log('io.on.message');
    this.server.emit('message', message);
    this.server.emit('message', 'message sent_selim');
  }
  @SubscribeMessage('chat')
  handleChat(@MessageBody() chat: string): void {
    console.log('io.on_chat');
    this.server.emit('chat', chat);
    const data = chat;
    console.log(data);
    console.log(data['name']);
    // if(data.age)console.log(data.age);
    this.server.emit('chat', 'chat sent');
  }
}
