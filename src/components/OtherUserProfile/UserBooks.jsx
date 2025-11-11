import { Card, CardActionArea, CardContent, CardMedia, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const UserBooks = ({ books }) => {
  const navigate = useNavigate();
  const hasBooks = Array.isArray(books) && books.length > 0;

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Books
        </Typography>
        {hasBooks ? (
          <Grid container spacing={2}>
            {books.map((book) => (
              <Grid item xs={6} sm={4} key={book.id}>
                <Card>
                  <CardActionArea onClick={() => navigate(`/books/${book.id}`)}>
                    <CardMedia component="img" height="140" image={book.bookCover} alt={book.title} />
                    <Typography variant="subtitle1" align="center" sx={{ px: 1, py: 1 }}>
                      {book.title}
                    </Typography>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No books to display yet.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default UserBooks;
