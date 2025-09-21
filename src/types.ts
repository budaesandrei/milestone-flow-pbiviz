import { VisualFormattingSettingsModel } from "./settings";

export type StatusKey = "completed" | "in-progress" | "pending" | "not-started";

export type CardProps = {
    milestoneName: string;
    milestoneNumber: number;
    dueDate: string;
    status: string;
    settings: VisualFormattingSettingsModel;
  };