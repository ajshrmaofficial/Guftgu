import {useCallback, useEffect, useMemo} from 'react';
import {chatSocket} from './socketConfig';
import { socketEvent } from './socketEvents';
// export interface ReceiveEvent {
//   name: string;
//   handler(...args: any[]): any;
// }

// export interface SendEvent {
//   name: string;
//   prepare?: (...args: any[]) => any;
// }

export function useSocketEvents(events: socketEvent[]) {
  useEffect(() => {
    for (const event of events) {
      chatSocket.on(event.name, event.handler);
    }

    return () => {
      for (const event of events) {
        chatSocket.off(event.name);
      }
    };
  }, []);
}

// export function useSocketSendEvents<T extends Record<string, SendEvent>>(events: T) {
//   const sendEventHandlers = useMemo(() => {
//     return Object.entries(events).reduce((acc, [key, event]) => {
//       acc[key as keyof T] = useCallback((...args: any[]) => {
//         const data = event.prepare ? event.prepare(...args) : args;
//         chatSocket.emit(event.name, ...data);
//       }, [event.name, event.prepare]);
//       return acc;
//     }, {} as { [K in keyof T]: (...args: any[]) => void });
//   }, [events]);

//   return sendEventHandlers;
// }

// export function useSocketSendEvents(events: SendEvent[]){
//   const handlers: Record<string, (...args: any[])=>void> = {}
//   events.map(value => {
//     handlers[value.name] = (...args: any[]) => {
//       const data = value.prepare ? value.prepare(...args) : args;
//       chatSocket.emit(value.name, ...data);
//     } 
//   })
//   return handlers;
// }
