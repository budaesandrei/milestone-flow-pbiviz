import * as React from "react";
import {
  CardActions,
  CardContent,
  CardHeader,
  Card as MuiCard,
  Chip,
  LinearProgress,
  linearProgressClasses,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { CardProps } from "../types";
import { ColorUtils } from "../utils/ColorUtils";

const Card: React.FC<CardProps> = (props: CardProps) => {
  const slices = props.settings?.statusStyles?.slices;
  const slice = slices?.find((s) => s.displayName === props.status);
  const bg = (slice as any)?.value?.value?.toString() ?? "#ebebeb";
  const textColor = ColorUtils.getTextColorForBg(bg);

  const progress = Number(Math.round(props.progress * 100)) || 0;
  const progressBarStyles = props.settings?.progressBarStyles;
  const highColor = progressBarStyles?.highColor?.value?.value ?? "#4caf50";
  const mediumColor = progressBarStyles?.mediumColor?.value?.value ?? "#ff9800";
  const lowColor = progressBarStyles?.lowColor?.value?.value ?? "#f44336";
  const mediumToHighThreshold =
    progressBarStyles?.mediumToHighThreshold?.value ?? 100;
  const lowToMediumThreshold =
    progressBarStyles?.lowToMediumThreshold?.value ?? 50;
  const cardBackgroundColor = props.settings?.general?.cardBackgroundColor?.value?.value ?? "#ffffff";

  const progressColor =
    progress >= mediumToHighThreshold
      ? highColor
      : progress >= lowToMediumThreshold
      ? mediumColor
      : lowColor;

  // Calculate responsive card size based on viewport height
  const baseCardSize = 248;
  const maxViewportHeight = 388;
  const minCardSize = 180; // Minimum reasonable card size

  const viewportHeight = props.viewport.height;
  const userScaleFactor =
    (props.settings?.general?.scaleFactor?.value ?? 50) / 50;

  const scaleFactor =
    viewportHeight > maxViewportHeight
      ? 1 * userScaleFactor
      : Math.max(
          viewportHeight / maxViewportHeight,
          minCardSize / baseCardSize
        ) * userScaleFactor;

  const cardSize = Math.round(baseCardSize * scaleFactor);

  return (
    <MuiCard
      variant="outlined"
      sx={{
        height: cardSize,
        width: cardSize,
        borderRadius: Math.round(6 * scaleFactor),
        p: Math.round(1 * scaleFactor),
        borderColor: "#d6d6d6",
        boxShadow: "0px 3px 3px 0px rgba(0, 0, 0, 0.1)",
        mb: Math.round(3 * scaleFactor),
        position: "relative",
        backgroundColor: cardBackgroundColor,
      }}
    >
      <CardContent
        sx={{
          gap: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <Typography
          sx={{
            color: "#606973",
            fontSize: Math.round(16 * scaleFactor),
            fontWeight: 600,
          }}
        >
          {`Milestone ${props.milestoneNumber}`}
        </Typography>
      </CardContent>
      <CardHeader
        title={props.milestoneName}
        subheader={props.dueDate}
        sx={{
          flex: 1,
          "& .MuiCardHeader-title": {
            color: "#02313b",
            fontSize: Math.round(20 * scaleFactor),
            fontWeight: 600,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          },
          "& .MuiCardHeader-subheader": {
            color: "#606973",
            fontSize: Math.round(14 * scaleFactor),
            fontWeight: 600,
          },
        }}
      />
      <CardActions
        sx={{
          position: "absolute",
          bottom: Math.round(8 * scaleFactor),
          left: Math.round(8 * scaleFactor),
          right: Math.round(8 * scaleFactor),
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          gap: Math.round(1.5 * scaleFactor),
        }}
      >
        {props.progress !== undefined && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: Math.round(1 * scaleFactor),
              ml: Math.round(1 * scaleFactor),
            }}
          >
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                width: Math.round(100 * scaleFactor),
                height: Math.round(10 * scaleFactor),
                backgroundColor: "#e0e0e0",
                borderRadius: Math.round(5 * scaleFactor),
                [`& .${linearProgressClasses.bar}`]: {
                  backgroundColor: progressColor,
                  borderRadius: Math.round(5 * scaleFactor),
                },
              }}
            />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: Math.round(14 * scaleFactor) }}
            >
              {`${progress}%`}
            </Typography>
          </Box>
        )}

        <Chip
          label={props.status}
          sx={{
            width: Math.round(120 * scaleFactor),
            height: Math.round(30 * scaleFactor),
            fontSize: Math.round(14 * scaleFactor),
            color: textColor,
            backgroundColor: bg,
            fontWeight: 500,
          }}
        />
      </CardActions>
    </MuiCard>
  );
};

export default Card;
