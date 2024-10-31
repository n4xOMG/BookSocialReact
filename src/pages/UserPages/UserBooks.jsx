import { Add, Book, Delete, Edit, ExpandMore } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BookIcon from "@mui/icons-material/Book";
import PeopleIcon from "@mui/icons-material/People";
import { Sidebar } from "../../components/HomePage/Sidebar";
const userBooks = [
  { id: 1, title: "The Great Adventure", views: 1200, chapters: 10 },
  { id: 2, title: "Mystery of the Lost Key", views: 800, chapters: 8 },
  { id: 3, title: "Coding Mastery", views: 1500, chapters: 15 },
];

const popularBooks = [
  { id: 1, title: "The Bestseller", author: "Jane Doe", rating: 4.8 },
  { id: 2, title: "Tech Revolution", author: "John Smith", rating: 4.7 },
  { id: 3, title: "Galactic Odyssey", author: "Alice Johnson", rating: 4.9 },
];

const bookViewsData = [
  { name: "Jan", views: 400 },
  { name: "Feb", views: 300 },
  { name: "Mar", views: 200 },
  { name: "Apr", views: 278 },
  { name: "May", views: 189 },
  { name: "Jun", views: 239 },
  { name: "Jul", views: 349 },
];
export default function UserBooks() {
  const [activeBook, setActiveBook] = useState(userBooks[0]);
  const [chapters, setChapters] = useState([
    { id: 1, title: "Introduction" },
    { id: 2, title: "Getting Started" },
    { id: 3, title: "Advanced Techniques" },
  ]);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);

  const addChapter = () => {
    const newChapter = { id: chapters.length + 1, title: `New Chapter ${chapters.length + 1}` };
    setChapters([...chapters, newChapter]);
  };

  const deleteChapter = (id) => {
    setChapters(chapters.filter((chapter) => chapter.id !== id));
  };

  const openMenu = (event, chapter) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedChapter(chapter);
  };

  const closeMenu = () => {
    setMenuAnchorEl(null);
    setSelectedChapter(null);
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", overscrollBehavior: "contain" }}>
      <Sidebar />
      <Box sx={{ maxWidth: 1200, mx: "auto", p: 4 }}>
        <Typography variant="h4" fontWeight="bold" mb={4}>
          Book Management Dashboard
        </Typography>

        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", mb: 4 }}>
          <Card>
            <CardHeader
              title="Total Books"
              action={
                <Avatar>
                  <Book />
                </Avatar>
              }
            />
            <CardContent>
              <Typography variant="h4">{userBooks.length}</Typography>
            </CardContent>
          </Card>
          <Card>
            <CardHeader title="Total Views" action={<VisibilityIcon />} />
            <CardContent>
              <Typography variant="h4">{userBooks.reduce((sum, book) => sum + book.views, 0)}</Typography>
            </CardContent>
          </Card>
          <Card>
            <CardHeader title="Avg. Chapters" action={<BookIcon />} />
            <CardContent>
              <Typography variant="h4">{Math.round(userBooks.reduce((sum, book) => sum + book.chapters, 0) / userBooks.length)}</Typography>
            </CardContent>
          </Card>
          <Card>
            <CardHeader title="Active Readers" action={<PeopleIcon />} />
            <CardContent>
              <Typography variant="h4">573</Typography>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: "2fr 1fr" }}>
          <Card>
            <CardHeader title="Book Views Overview" />
            <CardContent>{/* Add chart component here */}</CardContent>
          </Card>
          <Card>
            <CardHeader title="Popular Books" subheader="Top rated books this month" />
            <CardContent>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Title</TableCell>
                      <TableCell>Author</TableCell>
                      <TableCell align="right">Rating</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {popularBooks.map((book) => (
                      <TableRow key={book.id}>
                        <TableCell>{book.title}</TableCell>
                        <TableCell>{book.author}</TableCell>
                        <TableCell align="right">{book.rating}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Box>

        <Card sx={{ mt: 4 }}>
          <CardHeader title="Manage Your Books" subheader="View and edit your book chapters" />
          <CardContent>
            <Tabs
              value={activeBook.id}
              onChange={(e, newValue) => setActiveBook(userBooks.find((book) => book.id === newValue))}
              indicatorColor="primary"
              textColor="primary"
              sx={{ mb: 2 }}
            >
              {userBooks.map((book) => (
                <Tab key={book.id} label={book.title} value={book.id} />
              ))}
            </Tabs>
            <Box>
              <Typography variant="h6" fontWeight="medium">
                {activeBook.title} - Chapters
              </Typography>
              <Button onClick={addChapter} startIcon={<Add />} variant="contained" color="primary" sx={{ my: 2 }}>
                Add Chapter
              </Button>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Chapter</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {chapters.map((chapter) => (
                      <TableRow key={chapter.id}>
                        <TableCell>{chapter.title}</TableCell>
                        <TableCell align="right">
                          <IconButton onClick={(e) => openMenu(e, chapter)}>
                            <ExpandMore />
                          </IconButton>
                          <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl && selectedChapter === chapter)} onClose={closeMenu}>
                            <MenuItem
                              onClick={() => {
                                /* Add edit logic */
                              }}
                            >
                              <Edit fontSize="small" /> Edit
                            </MenuItem>
                            <MenuItem onClick={() => deleteChapter(chapter.id)}>
                              <Delete fontSize="small" /> Delete
                            </MenuItem>
                          </Menu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
