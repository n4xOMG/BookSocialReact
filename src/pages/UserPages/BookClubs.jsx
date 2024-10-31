import { Favorite, Message, Share, Star } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Input,
  MenuItem,
  Select,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { Sidebar } from "../../components/HomePage/Sidebar";

const initialPosts = [
  {
    id: 1,
    userAvatar: "/placeholder.svg?height=40&width=40",
    userName: "Alice Johnson",
    bookCover: "/placeholder.svg?height=200&width=150",
    bookTitle: "The Midnight Library",
    author: "Matt Haig",
    description:
      "Between life and death there is a library. When Nora Seed finds herself in the Midnight Library, she has a chance to make things right...",
    userCaption: "This book really made me think about the choices we make in life. Highly recommend!",
    likes: 152,
    comments: 23,
    rating: 4,
    readingStatus: "Read",
  },
  {
    id: 2,
    userAvatar: "/placeholder.svg?height=40&width=40",
    userName: "Bob Smith",
    bookCover: "/placeholder.svg?height=200&width=150",
    bookTitle: "Atomic Habits",
    author: "James Clear",
    description:
      "No matter your goals, Atomic Habits offers a proven framework for improving--every day. James Clear, one of the world's leading experts on habit formation...",
    userCaption: "Just started this one. The concept of 1% improvements is really motivating!",
    likes: 98,
    comments: 15,
    rating: 5,
    readingStatus: "Currently Reading",
  },
];

export default function BookClubs() {
  const [posts, setPosts] = useState(initialPosts);
  const [newPost, setNewPost] = useState({
    bookTitle: "",
    author: "",
    description: "",
    userCaption: "",
    rating: 0,
    readingStatus: "Want to Read",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleLike = (id) => {
    setPosts(posts.map((post) => (post.id === id ? { ...post, likes: post.likes + 1 } : post)));
  };

  const handleNewPost = (e) => {
    e.preventDefault();
    const newId = Math.max(...posts.map((p) => p.id), 0) + 1;
    setPosts([
      {
        id: newId,
        userAvatar: "/placeholder.svg",
        userName: "Current User",
        bookCover: "/placeholder.svg",
        likes: 0,
        comments: 0,
        ...newPost,
      },
      ...posts,
    ]);
    setNewPost({
      bookTitle: "",
      author: "",
      description: "",
      userCaption: "",
      rating: 0,
      readingStatus: "Want to Read",
    });
    setIsDialogOpen(false);
  };

  return (
    <Box sx={{ display: "flex", overscrollBehavior: "contain" }}>
      <Sidebar />
      <Box sx={{ width: "100%", mx: "auto", p: 3, gap: 3 }}>
        <Card sx={{ mb: 3 }}>
          <CardHeader
            avatar={<Avatar src="/placeholder.svg" alt="Current User" />}
            title={
              <Button variant="outlined" onClick={() => setIsDialogOpen(true)}>
                What are you reading?
              </Button>
            }
          />
        </Card>

        <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
          <DialogTitle>Create Post</DialogTitle>
          <DialogContent>
            <Box component="form" onSubmit={handleNewPost} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextareaAutosize
                placeholder="Share your thoughts..."
                value={newPost.userCaption}
                onChange={(e) => setNewPost({ ...newPost, userCaption: e.target.value })}
                required
              />
              <Input
                placeholder="Book Title"
                value={newPost.bookTitle}
                onChange={(e) => setNewPost({ ...newPost, bookTitle: e.target.value })}
                required
              />
              <Input
                placeholder="Author"
                value={newPost.author}
                onChange={(e) => setNewPost({ ...newPost, author: e.target.value })}
                required
              />
              <TextareaAutosize
                placeholder="Book Description"
                value={newPost.description}
                onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
                required
              />
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Select
                  value={newPost.readingStatus ? newPost.readingStatus : "willread"}
                  onChange={(e) => setNewPost({ ...newPost, readingStatus: e.target.value })}
                  style={{ padding: "8px", borderRadius: "4px" }}
                >
                  <MenuItem value="willread">Will Read</MenuItem>
                  <MenuItem value="currentlyreading">Currently Reading</MenuItem>
                  <MenuItem value="finished">Finished</MenuItem>
                  <MenuItem value="rereading">Re-reading</MenuItem>
                </Select>
                <Box sx={{ display: "flex", gap: 1 }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      sx={{ cursor: "pointer", color: star <= newPost.rating ? "gold" : "grey" }}
                      onClick={() => setNewPost({ ...newPost, rating: star })}
                    />
                  ))}
                </Box>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button type="submit" onClick={handleNewPost}>
              Post
            </Button>
          </DialogActions>
        </Dialog>

        {posts.map((post) => (
          <Card key={post.id} sx={{ mb: 3 }}>
            <CardHeader
              avatar={<Avatar src={post.userAvatar} alt={post.userName} />}
              title={<Typography variant="h6">{post.userName}</Typography>}
              subheader={post.readingStatus}
            />
            <CardContent sx={{ display: "flex", gap: 2 }}>
              <Box component="img" src={post.bookCover} alt={post.bookTitle} sx={{ width: 100, height: 150, objectFit: "cover" }} />
              <Box>
                <Typography variant="h6">{post.bookTitle}</Typography>
                <Typography variant="body2" color="text.secondary">
                  by {post.author}
                </Typography>
                <Box sx={{ display: "flex", gap: 0.5, mt: 1 }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} sx={{ color: star <= post.rating ? "gold" : "grey" }} />
                  ))}
                </Box>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {post.description}
                </Typography>
                <Typography variant="body2" sx={{ fontStyle: "italic", mt: 1 }}>
                  “{post.userCaption}”
                </Typography>
              </Box>
            </CardContent>
            <Box sx={{ display: "flex", justifyContent: "space-between", p: 2 }}>
              <IconButton onClick={() => handleLike(post.id)}>
                <Favorite /> {post.likes}
              </IconButton>
              <IconButton>
                <Message /> {post.comments}
              </IconButton>
              <IconButton>
                <Share />
              </IconButton>
            </Box>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
