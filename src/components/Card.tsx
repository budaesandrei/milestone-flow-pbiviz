import * as React from "react";
import {
  CardActions,
  CardContent,
  CardHeader,
  Card as MuiCard,
  Chip,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import { CardProps, StatusKey } from "../types";
import { ColorUtils } from "../utils/ColorUtils";

const Card: React.FC<CardProps> = (props: CardProps) => {
  const statusBg = ColorUtils.getStatusBgMap(props.settings);
  const statusText = ColorUtils.getStatusTextMap(props.settings);
  const key = (props.status ?? "")
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") as StatusKey;
  const bg = statusBg[key];
  const textColor = statusText[key];

  return (
    <MuiCard
      variant="outlined"
      sx={{
        height: 220,
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
        }}
      >
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
