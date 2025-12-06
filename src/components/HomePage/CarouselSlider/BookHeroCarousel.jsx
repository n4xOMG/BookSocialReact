import React, { useMemo, useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs, Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/thumbs";
import "swiper/css/effect-fade";
import { Box, IconButton, Paper, useMediaQuery, useTheme } from "@mui/material";
import { ArrowBackIosNew, ArrowForwardIos } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { BookHeroSlide } from "./BookHeroSlide";

export const BookHeroCarousel = ({ books, categories = [], tags = [] }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery((theme) => theme.breakpoints.down("md"));

  // refs for navigation
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
          optimizedCoverUrl: book.bookCover.url,
          categoryName: category ? category.name : "Unknown",
          bookTags: bookTags.slice(0, 5), // Max 5 tags
        };
      }),
    [books, categories, tags]
  );

  // Attach navigation after swiper and refs are mounted
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
        height: isMobile ? "630px" : isTablet ? "500px" : "600px",
        borderRadius: 4,
        overflow: "hidden",   
        "&:hover .nav-btn": { opacity: 1, visibility: "visible" },
        elevation: 0,
        bgcolor: theme.palette.background.paper,
        border: "none",
      }}
    >
      <Swiper
        modules={[Navigation, Thumbs, Autoplay, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        autoplay={{ delay: 7000, disableOnInteraction: false }}
        thumbs={{ swiper: thumbsSwiper }}
        observer={true}             
        observeParents={true}       
        resizeObserver={true}       
        style={{ width: "100%", height: "100%", boxSizing: 'border-box', bottom: isTablet ? 20 : 'auto'}}
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
          display: isMobile ? 'none' : 'flex',
          position: "absolute",
          top: "50%",
          left: 24,
          zIndex: 10,
          transform: "translateY(-50%)",
          bgcolor: "rgba(0,0,0,0.3)",
          backdropFilter: "blur(4px)",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "#fff",
          opacity: 0,
          visibility: "hidden",
          transition: "all 0.3s ease",
          '&:hover': {
            bgcolor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            borderColor: theme.palette.primary.main,
          }
        }}
      >
        <ArrowBackIosNew fontSize="small" />
      </IconButton>

      <IconButton
        ref={nextRef}
        className="nav-btn"
        sx={{
          display: isMobile ? 'none' : 'flex',
          position: "absolute",
          top: "50%",
          right: 24,
          zIndex: 10,
          transform: "translateY(-50%)",
          bgcolor: "rgba(0,0,0,0.3)",
          backdropFilter: "blur(4px)",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "#fff",
          opacity: 0,
          visibility: "hidden",
          transition: "all 0.3s ease",
          '&:hover': {
            bgcolor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            borderColor: theme.palette.primary.main,
          }
        }}
      >
        <ArrowForwardIos fontSize="small" />
      </IconButton>

      {/* Thumbnail Slider */}
      <Box
        sx={{
          position: "absolute",
          bottom:  isMobile ? 10 : isTablet ? 10 : 30 ,
          left: isMobile ? "7%" : isTablet ? "auto" : 50 ,
          right: isTablet ? 20 : "auto" ,
          transform: "none", 
          width:  isMobile ? "90%": isTablet ? "50%" : "35%" ,
          zIndex: 3,
        }}
      >
        <Swiper
          onSwiper={setThumbsSwiper}
          modules={[Thumbs]}
          // spaceBetween={10}
          watchSlidesProgress
          // centeredSlides={true}
          breakpoints={{
            0: { 
              slidesPerView: 4, 
              spaceBetween: 5,
            },
            600: { 
              slidesPerView: 5,
              spaceBetween: 10,
            },
          }}
        >
          {optimizedBooks.map((book) => (
            <SwiperSlide key={book.id}>
              <Box
                sx={{
                  width: isMobile ? "75%" : "100%",
                  height:  70,
                  borderRadius: 2,
                  overflow: "hidden",
                  cursor: "pointer",
                  opacity: 0.6,
                  transition: "all 0.3s ease",
                  "&.swiper-slide-thumb-active": {
                    opacity: 1,
                    border: "2px solid",
                    borderColor: theme.palette.secondary.main,
                    transform: "scale(1.05)",
                  },
                  "&:hover": {
                    opacity: 1,
                  }
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
