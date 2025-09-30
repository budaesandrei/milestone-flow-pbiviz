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
    this.host = options.host;
    this.target = options.element;
    this.formattingSettingsService = new FormattingSettingsService();
    this.settings = new VisualFormattingSettingsModel();

    // Create React root
    this.reactRoot = createRoot(this.target);

    // Initial render
    this.renderApp();
  }

  public update(options: VisualUpdateOptions) {
    const dv = options.dataViews && options.dataViews[0];
    this.settings =
      this.formattingSettingsService.populateFormattingSettingsModel(
        VisualFormattingSettingsModel,
        dv
      );

    if (!dv) {
      this.renderNoData();
      return;
    }

    if (dv.table) {
      // Store the latest data
      this.dataViews = options.dataViews;
      this.viewport = options.viewport;
    } else {
      this.renderNoData();
      return;
    }

    const statusIndex = dv.table?.columns.filter((c) => c.roles?.status)?.[0]
      ?.index;
    const statuses = dv.table?.rows
      .map((r) => r[statusIndex]?.toString())
      ?.filter((s) => s !== undefined && s !== null) as string[] | undefined;
    const uniqueStatuses = [...new Set(statuses)].slice(0, 6);

    // Feed distinct statuses into formatting settings so StatusStyles card is dynamic
    if (this.settings?.statusStyles && Array.isArray(uniqueStatuses)) {
      // Preserve any existing slices/colors by passing current slices
      (this.settings.statusStyles as any).setStatuses(
        uniqueStatuses,
        (this.settings.statusStyles as any).slices
      );
    }

    // Re-render with new data
    this.renderApp();
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

  private renderNoData() {
    this.reactRoot.render(
      React.createElement(
        "div",
        {
          style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            color: "#666",
          },
        },
        "No data available"
      )
    );
  }

  // --- Power BI Interface Methods ---

  public getFormattingModel(): powerbi.visuals.FormattingModel {
    return this.formattingSettingsService.buildFormattingModel(this.settings);
  }

  public destroy(): void {
    if (this.reactRoot) {
      this.reactRoot.unmount();
    }
  }
}
