import { Star } from "@mui/icons-material";
import { Box, Button, Card, CardActions, CardContent, Typography } from "@mui/material";

export const BookGrid = ({ books }) => (
  <Box sx={{ textAlign: "left", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 3 }}>
    {books.map((book) => (
      <Card key={book.id} sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <CardContent sx={{ flexGrow: 1 }}>
          <Box component="img" src={book.image} alt={book.title} sx={{ width: "100%", height: 180, objectFit: "cover", borderRadius: 1 }} />
          <Typography variant="h6" gutterBottom noWrap>
            {book.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {book.author}
          </Typography>
          <Box display="flex" alignItems="center" mt={1}>
            <Star fontSize="small" />
            <Typography variant="body2" ml={0.5}>
              {book.rating}
            </Typography>
          </Box>
        </CardContent>
        <CardActions>
          <Button fullWidth variant="contained">
            Add to Library
          </Button>
        </CardActions>
      </Card>
    ))}
  </Box>
);
