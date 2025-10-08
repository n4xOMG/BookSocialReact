import React, { useMemo, useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/thumbs";
import { Box, IconButton, Paper, useMediaQuery, useTheme } from "@mui/material";
import { ArrowBackIosNew, ArrowForwardIos } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { BookHeroSlide } from "./BookHeroSlide";

export const BookHeroCarousel = ({ books, categories = [], tags = [] }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const navigate = useNavigate();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  // refs cho navigation
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null);

  const handleRead = (bookId) => navigate(`/books/${bookId}`);

  const optimizedBooks = useMemo(
    () =>
      books.map((book) => {
        const category = categories.find((cat) => cat.id === book.categoryId) || null;
        const bookTags = tags.filter((tag) => book.tagIds?.includes(tag.id)) || [];
        
        return {
          ...book,
          optimizedCoverUrl: book.bookCover,
          categoryName: category ? category.name : "Unknown",
          bookTags: bookTags.slice(0, 5), // Lấy tối đa 5 tag
        };
      }),
    [books, categories, tags]
  );

  // Gắn navigation sau khi swiper và refs đã mount
  useEffect(() => {
    if (
      swiperRef.current &&
      swiperRef.current.params &&
      prevRef.current &&
      nextRef.current
    ) {
      swiperRef.current.params.navigation.prevEl = prevRef.current;
      swiperRef.current.params.navigation.nextEl = nextRef.current;

      swiperRef.current.navigation.init();
      swiperRef.current.navigation.update();
    }
  }, [swiperRef, prevRef, nextRef]);

  return (
    <Box
      component={Paper}
      sx={{
        position: "relative",
        width: "100%",
        height: isMobile ? "77vh" : "75vh",
        borderRadius: 2,
        overflow: "hidden",   
        "&:hover .nav-btn": { opacity: 1, visibility: "visible" },
        elevation: 3,
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)', 
      }}
    >
      <Swiper
        modules={[Navigation, Thumbs, Autoplay]}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        autoplay={{ delay: 7000, disableOnInteraction: false }}
        thumbs={{ swiper: thumbsSwiper }}
        observer={true}             
        observeParents={true}       
        resizeObserver={true}       
        style={{ width: "100%", height: "100%", boxSizing: 'border-box'}}
      >
        {optimizedBooks.map((book) => (
          <SwiperSlide key={book.id}>
            <BookHeroSlide
              book={book}
              onRead={handleRead}
              categoryName={book.categoryName}
              bookTags={book.bookTags}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom nav buttons */}
      <IconButton
        ref={prevRef}
        className="nav-btn"
        sx={{
          display: isMobile ? 'none' : 'block',
          position: "absolute",
          top: "50%",
          left: 8 ,
          zIndex: 10,
          transform: "translateY(-50%)",
          bgcolor: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(5px)',
          WebkitBackdropFilter: 'blur(5px)',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          color: "text.primary", // Đổi màu icon thành màu chữ
          opacity: 0,
          visibility: "hidden",
          transition: "all 0.3s ease",
          '&:hover': {
            bgcolor: 'rgba(255, 255, 255, 0.4)',
          }
        }}
      >
        <ArrowBackIosNew fontSize="small" />
      </IconButton>

      <IconButton
        ref={nextRef}
        className="nav-btn"
        sx={{
          display: isMobile ? 'none' : 'block',
          position: "absolute",
          top: "50%",
          right: 16 ,
          zIndex: 10,
          transform: "translateY(-50%)",
          bgcolor: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(5px)',
          WebkitBackdropFilter: 'blur(5px)',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          color: "text.primary", 
          opacity: 0,
          visibility: "hidden",
          transition: "all 0.3s ease",
          '&:hover': {
            bgcolor: 'rgba(255, 255, 255, 0.4)',
          }
        }}
      >
        <ArrowForwardIos fontSize="small" />
      </IconButton>

      {/* Thumbnail Slider */}
      <Box
        sx={{
          position: "absolute",
          bottom:  isMobile ? 10 : 30 ,
          left:  isMobile ? 10 : 50 ,
          transform: "none", 
          width:  isMobile ? "90%": "30%" ,
          zIndex: 3,
        }}
      >
        <Swiper
          onSwiper={setThumbsSwiper}
          modules={[Thumbs]}
          slidesPerView={5}
          spaceBetween={10}
          watchSlidesProgress
          breakpoints={{
            600: { slidesPerView: 5 },
            400: { slidesPerView: 4 },
            0: { slidesPerView: 3 },
          }}
        >
          {optimizedBooks.map((book) => (
            <SwiperSlide key={book.id}>
              <Box
                sx={{
                  width: "100%",
                  height:  isMobile ? 40 : 50,
                  borderRadius: 2,
                  overflow: "hidden",
                  cursor: "pointer",
                  opacity: 0.8,
                  "&.swiper-slide-thumb-active": {
                    opacity: 1,
                    border: "2px solid #fff",
                  },
                }}
              >
                <img
                  src={book.optimizedCoverUrl}
                  alt={book.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  loading="lazy"
                />
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
    </Box>
  );
};
