import { VisualFormattingSettingsModel } from "./settings";
import powerbi from "powerbi-visuals-api";

export type StatusKey = "completed" | "in-progress" | "pending" | "not-started";

export type CardProps = {
    milestoneName: string;
    milestoneNumber: number;
    dueDate: string;
    status: string;
    settings: VisualFormattingSettingsModel;
    viewport: powerbi.IViewport;
  };