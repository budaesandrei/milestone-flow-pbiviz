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
  const containerRef = useRef<HTMLDivElement>(null);
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

  // Check if cards extend beyond viewport
  useEffect(() => {
    const checkViewport = () => {
      if (containerRef.current && dataSorted.length > 0) {
        const containerWidth = containerRef.current.clientWidth;
        const cardWidth = 248 + 8 + 32 + 8; // card width + gap + arrow + gap
        const totalWidth = dataSorted.length * cardWidth;

        if (totalWidth > containerWidth) {
          setNeedsScroller(true);
          const visibleCards = Math.floor(containerWidth / cardWidth);
          setMaxIndex(Math.max(0, dataSorted.length - visibleCards));
        } else {
          setNeedsScroller(false);
          setMaxIndex(0);
        }
      }
    };

    checkViewport();
    window.addEventListener("resize", checkViewport);
    return () => window.removeEventListener("resize", checkViewport);
  }, [dataSorted]);

  const slideLeft = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const slideRight = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const getTransformValue = () => {
    const cardWidth = 248 + 8 + 32 + 8; // card width + gap + arrow + gap
    return `translateX(-${currentIndex * cardWidth}px)`;
  };

  return (
    <Box sx={{ position: "relative" }}>
      <Box
        ref={containerRef}
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
