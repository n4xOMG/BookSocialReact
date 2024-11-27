import { Favorite, Star } from "@mui/icons-material";
import { Box, Button, Card, CardActions, CardContent, CardMedia, Chip, Typography } from "@mui/material";
import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { isFavouredByReqUser } from "../../utils/isFavouredByReqUser";
import { followBookAction } from "../../redux/book/book.action";

export function BookCard({ book, categories, tags, checkAuth }) {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const [isFollowed, setIsFollowed] = useState(user ? isFavouredByReqUser(user, book) : false);
  const dispatch = useDispatch();
  const getCategoryById = (categoryId) => {
    return categories.find((category) => categoryId === category.id);
  };

  const getTagsByIds = (tagIds) => {
    return tags.filter((tag) => tagIds.includes(tag.id));
  };

  const category = getCategoryById(book.categoryId);
  const bookTags = getTagsByIds(book.tagIds);
  const handleFollowBook = useCallback(
    checkAuth(async () => {
      try {
        setTimeout(() => {
          dispatch(followBookAction(book.id));
          setIsFollowed((prev) => !prev);
        }, 300);
      } catch (e) {
        console.log("Error follow book: ", e);
      }
    }),
    [dispatch, isFollowed]
  );
  return (
    <Card sx={{ width: 300, overflow: "hidden", m: 2 }}>
      <Box sx={{ position: "relative", height: 400 }} onClick={() => navigate(`/books/${book.id}`)}>
        <CardMedia
          component="img"
          image={book.bookCover}
          alt={`Cover of ${book.title}`}
          sx={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Box>
      <CardContent sx={{ p: 4, textAlign: "left" }}>
        <Typography variant="h6" component="h2" sx={{ fontWeight: "bold", mb: 2 }} onClick={() => navigate(`/books/${book.id}`)}>
          {book.title}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "black", mb: 2, cursor: "pointer" }}
          onClick={() => navigate(`/profile/${book.author.id}`)}
        >
          by <strong>{book.authorName}</strong>
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Star sx={{ width: 20, height: 20, color: "#faaf00", mr: 1 }} />
          <Typography variant="body2">{book.avgRating ? book.avgRating.toFixed(1) : 5.0}</Typography>
        </Box>
        {category && (
          <Typography variant="body2" sx={{ color: "gray", mb: 2 }}>
            Category: {category.name}
          </Typography>
        )}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
          {bookTags.map((tag) => (
            <Chip key={tag.id} label={tag.name} size="small" sx={{ bgcolor: "#f6f6f7", color: "black" }} />
          ))}
        </Box>
      </CardContent>
      <CardActions sx={{ p: 4 }}>
        <Button variant="outlined" size="large" sx={{ width: "100%", color: isFollowed ? "red" : "gray" }} onClick={handleFollowBook}>
          <Favorite sx={{ width: 20, height: 20, fill: isFollowed ? "red" : "gray" }} />
          <Typography variant="body2" sx={{ ml: 1 }}>
            {isFollowed ? "Remove from favorites" : "Add to favorites"}
          </Typography>
        </Button>
      </CardActions>
    </Card>
  );
}
