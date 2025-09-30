import React from "react";
import { Box, Typography } from "@mui/material";
import { useSettings } from "./hooks/useSettings";
import { useData } from "./hooks/useData";
import { useViewport } from "./hooks/useViewport";
import Cards from "./components/Cards";

const App: React.FC = () => {
  // Access hooks - available throughout your component tree
  const { settings, updateSettings } = useSettings();
  const { dataViews } = useData();
  const { viewport } = useViewport();

  return (
    <Box
      sx={{
        width: viewport?.width || "100%",
        height: viewport?.height || "100%",
        padding: 2,
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "flex-start",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {!!settings.general?.title?.value && (
        <Typography
          variant="h6"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            color: "#02313b",
            fontWeight: 400,
          }}
        >
          {`Milestones for ${settings.general.title.value}`}
        </Typography>
      )}
      {/* Add your milestone flow components here */}
      <Cards dataViews={dataViews} settings={settings} viewport={viewport} />
    </Box>
  );
};

export default App;
