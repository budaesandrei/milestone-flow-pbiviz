import { VisualFormattingSettingsModel } from "./settings";
import powerbi from "powerbi-visuals-api";

export type CardProps = {
  milestoneName: string;
  milestoneNumber: number;
  dueDate: string;
  progress: number;
  status: string;
  settings: VisualFormattingSettingsModel;
  viewport: powerbi.IViewport;
};
