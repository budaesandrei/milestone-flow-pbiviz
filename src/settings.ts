"use strict";
import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";

import FormattingSettingsCard = formattingSettings.SimpleCard;
import FormattingSettingsSlice = formattingSettings.Slice;
import FormattingSettingsModel = formattingSettings.Model;

class GeneralCard extends FormattingSettingsCard {
  title = new formattingSettings.TextInput({
    name: "title",
    displayName: "Title",
    value: "",
    placeholder: "Enter Title",
  });

  name = "general";
  displayName = "General";
  slices: FormattingSettingsSlice[] = [this.title];
}

class StatusStylesCard extends FormattingSettingsCard {
  inProgress = new formattingSettings.ColorPicker({
    name: "inProgress",
    displayName: "In Progress",
    value: { value: "#f1f6df" },
  });
  pending = new formattingSettings.ColorPicker({
    name: "pending",
    displayName: "Pending",
    value: { value: "#f7e9f2" },
  });
  completed = new formattingSettings.ColorPicker({
    name: "completed",
    displayName: "Completed",
    value: { value: "#d3efee" },
  });
  notStarted = new formattingSettings.ColorPicker({
    name: "notStarted",
    displayName: "Not Started",
    value: { value: "#dedcd9" },
  });

  name = "statusStyles";
  displayName = "Status Styles";
  slices: FormattingSettingsSlice[] = [
    this.inProgress,
    this.pending,
    this.completed,
    this.notStarted,
  ];
}

class ProgressBarStylesCard extends FormattingSettingsCard {
  highColor = new formattingSettings.ColorPicker({
    name: "highColor",
    displayName: "High Color",
    value: { value: "#4caf50" }
  });
  mediumToHighThreshold = new formattingSettings.NumUpDown({
    name: "mediumToHighThreshold",
    displayName: "Med-High Threshold %",
    value: 100,
    options: {
      minValue: { type: powerbi.visuals.ValidatorType.Min, value: 0 },
      maxValue: { type: powerbi.visuals.ValidatorType.Max, value: 100 }
    }
  });
  mediumColor = new formattingSettings.ColorPicker({
    name: "mediumColor",
    displayName: "Medium Color",
    value: { value: "#ff9800" }
  });
  lowToMediumThreshold = new formattingSettings.NumUpDown({
    name: "lowToMediumThreshold",
    displayName: "Low-Med Threshold %",
    value: 50,
    options: {
      minValue: { type: powerbi.visuals.ValidatorType.Min, value: 0 },
      maxValue: { type: powerbi.visuals.ValidatorType.Max, value: 100 }
    }
  });
  lowColor = new formattingSettings.ColorPicker({
    name: "lowColor",
    displayName: "Low Color",
    value: { value: "#f44336" }
  });

  name = "progressBarStyles";
  displayName = "Progress Bar Styles";
  slices: FormattingSettingsSlice[] = [this.highColor, this.mediumToHighThreshold, this.mediumColor, this.lowToMediumThreshold, this.lowColor];

  onPreProcess?(): void {
    // Establish current values (bounded to 0..100 for safety)
    const high = Math.max(0, Math.min(100, this.mediumToHighThreshold.value ?? 100));
    const low = Math.max(0, Math.min(100, this.lowToMediumThreshold.value ?? 0));

    // Invisible walls: only set validators, do not change values
    this.lowToMediumThreshold.options = {
      minValue: { type: powerbi.visuals.ValidatorType.Min, value: 0 },
      maxValue: { type: powerbi.visuals.ValidatorType.Max, value: high - 1 }
    };

    this.mediumToHighThreshold.options = {
      minValue: { type: powerbi.visuals.ValidatorType.Min, value: low + 1 },
      maxValue: { type: powerbi.visuals.ValidatorType.Max, value: 100 }
    };
  }
}

export class VisualFormattingSettingsModel extends FormattingSettingsModel {
  general = new GeneralCard();
  statusStyles = new StatusStylesCard();
  progressBarStyles = new ProgressBarStylesCard();

  cards = [this.general, this.statusStyles, this.progressBarStyles];
}
