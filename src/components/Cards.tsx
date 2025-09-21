import React from "react";
import Card from "./Card";
import Box from "@mui/material/Box";
import { Forward as Arrow} from "@mui/icons-material";

const Cards: React.FC<{ dataViews; settings }> = (props: {
  dataViews;
  settings;
}) => {
  const rows = props.dataViews[0].table.rows;
  const cols = props.dataViews[0].table.columns.map(
    (col) => Object.keys(col.roles)[0]
  );
  const data = rows.map((row) => {
    const obj = {};
    cols.forEach((col, index) => {
      let value = row[index];
      // Convert date format if it's a dueDate field
      if (col === 'dueDate' && value) {
        const date = new Date(value);
        value = date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: '2-digit'
        });
      }
      obj[col] = value;
    });
    return obj;
  });

  console.log(data);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, overflowX: 'auto', overflowY: 'hidden' }}>
      {!!data &&
        data.map((r, index) => (
          <React.Fragment key={index}>
            <Card
              settings={props.settings}
              milestoneName={r.milestoneName}
              milestoneNumber={r.milestoneNumber}
              dueDate={r.dueDate}
              status={r.status}
            />
            {index < data.length - 1 && (
              <Arrow
                sx={{
                  fontSize: 32,
                  color: r.status?.toLowerCase() === 'completed' ? '#00b5ae' : '#ccc',
                  flexShrink: 0,
                }}
              />
            )}
          </React.Fragment>
        ))}
    </Box>
  );
};

export default Cards;
