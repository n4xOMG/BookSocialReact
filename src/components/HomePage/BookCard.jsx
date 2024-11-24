import { Favorite, Share } from "@mui/icons-material";
import { Button, Card, CardActions, CardContent, CardMedia, IconButton, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

export function BookCard({ book }) {
  const navigate = useNavigate();
  return (
    <Card
      sx={{
        width: 300,
        height: 450,
        bgcolor: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
        borderRadius: "16px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "transform 0.3s",
        "&:hover": {
          transform: "scale(1.05)",
        },
      }}
      onClick={() => navigate(`/books/${book.id}`)}
    >
      <CardMedia
        component="img"
        height="250"
        image={book.bookCover}
        alt={book.title}
        sx={{
          objectFit: "cover",
          width: "100%",
          height: "250px",
        }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div" sx={{ color: "black" }}>
          {book.title}
        </Typography>
        <Typography variant="body2" sx={{ color: "gray" }}>
          {book.authorName}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" variant="contained" color="primary">
          Read More
        </Button>
        <IconButton aria-label="add to favorites">
          <Favorite sx={{ color: "red" }} />
        </IconButton>
        <IconButton aria-label="share">
          <Share sx={{ color: "black" }} />
        </IconButton>
      </CardActions>
    </Card>
  );
}
