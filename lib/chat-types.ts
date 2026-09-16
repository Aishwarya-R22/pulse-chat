export type Presence='online'|'away'|'offline';
export type DeliveryState='pending'|'sent'|'delivered'|'read'|'failed';
export interface ChatUser{id:string;displayName:string;email:string;presence:Presence;lastSeen?:string}
export interface ChatMessage{id:string;conversationId:string;authorId:string;body:string;createdAt:string;updatedAt?:string;replyToId?:string;status:DeliveryState}
export type SocketEvent={type:'message.created'|'message.updated'|'message.deleted';payload:ChatMessage}|{type:'presence.changed';payload:{userId:string;presence:Presence}}|{type:'typing.changed';payload:{conversationId:string;userId:string;typing:boolean}};
