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

  scaleFactor = new formattingSettings.Slider({
    name: "scaleFactor",
    displayName: "Scale Factor",
    value: 50,
    options: {
      minValue: { type: powerbi.visuals.ValidatorType.Min, value: 10 },
      maxValue: { type: powerbi.visuals.ValidatorType.Max, value: 100 },
    },
  });

  cardBackgroundColor = new formattingSettings.ColorPicker({
    name: "cardBackgroundColor",
    displayName: "Card Background Color",
    value: { value: "#ffffff" },
  });

  name = "general";
  displayName = "General";
  slices: FormattingSettingsSlice[] = [this.title, this.scaleFactor, this.cardBackgroundColor];
}

class StatusStylesCard extends FormattingSettingsCard {
  name = "statusStyles";
  displayName = "Status Styles";
  uniqueStatuses: string[] = [];
  // Pre-create 6 index-based slices so the formatting service can populate values from capabilities
  slices: FormattingSettingsSlice[] = Array.from({ length: 6 }).map((_, idx) =>
    new formattingSettings.ColorPicker({
      name: idx.toString(),
      displayName: "",
      value: { value: "#f1f6df" },
    })
  );

  onPreProcess?(): void {
    // Hide any slice without a display name
    (this.slices || []).forEach((s: any) => {
      s.visible = !!s.displayName;
    });
  }

  public setStatuses(statuses: string[] | undefined, existingSlices?: FormattingSettingsSlice[]) {
    const incoming = (statuses || []).filter((s) => !!s);
    this.uniqueStatuses = incoming;

    // Keep exactly 6 slices (0..5) to match capabilities; map statuses to display names
    for (let i = 0; i < this.slices.length; i++) {
      const status = incoming[i] ?? "";
      const slice = this.slices[i] as any;
      if (slice) slice.displayName = status;
    }
  }
}

class ProgressBarStylesCard extends FormattingSettingsCard {
  highColor = new formattingSettings.ColorPicker({
    name: "highColor",
    displayName: "High Color",
    value: { value: "#4caf50" },
  });
  mediumToHighThreshold = new formattingSettings.NumUpDown({
    name: "mediumToHighThreshold",
    displayName: "Med-High Threshold %",
    value: 100,
    options: {
      minValue: { type: powerbi.visuals.ValidatorType.Min, value: 0 },
      maxValue: { type: powerbi.visuals.ValidatorType.Max, value: 100 },
    },
  });
  mediumColor = new formattingSettings.ColorPicker({
    name: "mediumColor",
    displayName: "Medium Color",
    value: { value: "#ff9800" },
  });
  lowToMediumThreshold = new formattingSettings.NumUpDown({
    name: "lowToMediumThreshold",
    displayName: "Low-Med Threshold %",
    value: 50,
    options: {
      minValue: { type: powerbi.visuals.ValidatorType.Min, value: 0 },
      maxValue: { type: powerbi.visuals.ValidatorType.Max, value: 100 },
    },
  });
  lowColor = new formattingSettings.ColorPicker({
    name: "lowColor",
    displayName: "Low Color",
    value: { value: "#f44336" },
  });

  name = "progressBarStyles";
  displayName = "Progress Bar Styles";
  slices: FormattingSettingsSlice[] = [
    this.highColor,
    this.mediumToHighThreshold,
    this.mediumColor,
    this.lowToMediumThreshold,
    this.lowColor,
  ];

  onPreProcess?(): void {
    // Establish current values (bounded to 0..100 for safety)
    const high = Math.max(
      0,
      Math.min(100, this.mediumToHighThreshold.value ?? 100)
    );
    const low = Math.max(
      0,
      Math.min(100, this.lowToMediumThreshold.value ?? 0)
    );

    // Invisible walls: only set validators, do not change values
    this.lowToMediumThreshold.options = {
      minValue: { type: powerbi.visuals.ValidatorType.Min, value: 0 },
      maxValue: { type: powerbi.visuals.ValidatorType.Max, value: high - 1 },
    };

    this.mediumToHighThreshold.options = {
      minValue: { type: powerbi.visuals.ValidatorType.Min, value: low + 1 },
      maxValue: { type: powerbi.visuals.ValidatorType.Max, value: 100 },
    };
  }
}

export class VisualFormattingSettingsModel extends FormattingSettingsModel {
  general = new GeneralCard();
  statusStyles = new StatusStylesCard();
  progressBarStyles = new ProgressBarStylesCard();

  cards = [this.general, this.statusStyles, this.progressBarStyles];
}
