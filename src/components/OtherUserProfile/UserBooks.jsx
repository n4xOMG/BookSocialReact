import React from "react";
import { Card, CardContent, Typography, Grid, CardMedia, CardActionArea } from "@mui/material";
import { useNavigate } from "react-router-dom";

const UserBooks = ({ books }) => {
  const navigate = useNavigate();
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Books
        </Typography>
        <Grid container spacing={2}>
          {books.map((book) => (
            <Grid item xs={6} sm={4} key={book.id}>
              <Card>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="140"
                    image={book.bookCover}
                    alt={book.title}
                    onClick={() => navigate(`/books/${book.id}`)}
                  />
                  <Typography variant="subtitle1" align="center">
                    {book.title}
                  </Typography>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default UserBooks;
