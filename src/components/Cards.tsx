import React, { useRef, useState, useEffect } from "react";
import Card from "./Card";
import Box from "@mui/material/Box";
import {
  Forward as Arrow,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";
import { IconButton } from "@mui/material";

const Cards: React.FC<{ dataViews; settings; viewport }> = (props: {
  dataViews;
  settings;
  viewport;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [needsScroller, setNeedsScroller] = useState(false);
  const [maxIndex, setMaxIndex] = useState(0);

  const rows = props.dataViews[0]?.table?.rows;
  const cols = props.dataViews[0]?.table?.columns?.map(
    (col) => Object.keys(col.roles)[0]
  );
  const data = rows?.map((row) => {
    const obj = {};
    cols.forEach((col, index) => {
      let value = row[index];
      // Convert date format if it's a dueDate field
      if (col === "dueDate" && value) {
        const date = new Date(value);
        value = date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "2-digit",
        });
      }
      obj[col] = value;
    });
    return obj;
  });

  if (!data) return null;

  // When a milestoneNumber field is present, sort by it (ascending).
  // Items without a valid number are sent to the end.
  const hasMilestoneNumber = cols?.includes("milestoneNumber");
  const toNumericValue = (value: unknown) => {
    if (typeof value === "number")
      return Number.isFinite(value) ? value : Number.POSITIVE_INFINITY;
    const parsed = Number(value as any);
    return Number.isFinite(parsed) ? parsed : Number.POSITIVE_INFINITY;
  };
  const dataSorted = hasMilestoneNumber
    ? [...data].sort(
        (a, b) =>
          toNumericValue(a.milestoneNumber) - toNumericValue(b.milestoneNumber)
      )
    : data;

  // Calculate responsive card size based on viewport height
  const getCardSize = () => {
    const baseCardSize = 248;
    const maxViewportHeight = 388;
    const minCardSize = 180;
    
    const viewportHeight = props.viewport?.height || 400;
    const scaleFactor = viewportHeight > maxViewportHeight 
      ? 1 
      : Math.max(viewportHeight / maxViewportHeight, minCardSize / baseCardSize);
    
    return Math.round(baseCardSize * scaleFactor);
  };

  // Check if cards extend beyond viewport
  useEffect(() => {
    if (dataSorted.length > 0) {
      const containerWidth = props.viewport.width;
      const cardSize = getCardSize();
      const cardWidth = cardSize + 8 + 32 + 8; // card width + gap + arrow + gap
      const totalWidth = dataSorted.length * cardWidth;

      if (totalWidth > containerWidth) {
        setNeedsScroller(true);
        const visibleCards = Math.floor(containerWidth / cardWidth);
        setMaxIndex(dataSorted.length - visibleCards);
      } else {
        setNeedsScroller(false);
        setMaxIndex(0);
      }
    }
  }, [dataSorted, props.viewport]);

  const slideLeft = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const slideRight = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const getTransformValue = () => {
    const cardSize = getCardSize();
    const cardWidth = cardSize + 8 + 32 + 8; // card width + gap + arrow + gap
    return `translateX(-${currentIndex * cardWidth}px)`;
  };

  return (
    <Box sx={{ position: "relative", maxHeight: "calc(100vh - 120px)" }}>
      <Box
        sx={{
          overflow: "hidden",
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            transform: getTransformValue(),
            transition: "transform 0.3s ease-in-out",
          }}
        >
          {!!dataSorted &&
            dataSorted.map((r, index) => (
              <React.Fragment key={index}>
                <Card
                  settings={props.settings}
                  viewport={props.viewport}
                  milestoneName={r.milestoneName}
                  milestoneNumber={
                    !r.milestoneNumber ? index + 1 : r.milestoneNumber
                  }
                  progress={r.progress}
                  dueDate={r.dueDate}
                  status={r.status}
                />
                {index < dataSorted.length - 1 && (
                  <Arrow
                    sx={{
                      fontSize: 32,
                      color:
                        r.status?.toLowerCase() === "completed"
                          ? "#00b5ae"
                          : "#ccc",
                      flexShrink: 0,
                    }}
                  />
                )}
              </React.Fragment>
            ))}
        </Box>
      </Box>

      {/* Navigation Buttons */}
      {needsScroller && (
        <Box
          sx={{
            display: "flex",
            gap: 1,
            justifyContent: "flex-start",
            width: "100%",
            padding: "8px 0",
          }}
        >
          <IconButton
            onClick={slideLeft}
            disabled={currentIndex === 0}
            sx={{
              color: "#02313b",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 1)",
              },
              "&.Mui-disabled": {
                backgroundColor: "rgba(0,0,0,0.1)",
              },
            }}
          >
            <ChevronLeft />
          </IconButton>

          <IconButton
            onClick={slideRight}
            disabled={currentIndex >= maxIndex}
            sx={{
              color: "#02313b",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 1)",
              },
              "&.Mui-disabled": {
                backgroundColor: "rgba(0,0,0,0.1)",
              },
            }}
          >
            <ChevronRight />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default Cards;
