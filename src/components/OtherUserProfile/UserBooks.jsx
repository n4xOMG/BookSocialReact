import { Box, Card, CardActionArea, CardContent, CardMedia, Grid, Tooltip, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";

const UserBooks = ({ books }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const hasBooks = Array.isArray(books) && books.length > 0;

  return (
    <Card
      sx={{
        borderRadius: "20px",
        background: theme.palette.mode === "dark" ? "rgba(18, 18, 30, 0.7)" : "rgba(255, 255, 255, 0.7)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid",
        borderColor: theme.palette.mode === "dark" ? "rgba(157, 80, 187, 0.2)" : "rgba(157, 80, 187, 0.15)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            fontFamily: '"Playfair Display", serif',
            fontWeight: 700,
            background: "linear-gradient(135deg, #9d50bb, #6e48aa)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            mb: 2,
          }}
        >
          Books
        </Typography>
        {hasBooks ? (
          <Grid container spacing={2}>
            {books.map((book) => (
              <Grid item xs={6} sm={4} key={book.id}>
                <Card
                  sx={{
                    borderRadius: "16px",
                    background: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.5)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid",
                    borderColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 24px rgba(157, 80, 187, 0.3)",
                      borderColor: theme.palette.mode === "dark" ? "rgba(157, 80, 187, 0.4)" : "rgba(157, 80, 187, 0.3)",
                    },
                  }}
                >
                  <CardActionArea onClick={() => navigate(`/books/${book.id}`)}>
                    <CardMedia
                      component="img"
                      height="140"
                      image={book.bookCover.url}
                      alt={book.title}
                      sx={{
                        borderRadius: "16px 16px 0 0",
                      }}
                    />
                    <Box 
                        sx={{ 
                            height: 70, 
                            px: 1, 
                            display: 'flex', 
                            alignItems: 'flex-start',
                            justifyContent: 'center',
                        }}
                    >
                      <Tooltip title={book.title} placement="bottom">
                        <Typography
                          variant="subtitle1"
                          align="center"
                          sx={{
                            fontWeight: 600,
                            color: theme.palette.mode === "dark" ? "#fff" : "#1a1a2e",
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2, 
                            WebkitBoxOrient: 'vertical',
                            whiteSpace: 'normal',
                          }}
                        >
                          {book.title}
                        </Typography>
                      </Tooltip>
                    </Box>
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
