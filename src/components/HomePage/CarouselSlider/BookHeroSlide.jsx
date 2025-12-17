import { Box, Button, Chip, Stack, Typography, useMediaQuery } from "@mui/material";
import { Link } from 'react-router-dom';
export const BookHeroSlide = ({ book, onRead, categoryName, bookTags= [] }) => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const maxTags = isMobile ? 2 : 5;
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: isMobile ? "auto" : "100%",
        display: "flex",
        flexDirection: isMobile ? "column" : "row" ,
        alignItems: "center",
        justifyContent: "space-between",
        overflow: "hidden",
        bgcolor: "background.paper", // Ensure opacity
      }}
    >
      {/* Content */}
      <Box
        sx={{
          order: isMobile ? 2 : 'initial',
          position: "relative",
          zIndex: 2,
          flex: isMobile ? "auto" : 1,
          px: isMobile ? 0 : isTablet ? 3 : 6,
          py: isMobile ? 2 : isTablet ? 0 : 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          maxWidth: isMobile ? "100%" : isTablet ? "100%" : "50%",
        }}
      >
        {/* Title */}
        <Typography
          variant="h3"
          className="font-serif"
          sx={{
            order: isMobile ? 1 : 'initial',
            fontWeight: 800,
            mb: 1,
            fontSize: isMobile ? "1.5rem": isTablet ? "2rem" : "2.8rem",
            textAlign: isMobile ? "center" : "left",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            color: "primary.main",
            letterSpacing: "-0.02em",
          }}
        >
          {book.title}
        </Typography>
        {/* Tags */}
        {bookTags.length > 0 && (
          <Stack 
                direction="row" 
                spacing={1} 
                flexWrap="wrap" 
                justifyContent= {isMobile ? "center": "flex-start"}
                sx={{order: isMobile ? 2 : 'initial', mb: isMobile ? 1 : isTablet ? 1 : 2 }}
            >
                <Chip
                  label={book.latestChapterNumber ? `Ch ${book.latestChapterNumber}` : "New"}
                  size="small"
                  sx={{
                      bgcolor: "primary.main",
                      color: "primary.contrastText", 
                      fontWeight: 600,
                      borderRadius: "6px", 
                      border: "1px solid rgba(255,255,255,0.1)",
                  }}
                />
                {book.editorChoice && (
                  <Chip
                    label={"Editor Choice"}
                    size="small"
                    sx={{
                        bgcolor: "secondary.main",
                        color: "secondary.contrastText", 
                        fontWeight: 600,
                        borderRadius: "6px", 
                    }}
                  />
                )}
                {bookTags.slice(0, maxTags).map((tag) => (
                  <Chip
                    key={tag.id}
                    label={tag.name}
                    size="small"
                    sx={{
                      bgcolor: "background.paper",
                      color: "text.primary", 
                      fontWeight: 500,
                      borderRadius: "6px", 
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  />
                ))}
                {bookTags.length > maxTags && (
                  <Chip
                    label={`+${bookTags.length - maxTags}`}
                    size="small"
                    sx={{
                      bgcolor: "background.paper",
                      color: "text.secondary", 
                      fontWeight: 500,
                      borderRadius: "6px", 
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  />
                )}
            </Stack>
        )}

        {/* Categories */}
        {categoryName && (
          <Typography
            variant="body1"
            fontWeight="500"
            sx={{
                order: isMobile ? 3 : 'initial',
                color: "text.secondary",
                textAlign: isMobile ? "center": "left",
                fontSize: isMobile ? "0.9rem" : isTablet ? "0.9rem" :"1rem",
              }}
            >
              Category: {categoryName}
          </Typography>
        )}

        {/* Authors */}
        {book.author && (
          <Box
            sx={{
              order: isMobile ? 4 : 'initial',
              display: 'flex',
              justifyContent: isMobile ? "center": isTablet ? "flex-start" : "flex-start", 
              flexDirection: isMobile ? "column" : isTablet ? "column" : "row",
              alignItems: 'center',
              mb: isMobile ? 1 : isTablet ? 1 : 2, 
              gap: isMobile ? 0 : isTablet ? 0 : 0.5,
            }}
          >
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'row',
              width: isMobile ? '100%' : isTablet ? '100%' : 'auto',
              justifyContent: isMobile ? 'center' : isTablet ? 'flex-start' : 'flex-start',
              gap: 1,
            }}>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  color: "text.secondary", 
                  lineHeight: 1, 
                }}
              >
                By: 
              </Typography>
              <Typography 
                variant="subtitle1" 
                fontWeight="600" 
                sx={{ 
                  color: "text.secondary", 
                  marginRight: isMobile ? 0 : isTablet ? 0 :  5,
                  }}
                >
                  {book.artistName || "Unknown Artist"}
              </Typography>
            </Box>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                color: "text.secondary", 
                marginRight: 5,
                display: isMobile ? 'none' : isTablet ? 'none' : 'block'
                }}
              >
                |
            </Typography>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'row',
              width: isMobile ? '100%' :  isTablet ? '100%' : 'auto',
              justifyContent: isMobile ? 'center' :  isTablet ? 'flex-start' : 'flex-start',
              gap: 1,
            }}>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  color: "text.secondary", 
                  ineHeight: 1, 
                }}
              >
                Upload by:
              </Typography>
              <Typography 
                component={Link}
                to={`/profile/${book.author.id}`}
                variant="subtitle1" 
                fontWeight="600" 
                sx={{ 
                  cursor: "pointer", 
                  lineHeight: 1, 
                  display: "block",
                  textDecoration: "none",
                  color: "text.secondary", 
                  fontStyle: "italic",
                  "&:hover": {
                              textDecoration: "underline",
                              color: "primary.main",
                            },  
                  }}
                >
                  {book.author.username} 
              </Typography>
            </Box>
          </Box>
        )}

        {/* Description */}
        {book.description && (
          <Typography
            variant="body1"
            sx={{
              order: isMobile ? 5 : 'initial',
              display: isMobile ? 'none' : "-webkit-box",
              WebkitLineClamp: isMobile ? 2 : isTablet ? 3 : 5, 
              WebkitBoxOrient: "vertical",
              mb: isMobile ? 1 : isTablet ? 1 : 3,
              maxHeight: isMobile ? 80 : 140,
              overflow: "hidden",
              textOverflow: "ellipsis",
              textAlign: 'justify',
            }}
          >
            {book.description}
          </Typography>
        )}

        {/* Buttons */}
        <Stack direction="row" spacing={2} sx={{order: isMobile ? 6 : 'initial', justifyContent: isMobile ? 'center' : 'flex-start', alignItems: 'center', }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => onRead(book.id)}
            sx={{ 
              borderRadius: "8px", 
              px: 4,
              py: 1,
              textTransform: "none",
              fontWeight: 600,
              boxShadow: 2,
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: 4,
              }
            }}
          >
            Read Now
          </Button>
        </Stack>
      </Box>

      {/* Cover image (Right side) */}
      <Box
        sx={{
          order: isMobile ? 1 : 'initial',
          position: "relative",
          zIndex: 2,
          flex: isMobile ? 'auto'  : 'initial',
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          maxWidth: isMobile ? "100%": isTablet ? "50%" : "40%" ,
          px: isMobile? 1:  isTablet ? 1 : 4 ,
          py: isMobile? 1: isTablet ? 1 : 0 ,
          height: isMobile ? '300px' : 'auto', 
          overflow: 'hidden', 
        }}
      >
        <Box
          component="img"
          src={book.optimizedCoverUrl || book.bookCover}
          alt={book.title}
          sx={{
            width: isMobile ? "60%" : isTablet ? "60%" : "70%",
            height: "auto",
            borderRadius: 2,
            boxShadow: "0 8px 30px rgba(0,0,0,0.6)",
          }}
        />
      </Box>
    </Box>
  );
};
