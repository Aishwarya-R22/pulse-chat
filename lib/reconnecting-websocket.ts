type SocketOptions={maxRetries?:number;baseDelayMs?:number;onState?:(state:'connecting'|'connected'|'reconnecting'|'offline')=>void};
export class ReconnectingSocket{
 private socket:WebSocket|null=null;private attempts=0;private closed=false;private queue:string[]=[];
 constructor(private url:string,private options:SocketOptions={}){}
 connect(onMessage:(event:MessageEvent)=>void){this.closed=false;this.options.onState?.(this.attempts?'reconnecting':'connecting');this.socket=new WebSocket(this.url);this.socket.onopen=()=>{this.attempts=0;this.options.onState?.('connected');this.queue.splice(0).forEach(item=>this.socket?.send(item))};this.socket.onmessage=onMessage;this.socket.onclose=()=>this.reconnect(onMessage);this.socket.onerror=()=>this.socket?.close()}
 send(data:unknown){const encoded=JSON.stringify(data);if(this.socket?.readyState===WebSocket.OPEN)this.socket.send(encoded);else this.queue.push(encoded)}
 close(){this.closed=true;this.socket?.close()}
 private reconnect(onMessage:(event:MessageEvent)=>void){if(this.closed)return;const max=this.options.maxRetries??8;if(this.attempts>=max){this.options.onState?.('offline');return}const delay=Math.min((this.options.baseDelayMs??500)*2**this.attempts,15000)+Math.random()*300;this.attempts++;this.options.onState?.('reconnecting');setTimeout(()=>this.connect(onMessage),delay)}
}
