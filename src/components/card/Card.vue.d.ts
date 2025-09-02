import type { pt } from "@/utils/object.utils";
import type { CardPassThroughOptions } from "primevue";
import type { Slot } from "vue";

export interface CardProps {
    pt?: pt<CardPassThroughOptions>;
}

export interface CardSlots {
    'content': Slot;
}