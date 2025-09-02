export type BadgeSeverity = 'success' | 'warning' | 'danger';

export interface BadgeProps {
    label?: string;
    severity?: BadgeSeverity;
    useTooltip?: boolean;
}