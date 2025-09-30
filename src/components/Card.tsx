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

  const progressColor =
    progress >= mediumToHighThreshold
      ? highColor
      : progress >= lowToMediumThreshold
      ? mediumColor
      : lowColor;

  return (
    <MuiCard
      variant="outlined"
      sx={{
        height: 248,
        width: 248,
        borderRadius: 6,
        p: 1,
        borderColor: "#d6d6d6",
        boxShadow: "0px 3px 3px 0px rgba(0, 0, 0, 0.1)",
        mb: 3,
        position: "relative",
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
            fontSize: 16,
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
            fontSize: 20,
            fontWeight: 600,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          },
          "& .MuiCardHeader-subheader": {
            color: "#606973",
            fontSize: 14,
            fontWeight: 600,
          },
        }}
      />
      <CardActions
        sx={{
          position: "absolute",
          bottom: 8,
          left: 8,
          right: 8,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, ml: 1 }}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              width: 100,
              height: 10,
              backgroundColor: "#e0e0e0",
              borderRadius: 5,
              [`& .${linearProgressClasses.bar}`]: {
                backgroundColor: progressColor,
                borderRadius: 5,
              },
            }}
          />
          <Typography variant="body2" color="text.secondary">
            {`${progress}%`}
          </Typography>
        </Box>
        <Chip
          label={props.status}
          sx={{
            width: 100,
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
