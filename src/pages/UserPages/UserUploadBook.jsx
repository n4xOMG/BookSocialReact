import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { Alert, Box, Button, IconButton, LinearProgress, Snackbar, Step, StepLabel, Stepper, Typography } from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";
import BasicInfoStep from "../../components/UserUploadBook/BasicInfoStep";
import BookCoverStep from "../../components/UserUploadBook/BookCoverStep";
import CategoriesAndTagsStep from "../../components/UserUploadBook/CategoriesAndTagsStep";
import SettingsStep from "../../components/UserUploadBook/SettingsStep";
import { addNewBookAction } from "../../redux/book/book.action";
import UploadToCloudinary from "../../utils/uploadToCloudinary";

export default function UserUploadBook() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const { user } = useSelector((state) => state.auth);
  const [bookInfo, setBookInfo] = useState({
    author: user,
    title: "",
    authorName: user.username ? user.username : "Author name",
    artistName: "",
    description: "",
    bookCover: null, // Preview URL
    coverFile: null, // Actual File Object
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
          // Check for the file object
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
      // Upload the cover image to Cloudinary
      const imageUrl = await UploadToCloudinary(bookInfo.coverFile, "books");
      // Prepare the book data with the image URL
      const bookData = {
        ...bookInfo,
        bookCover: imageUrl,
        categoryId: bookInfo.category.id,
        tagIds: bookInfo.tags.map((tag) => tag.id),
      };
      // Dispatch the action to add the new book
      dispatch(addNewBookAction(bookData));
      setSnackbarMessage("Book uploaded successfully!");
      setSnackbarOpen(true);
      // Optionally navigate to another page
      navigate("/");
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
        <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <IconButton onClick={() => navigate("/")}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" sx={{ fontWeight: "bold", ml: 1 }}>
              Upload New Book
            </Typography>
          </Box>
          <Box sx={{ mb: 4 }}>
            <Stepper activeStep={currentStep} alternativeLabel>
              {steps.map((step, index) => (
                <Step key={index}>
                  <StepLabel>{step.title}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <LinearProgress variant="determinate" value={(currentStep / steps.length) * 100} sx={{ mt: 2 }} />
          </Box>
          <form>
            {steps[currentStep].component}
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
              {currentStep > 0 && (
                <Button variant="outlined" startIcon={<ChevronLeftIcon />} onClick={handleBack} sx={{ mr: 2 }}>
                  Back
                </Button>
              )}
              <Button variant="contained" color="primary" onClick={handleNext}>
                {currentStep === steps.length - 1 ? "Submit" : "Next"}
              </Button>
            </Box>
          </form>
          <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
            <Alert onClose={() => setSnackbarOpen(false)} severity="error" sx={{ width: "100%" }}>
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </Box>
      )}
    </>
  );
}
