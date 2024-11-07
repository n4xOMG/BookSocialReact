import { Box } from "@mui/material";
import React, { useEffect } from "react";
import { Header } from "../../components/HomePage/Header";
import { MainContent } from "../../components/HomePage/MainContent";
import { Sidebar } from "../../components/HomePage/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { getBooksByCategories, getCategories } from "../../redux/category/category.action";

export default function HomePage() {
  const dispatch = useDispatch();
  const { categories, booksByCategory, loading, error } = useSelector((state) => state.category);

  useEffect(() => {
    const fetchCategoriesAndBooks = async () => {
      await dispatch(getCategories());
      const categoryIds = categories.map((category) => category.id);
      dispatch(getBooksByCategories(categoryIds));
    };

    fetchCategoriesAndBooks();
  }, [dispatch]);
  const featuredBooks = [
    {
      id: 1,
      title: "The Midnight Library",
      author: "Matt Haig",
      cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&auto=format&fit=crop&q=60",
      rating: 4,
      reviews: 4231,
    },
    {
      id: 2,
      title: "The Seven Husbands of Evelyn Hugo",
      author: "Taylor Jenkins Reid",
      cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=60",
      rating: 5,
      reviews: 3892,
    },
    {
      id: 3,
      title: "Tomorrow, and Tomorrow, and Tomorrow",
      author: "Gabrielle Zevin",
      cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=800&auto=format&fit=crop&q=60",
      rating: 4,
      reviews: 2789,
    },
  ];
  const booksByCategory2 = {
    Fiction: [
      {
        id: 1,
        title: "Cloud Cuckoo Land",
        author: "Anthony Doerr",
        cover: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=800&auto=format&fit=crop&q=60",
      },
      {
        id: 2,
        title: "Demon Copperhead",
        author: "Barbara Kingsolver",
        cover: "https://images.unsplash.com/photo-1515098506762-79e1384e9d8e?w=800&auto=format&fit=crop&q=60",
      },
    ],
    Mystery: [
      {
        id: 3,
        title: "The Silent Patient",
        author: "Alex Michaelides",
        cover: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&auto=format&fit=crop&q=60",
      },
      {
        id: 4,
        title: "The Thursday Murder Club",
        author: "Richard Osman",
        cover: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=800&auto=format&fit=crop&q=60",
      },
    ],
    Romance: [
      {
        id: 5,
        title: "Book Lovers",
        author: "Emily Henry",
        cover: "https://images.unsplash.com/photo-1474932430478-367dbb6832c1?w=800&auto=format&fit=crop&q=60",
      },
      {
        id: 6,
        title: "Love and Other Words",
        author: "Christina Lauren",
        cover: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=800&auto=format&fit=crop&q=60",
      },
    ],
    "Sci-Fi": [
      {
        id: 7,
        title: "Project Hail Mary",
        author: "Andy Weir",
        cover: "https://images.unsplash.com/photo-1465929639680-64ee080eb3ed?w=800&auto=format&fit=crop&q=60",
      },
      {
        id: 8,
        title: "Sea of Tranquility",
        author: "Emily St. John Mandel",
        cover: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60",
      },
    ],
    Biography: [
      {
        id: 9,
        title: "The Light We Carry",
        author: "Michelle Obama",
        cover: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=60",
      },
      {
        id: 10,
        title: "I'm Glad My Mom Died",
        author: "Jennette McCurdy",
        cover: "https://images.unsplash.com/photo-1490633874781-1c63cc424610?w=800&auto=format&fit=crop&q=60",
      },
    ],
    History: [
      {
        id: 11,
        title: "The 1619 Project",
        author: "Nikole Hannah-Jones",
        cover: "https://images.unsplash.com/photo-1447069387593-a5de0862481e?w=800&auto=format&fit=crop&q=60",
      },
      {
        id: 12,
        title: "The Splendid and the Vile",
        author: "Erik Larson",
        cover: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=800&auto=format&fit=crop&q=60",
      },
    ],
  };
  const trendingBooks = [
    {
      id: 1,
      title: "Lessons in Chemistry",
      author: "Bonnie Garmus",
      cover: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=800&auto=format&fit=crop&q=60",
      readers: 25420,
    },
    {
      id: 2,
      title: "Fourth Wing",
      author: "Rebecca Yarros",
      cover: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=800&auto=format&fit=crop&q=60",
      readers: 21350,
    },
    {
      id: 3,
      title: "Iron Flame",
      author: "Rebecca Yarros",
      cover: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=800&auto=format&fit=crop&q=60",
      readers: 19845,
    },
    {
      id: 4,
      title: "Happy Place",
      author: "Emily Henry",
      cover: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=800&auto=format&fit=crop&q=60",
      readers: 17234,
    },
    {
      id: 5,
      title: "Hello Beautiful",
      author: "Ann Napolitano",
      cover: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=800&auto=format&fit=crop&q=60",
      readers: 15932,
    },
  ];
  return (
    <Box sx={{ display: "flex", height: "100vh", overscrollBehavior: "contain" }}>
      <Sidebar />
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Header />
        <Box component="main" sx={{ flex: 1, overflow: "auto", p: 3 }}>
          <MainContent
            featuredBooks={featuredBooks}
            booksByCategory={booksByCategory}
            trendingBooks={trendingBooks}
            loading={loading}
            error={error}
          />
        </Box>
      </Box>
    </Box>
  );
}
