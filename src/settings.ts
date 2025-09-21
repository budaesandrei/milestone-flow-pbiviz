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
    value: { value: "#f1f6df" }
  });
  pending = new formattingSettings.ColorPicker({
    name: "pending",
    displayName: "Pending",
    value: { value: "#f7e9f2" }
  });
  completed = new formattingSettings.ColorPicker({
    name: "completed",
    displayName: "Completed",
    value: { value: "#d3efee" }
  });
  notStarted = new formattingSettings.ColorPicker({
    name: "notStarted",
    displayName: "Not Started",
    value: { value: "#dedcd9" }
  });

  name = "statusStyles";
  displayName = "Status Styles";
  slices: FormattingSettingsSlice[] = [this.inProgress, this.pending, this.completed, this.notStarted];
}

export class VisualFormattingSettingsModel extends FormattingSettingsModel {
  general = new GeneralCard();
  statusStyles = new StatusStylesCard();

  cards = [this.general, this.statusStyles];
}