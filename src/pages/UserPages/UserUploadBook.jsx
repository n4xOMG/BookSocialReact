import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Alert, Box, Button, IconButton, Snackbar, Step, StepLabel, Stepper, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";
import BasicInfoStep from "../../components/UserUploadBook/BasicInfoStep";
import BookCoverStep from "../../components/UserUploadBook/BookCoverStep";
import CategoriesAndTagsStep from "../../components/UserUploadBook/CategoriesAndTagsStep";
import SettingsStep from "../../components/UserUploadBook/SettingsStep";
import { addNewBookAction } from "../../redux/book/book.action";
import { UploadToServer } from "../../utils/uploadToServer";

export default function UserUploadBook() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const { user } = useSelector((state) => state.auth);
  const [bookInfo, setBookInfo] = useState({
    author: user,
    title: "",
    authorName: user?.username ? user?.username : "Author name",
    artistName: "",
    description: "",
    bookCover: null, // Preview URL
    coverFile: null,
    language: "",
    status: "",
    category: null,
    tags: [],
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookInfo((prev) => ({ ...prev, [name]: value }));
  };

  const validateStep = () => {
    switch (currentStep) {
      case 0:
        if (!bookInfo.title || !bookInfo.authorName || !bookInfo.description) {
          setSnackbarMessage("Please fill in all required fields in Basic Information.");
          return false;
        }
        break;
      case 1:
        if (!bookInfo.coverFile) {
          setSnackbarMessage("Please upload a book cover.");
          return false;
        }
        break;
      case 2:
        if (!bookInfo.language || !bookInfo.status) {
          setSnackbarMessage("Please fill in all required fields in Settings.");
          return false;
        }
        break;
      case 3:
        if (!bookInfo.category) {
          setSnackbarMessage("Please select a category.");
          return false;
        }
        break;
      default:
        return true;
    }
    return true;
  };

  const handleNext = async () => {
    if (validateStep()) {
      if (currentStep < steps.length - 1) {
        setCurrentStep((prev) => prev + 1);
      } else {
        await handleSubmit();
      }
    } else {
      setSnackbarOpen(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setBookInfo((prev) => ({
        ...prev,
        bookCover: URL.createObjectURL(file),
        coverFile: file,
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const uploadResult = await UploadToServer(bookInfo.coverFile, user.username, `book_${bookInfo.title}_${Date.now()}`);
      const bookCoverObj = {
        url: uploadResult.url,
        isMild: uploadResult.safety?.level === "MILD"
      };
      const bookData = {
        ...bookInfo,
        bookCover: bookCoverObj,
        categoryId: bookInfo.category.id,
        tagIds: bookInfo.tags.map((tag) => tag.id),
      };
      dispatch(addNewBookAction(bookData));
      setSnackbarMessage("Book uploaded successfully!");
      setSnackbarOpen(true);

      navigate("/stories");
    } catch (error) {
      console.error("Upload Error:", error);
      setSnackbarMessage("Error uploading book. Please try again.");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { title: "Basic Information", component: <BasicInfoStep bookInfo={bookInfo} handleInputChange={handleInputChange} /> },
    { title: "Book Cover", component: <BookCoverStep bookInfo={bookInfo} handleFileChange={handleFileChange} /> },
    { title: "Settings", component: <SettingsStep bookInfo={bookInfo} handleInputChange={handleInputChange} setBookInfo={setBookInfo} /> },
    {
      title: "Categories and Tags",
      component: <CategoriesAndTagsStep bookInfo={bookInfo} setBookInfo={setBookInfo} handleInputChange={handleInputChange} />,
    },
  ];

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Box
          sx={{
            background:
              theme.palette.mode === "dark"
                ? "linear-gradient(135deg, #0f0f1c 0%, #1a1a2e 100%)"
                : "linear-gradient(135deg, #f8f7f4 0%, #e8e6e3 100%)",
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            py: 4,
          }}
        >
          <Box
            sx={{
              maxWidth: 900,
              width: "100%",
              mx: "auto",
              px: { xs: 2, sm: 3 },
            }}
          >
            <Box
              sx={{
                backgroundColor: theme.palette.mode === "dark" ? "rgba(18, 18, 30, 0.7)" : "rgba(255, 255, 255, 0.7)",
                backdropFilter: "blur(20px) saturate(180%)",
                WebkitBackdropFilter: "blur(20px) saturate(180%)",
                border: `1px solid ${theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)"}`,
                borderRadius: "24px",
                boxShadow: theme.palette.mode === "dark" ? "0 8px 32px rgba(0, 0, 0, 0.4)" : "0 8px 32px rgba(0, 0, 0, 0.1)",
                p: { xs: 3, sm: 4, md: 5 },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
                <IconButton
                  onClick={() => navigate("/")}
                  sx={{
                    backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.03)",
                    backdropFilter: "blur(8px)",
                    border: `1px solid ${theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)"}`,
                    borderRadius: "12px",
                    "&:hover": {
                      backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.05)",
                      transform: "translateX(-2px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  <ArrowBackIcon />
                </IconButton>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    ml: 2,
                    background: "linear-gradient(135deg, #9d50bb 0%, #6e48aa 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    fontFamily: '"Playfair Display", serif',
                  }}
                >
                  Upload New Book
                </Typography>
              </Box>
              <Box sx={{ mb: 5 }}>
                <Stepper
                  activeStep={currentStep}
                  alternativeLabel
                  sx={{
                    "& .MuiStepLabel-root .Mui-completed": {
                      color: "#9d50bb",
                    },
                    "& .MuiStepLabel-root .Mui-active": {
                      color: "#9d50bb",
                    },
                    "& .MuiStepLabel-label.Mui-active": {
                      fontWeight: 600,
                    },
                    "& .MuiStepConnector-line": {
                      borderColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
                    },
                    "& .Mui-completed .MuiStepConnector-line": {
                      borderColor: "#9d50bb",
                    },
                  }}
                >
                  {steps.map((step, index) => (
                    <Step key={index}>
                      <StepLabel
                        sx={{
                          "& .MuiStepLabel-label": {
                            fontSize: { xs: "0.75rem", sm: "0.875rem" },
                          },
                        }}
                      >
                        {step.title}
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Box>
              <Box
                sx={{
                  backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.02)",
                  backdropFilter: "blur(8px)",
                  border: `1px solid ${theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)"}`,
                  borderRadius: "16px",
                  p: { xs: 3, sm: 4 },
                  mb: 4,
                }}
              >
                {steps[currentStep].component}
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                {currentStep > 0 ? (
                  <Button
                    variant="outlined"
                    startIcon={<ChevronLeftIcon />}
                    onClick={handleBack}
                    sx={{
                      borderRadius: "12px",
                      px: 3,
                      py: 1.5,
                      borderColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)",
                      backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.02)",
                      backdropFilter: "blur(8px)",
                      "&:hover": {
                        borderColor: "#9d50bb",
                        backgroundColor: "rgba(157, 80, 187, 0.1)",
                        transform: "translateY(-2px)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    Back
                  </Button>
                ) : (
                  <Box />
                )}
                <Button
                  variant="contained"
                  endIcon={currentStep === steps.length - 1 ? null : <ChevronRightIcon />}
                  onClick={handleNext}
                  sx={{
                    borderRadius: "12px",
                    px: 4,
                    py: 1.5,
                    background: "linear-gradient(135deg, #9d50bb 0%, #6e48aa 100%)",
                    boxShadow: "0 4px 12px rgba(157, 80, 187, 0.3)",
                    fontWeight: 600,
                    "&:hover": {
                      background: "linear-gradient(135deg, #b35fd1 0%, #8558c4 100%)",
                      boxShadow: "0 6px 20px rgba(157, 80, 187, 0.4)",
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  {currentStep === steps.length - 1 ? "Submit" : "Next"}
                </Button>
              </Box>
              <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
                <Alert
                  onClose={() => setSnackbarOpen(false)}
                  severity={snackbarMessage.includes("success") ? "success" : "error"}
                  sx={{
                    width: "100%",
                    backgroundColor: theme.palette.mode === "dark" ? "rgba(18, 18, 30, 0.95)" : "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(20px)",
                    border: `1px solid ${theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}`,
                    borderRadius: "12px",
                  }}
                >
                  {snackbarMessage}
                </Alert>
              </Snackbar>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
}
