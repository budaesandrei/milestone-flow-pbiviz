"use strict";

import powerbi from "powerbi-visuals-api";
import * as React from "react";
import { createRoot, Root } from "react-dom/client";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";
import "./../style/visual.less";

import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;

import App from "./App";
import { VisualFormattingSettingsModel } from "./settings";
import { SettingsProvider } from "./hooks/useSettings";
import { DataProvider } from "./hooks/useData";
import { ViewportProvider } from "./hooks/useViewport";

const theme = createTheme({
  palette: {
    mode: "light",
  },
});

export class Visual implements IVisual {
  private host: powerbi.extensibility.visual.IVisualHost;
  private target: HTMLElement;
  private reactRoot: Root;
  private settings: VisualFormattingSettingsModel;
  private formattingSettingsService: FormattingSettingsService;
  private dataViews?: powerbi.DataView[];
  private viewport?: powerbi.IViewport;

  constructor(options: VisualConstructorOptions) {
    this.target = options.element;
    this.formattingSettingsService = new FormattingSettingsService();
    this.settings = new VisualFormattingSettingsModel();
    this.host = options.host;

    // Create React root
    this.reactRoot = createRoot(this.target);

    // Initial render
    this.renderApp();
  }

  public update(options: VisualUpdateOptions) {
    this.dataViews = options.dataViews;
    this.viewport = options.viewport;

    // 1) hydrate settings from metadata
    if (this.dataViews?.[0]) {
      this.settings =
        this.formattingSettingsService.populateFormattingSettingsModel(
          VisualFormattingSettingsModel,
          this.dataViews[0]
        );
    } else {
      this.settings = new VisualFormattingSettingsModel();
    }

    // 2) now build dynamic slices on the hydrated instance
    this.settings.statusStyles.updateColorPickers(
      this.dataViews,
      this.host.colorPalette,
      this.host
    );

    // 3) react render
    this.renderApp();
  }

  public getFormattingModel(): powerbi.visuals.FormattingModel {
    return this.formattingSettingsService.buildFormattingModel(this.settings);
  }

  private renderApp() {
    const app = React.createElement(App);

    const viewportProvider = React.createElement(ViewportProvider, {
      viewport: this.viewport,
      children: app,
    });

    const dataProvider = React.createElement(DataProvider, {
      dataViews: this.dataViews,
      children: viewportProvider,
    });

    const settingsProvider = React.createElement(SettingsProvider, {
      initialSettings: this.settings,
      onSettingsChanged: (newSettings: VisualFormattingSettingsModel) => {
        this.settings = newSettings;
      },
      children: dataProvider,
    });

    const AppWithProviders = React.createElement(
      ThemeProvider,
      { theme },
      React.createElement(CssBaseline, null),
      settingsProvider
    );

    this.reactRoot.render(AppWithProviders);
  }
}
