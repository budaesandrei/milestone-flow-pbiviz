"use strict";
import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";

import FormattingSettingsCard = formattingSettings.SimpleCard;
import FormattingSettingsSlice = formattingSettings.Slice;
import FormattingSettingsModel = formattingSettings.Model;

class GeneralCard extends FormattingSettingsCard {
  replaceThis = new formattingSettings.TextInput({
    name: "replaceThis",
    displayName: "Replace This",
    value: "Hello World!",
    placeholder: "Enter text to replace",
  });

  name = "general";
  displayName = "General";
  slices: FormattingSettingsSlice[] = [this.replaceThis];
}

export class VisualFormattingSettingsModel extends FormattingSettingsModel {
  general = new GeneralCard();

  cards = [this.general];
}