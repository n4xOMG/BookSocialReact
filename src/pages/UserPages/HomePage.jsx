import { Box } from "@mui/material";
import React, { useState } from "react";
import { Sidebar } from "../../components/HomePage/Sidebar";
import { Header } from "../../components/HomePage/Header";
import { MainTabs } from "../../components/HomePage/MainTabs";

export default function HomePage() {
  const [books, setBooks] = useState([
    {
      id: 1,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      content:
        "Just finished 'The Great Gatsby' and I'm in awe of Fitzgerald's prose! The way he captures the decadence and hollow pursuit of the American Dream in the 1920s is masterful. This quote really stuck with me: 'In my younger and more vulnerable years my father gave me some advice that I've been turning over in my mind ever since.'",
      likes: 42,
      comments: 15,
      shares: 7,
      image: "https://g-m5ylkkul1dt.vusercontent.nethttps://g-m5ylkkul1dt.vusercontent.net/placeholder.svg?height=300&width=200",
      rating: 4.5,
      progress: 100,
      genre: "Classic",
      userImage: "https://g-m5ylkkul1dt.vusercontent.nethttps://g-m5ylkkul1dt.vusercontent.net/placeholder.svg?height=300&width=200",
      userName: "LiteraryExplorer",
      postTime: "2 hours ago",
    },
    {
      id: 2,
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      content:
        "Re-reading 'To Kill a Mockingbird' for the umpteenth time, and it never fails to move me. Harper Lee's exploration of racial injustice and loss of innocence is as relevant today as it was when first published. This line always gives me chills: 'Mockingbirds don't do one thing but make music for us to enjoy. They don't eat up people's gardens, don't nest in corncribs, they don't do one thing but sing their hearts out for us.'",
      likes: 57,
      comments: 23,
      shares: 12,
      image: "/placeholder.svg?height=400&width=300",
      rating: 5,
      progress: 75,
      genre: "Fiction",
      userImage: "https://g-m5ylkkul1dt.vusercontent.nethttps://g-m5ylkkul1dt.vusercontent.net/placeholder.svg?height=300&width=200",
      userName: "ClassicBookworm",
      postTime: "1 day ago",
    },
  ]);

  const [notifications, setNotifications] = useState([
    { id: 1, content: "Jane Doe liked your review of 'Pride and Prejudice'", time: "2 hours ago" },
    { id: 2, content: "New comment on your 'The Catcher in the Rye' post", time: "5 hours ago" },
    { id: 3, content: "Book club meeting reminder: 'Dune' discussion tonight", time: "1 day ago" },
  ]);

  const [messages, setMessages] = useState([
    { id: 1, sender: "Alice", content: "Have you read the new Stephen King?", time: "10:30 AM" },
    { id: 2, sender: "Bob", content: "What did you think of the ending of 1984?", time: "Yesterday" },
    { id: 3, sender: "Carol", content: "Can you recommend a good sci-fi novel?", time: "2 days ago" },
  ]);

  const [featuredBooks, setFeaturedBooks] = useState([
    {
      id: 1,
      title: "The Midnight Library",
      author: "Matt Haig",
      image: "https://g-m5ylkkul1dt.vusercontent.net/placeholder.svg?height=300&width=200",
      rating: 4.8,
    },
    {
      id: 2,
      title: "Klara and the Sun",
      author: "Kazuo Ishiguro",
      image: "https://g-m5ylkkul1dt.vusercontent.net/placeholder.svg?height=300&width=200",
      rating: 4.6,
    },
    {
      id: 3,
      title: "The Vanishing Half",
      author: "Brit Bennett",
      image: "https://g-m5ylkkul1dt.vusercontent.net/placeholder.svg?height=300&width=200",
      rating: 4.7,
    },
    {
      id: 4,
      title: "The Four Winds",
      author: "Kristin Hannah",
      image: "https://g-m5ylkkul1dt.vusercontent.net/placeholder.svg?height=300&width=200",
      rating: 4.5,
    },
    {
      id: 5,
      title: "Project Hail Mary",
      author: "Andy Weir",
      image: "https://g-m5ylkkul1dt.vusercontent.net/placeholder.svg?height=300&width=200",
      rating: 4.9,
    },
  ]);

  const [popularBooks, setPopularBooks] = useState([
    {
      id: 1,
      title: "Atomic Habits",
      author: "James Clear",
      image: "https://g-m5ylkkul1dt.vusercontent.net/placeholder.svg?height=300&width=200",
      rating: 4.9,
    },
    {
      id: 2,
      title: "Where the Crawdads Sing",
      author: "Delia Owens",
      image: "https://g-m5ylkkul1dt.vusercontent.net/placeholder.svg?height=300&width=200",
      rating: 4.7,
    },
    {
      id: 3,
      title: "The Silent Patient",
      author: "Alex Michaelides",
      image: "https://g-m5ylkkul1dt.vusercontent.net/placeholder.svg?height=300&width=200",
      rating: 4.5,
    },
    {
      id: 4,
      title: "The Invisible Life of Addie LaRue",
      author: "V.E. Schwab",
      image: "https://g-m5ylkkul1dt.vusercontent.net/placeholder.svg?height=300&width=200",
      rating: 4.3,
    },
    {
      id: 5,
      title: "The Seven Husbands of Evelyn Hugo",
      author: "Taylor Jenkins Reid",
      image: "https://g-m5ylkkul1dt.vusercontent.net/placeholder.svg?height=300&width=200",
      rating: 4.6,
    },
  ]);

  const [categorizedBooks, setCategorizedBooks] = useState([
    {
      category: "Science Fiction",
      books: [
        {
          id: 1,
          title: "Dune",
          author: "Frank Herbert",
          image: "https://g-m5ylkkul1dt.vusercontent.net/placeholder.svg?height=300&width=200",
          rating: 4.7,
        },
        {
          id: 2,
          title: "The Hitchhiker's Guide to the Galaxy",
          author: "Douglas Adams",
          image: "https://g-m5ylkkul1dt.vusercontent.net/placeholder.svg?height=300&width=200",
          rating: 4.5,
        },
        {
          id: 3,
          title: "Neuromancer",
          author: "William Gibson",
          image: "https://g-m5ylkkul1dt.vusercontent.net/placeholder.svg?height=300&width=200",
          rating: 4.3,
        },
        {
          id: 4,
          title: "The Martian",
          author: "Andy Weir",
          image: "https://g-m5ylkkul1dt.vusercontent.net/placeholder.svg?height=300&width=200",
          rating: 4.6,
        },
        {
          id: 5,
          title: "1984",
          author: "George Orwell",
          image: "https://g-m5ylkkul1dt.vusercontent.net/placeholder.svg?height=300&width=200",
          rating: 4.8,
        },
      ],
    },
    {
      category: "Mystery",
      books: [
        {
          id: 1,
          title: "The Girl with the Dragon Tattoo",
          author: "Stieg Larsson",
          image: "https://g-m5ylkkul1dt.vusercontent.net/placeholder.svg?height=300&width=200",
          rating: 4.1,
        },
        {
          id: 2,
          title: "Gone Girl",
          author: "Gillian Flynn",
          image: "https://g-m5ylkkul1dt.vusercontent.net/placeholder.svg?height=300&width=200",
          rating: 4.0,
        },
        {
          id: 3,
          title: "The Da Vinci Code",
          author: "Dan Brown",
          image: "https://g-m5ylkkul1dt.vusercontent.net/placeholder.svg?height=300&width=200",
          rating: 3.8,
        },
        {
          id: 4,
          title: "And Then There Were None",
          author: "Agatha Christie",
          image: "https://g-m5ylkkul1dt.vusercontent.net/placeholder.svg?height=300&width=200",
          rating: 4.7,
        },
        {
          id: 5,
          title: "The Girl on the Train",
          author: "Paula Hawkins",
          image: "https://g-m5ylkkul1dt.vusercontent.net/placeholder.svg?height=300&width=200",
          rating: 3.9,
        },
      ],
    },
    {
      category: "Fantasy",
      books: [
        {
          id: 1,
          title: "The Name of the Wind",
          author: "Patrick Rothfuss",
          image: "https://g-m5ylkkul1dt.vusercontent.net/placeholder.svg?height=300&width=200",
          rating: 4.6,
        },
        {
          id: 2,
          title: "The Way of Kings",
          author: "Brandon Sanderson",
          image: "https://g-m5ylkkul1dt.vusercontent.net/placeholder.svg?height=300&width=200",
          rating: 4.8,
        },
        {
          id: 3,
          title: "A Game of Thrones",
          author: "George R.R. Martin",
          image: "https://g-m5ylkkul1dt.vusercontent.net/placeholder.svg?height=300&width=200",
          rating: 4.4,
        },
        {
          id: 4,
          title: "The Hobbit",
          author: "J.R.R. Tolkien",
          image: "https://g-m5ylkkul1dt.vusercontent.net/placeholder.svg?height=300&width=200",
          rating: 4.7,
        },
        {
          id: 5,
          title: "Mistborn: The Final Empire",
          author: "Brandon Sanderson",
          image: "https://g-m5ylkkul1dt.vusercontent.net/placeholder.svg?height=300&width=200",
          rating: 4.5,
        },
      ],
    },
  ]);

  return (
    <Box sx={{ display: "flex", height: "100vh", overscrollBehavior: "contain" }}>
      <Sidebar />
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Header />
        <Box component="main" sx={{ flex: 1, overflow: "auto", p: 3 }}>
          <MainTabs featuredBooks={featuredBooks} popularBooks={popularBooks} categorizedBooks={categorizedBooks} />
        </Box>
      </Box>
    </Box>
  );
}
