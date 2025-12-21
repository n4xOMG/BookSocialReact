import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardActionArea,
  CardMedia,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Popper,
  Typography,
  CircularProgress,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { searchBookAction } from "../../redux/book/book.action";
import { debounce } from "lodash";

const SearchDropdown = ({ anchorEl, searchQuery, onClose }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Debounced search function
  const debouncedSearch = React.useCallback(
    debounce(async (query) => {
      if (!query || query.length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.append("title", query);
        params.append("size", 5); // Limit results for dropdown

        const response = await dispatch(searchBookAction(params, true));
        if (response?.payload?.content) {
          setResults(response.payload.content);
        } else if (Array.isArray(response?.payload)) {
          setResults(response.payload);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300),
    [dispatch]
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  const handleBookClick = (bookId) => {
    navigate(`/books/${bookId}`);
    onClose();
  };

  if (!searchQuery || searchQuery.length < 2) return null;

  const open = Boolean(anchorEl) && searchQuery.length >= 2;

  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      placement="bottom-start"
      style={{ width: anchorEl?.offsetWidth, zIndex: 1300 }}
      modifiers={[
        {
          name: "offset",
          options: {
            offset: [0, 8],
          },
        },
      ]}
    >
      <Paper
        elevation={4}
        sx={{
          width: "100%",
          maxHeight: 400,
          overflow: "auto",
          mt: 0.5,
          borderRadius: 1,
        }}
      >
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : results.length > 0 ? (
          <List sx={{ p: 0 }}>
            {results.map((book) => (
              <ListItem
                key={book.id}
                disablePadding
                component={CardActionArea}
                onClick={() => handleBookClick(book.id)}
                sx={{
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                  borderBottom: "1px solid",
                  borderColor: "divider",
                  "&:last-child": {
                    borderBottom: "none",
                  },
                }}
              >
                <Box sx={{ display: "flex", width: "100%", p: 1 }}>
                  <ListItemAvatar sx={{ minWidth: 60, mr: 1 }}>
                    <CardMedia
                      component="img"
                      image={book.bookCover.url || "https://via.placeholder.com/60x80?text=No+Cover"}
                      alt={book.title}
                      sx={{ width: 50, height: 70, objectFit: "cover", borderRadius: 1 }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="body1" noWrap>
                        {book.title}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography variant="caption" color="text.secondary" component="span">
                          {book.authorName || "Unknown author"}
                        </Typography>
                        <br />
                        <Typography variant="caption" color="text.secondary" component="span">
                          Chapters: {book.chapterCount || 0} • Rating: {book.avgRating?.toFixed(1) || "No ratings"}
                        </Typography>
                      </>
                    }
                  />
                </Box>
              </ListItem>
            ))}
          </List>
        ) : (
          <Box sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              No books found
            </Typography>
          </Box>
        )}

        {results.length > 0 && (
          <Box
            sx={{
              p: 1,
              textAlign: "center",
              borderTop: "1px solid",
              borderColor: "divider",
              bgcolor: "action.hover",
            }}
          >
            <Typography
              variant="body2"
              color="primary"
              component={CardActionArea}
              onClick={() => {
                const params = new URLSearchParams();
                params.append("title", searchQuery);
                navigate(`/search-results?${params}`);
                onClose();
              }}
              sx={{ py: 0.5 }}
            >
              View all results
            </Typography>
          </Box>
        )}
      </Paper>
    </Popper>
  );
};

export default SearchDropdown;
