import {useEffect} from 'react';
import {chatSocket} from './socketConfig';

export interface Event {
  name: string;
  handler(...args: any[]): any;
}

export function useSocketEvents(events: Event[]) {
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
