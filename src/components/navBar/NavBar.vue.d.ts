import type { UserProfile } from "@/types/user.type";

export interface NavBarProps {
    visible?: boolean;
}

export interface ProfilePanelProps {
    user: UserProfile;
}