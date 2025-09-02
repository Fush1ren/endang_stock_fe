export type EventType = string | symbol;

export type Handler<T = unknown> = (event: T) => void;

export type WildcardHandler<TEvents extends Record<EventType, any>> = (
  type: keyof TEvents,
  event: TEvents[keyof TEvents]
) => void;

export type EventHandlerList<T = unknown> = Handler<T>[];
export type WildcardHandlerList<TEvents extends Record<EventType, any>> = WildcardHandler<TEvents>[];

export type EventHandlerMap<TEvents extends Record<EventType, any>> = Map<
  keyof TEvents | '*',
  EventHandlerList<any> | WildcardHandlerList<TEvents>
>;

export interface Emitter<TEvents extends Record<EventType, any>> {
  all: EventHandlerMap<TEvents>;

  on<Key extends keyof TEvents>(type: Key, handler: Handler<TEvents[Key]>): void;
  on(type: '*', handler: WildcardHandler<TEvents>): void;

  off<Key extends keyof TEvents>(type: Key, handler?: Handler<TEvents[Key]>): void;
  off(type: '*', handler: WildcardHandler<TEvents>): void;

  emit<Key extends keyof TEvents>(type: Key, event: TEvents[Key]): void;
  emit<Key extends keyof TEvents>(
    type: undefined extends TEvents[Key] ? Key : never
  ): void;
}

export default function emitt<TEvents extends Record<EventType, any>>(
  initialMap?: EventHandlerMap<TEvents>
): Emitter<TEvents> {
    type GenericHandler =
        | Handler<TEvents[keyof TEvents]>
        | WildcardHandler<TEvents>;
    
    const eventMap: EventHandlerMap<TEvents> =
        initialMap ?? (window.eventBus?.all as EventHandlerMap<TEvents>) ?? new Map();
    
    const emitter: Emitter<TEvents> = {
        all: eventMap,

    on(type: keyof TEvents | '*', handler: GenericHandler): void {
      const handlers = eventMap.get(type);
      if (handlers) {
        (handlers as GenericHandler[]).push(handler);
      } else if (type === '*') {
        eventMap.set(type, [handler] as WildcardHandlerList<TEvents>);
      } else {
        eventMap.set(type, [handler] as EventHandlerList<any>);
      }
    },

    off(type: keyof TEvents | '*', handler?: GenericHandler): void {
      const handlers = eventMap.get(type) as GenericHandler[] | undefined;
      if (!handlers) return;

      if (handler) {
        const index = handlers.indexOf(handler);
        if (index >= 0) handlers.splice(index, 1);
      } else {
        eventMap.set(type, []);
      }
    },

    emit(type: keyof TEvents, event?: TEvents[keyof TEvents]): void {
      const specificHandlers = eventMap.get(type) as Handler<TEvents[typeof type]>[] | undefined;
      specificHandlers?.slice().forEach((handler) => {
        handler(event as TEvents[typeof type]);
      });

      const wildcardHandlers = eventMap.get('*') as WildcardHandler<TEvents>[] | undefined;
      wildcardHandlers?.slice().forEach((handler) => {
        handler(type, event as TEvents[keyof TEvents]);
      });
    },
  };

  window.eventBus ??= emitter;

  return window.eventBus as Emitter<TEvents>;
}

declare global {
  interface Window {
    eventBus: Emitter<any>;
  }
}
