import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Alert, Box, Button, IconButton, LinearProgress, Snackbar, Step, StepLabel, Stepper, Typography } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BasicInfoStep from "../../components/UserUploadBook/BasicInfoStep";
import BookCoverStep from "../../components/UserUploadBook/BookCoverStep";
import CategoriesAndTagsStep from "../../components/UserUploadBook/CategoriesAndTagsStep";
import SettingsStep from "../../components/UserUploadBook/SettingsStep";
export default function UserUploadBook() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [bookInfo, setBookInfo] = useState({
    title: "",
    authorName: "Current User",
    artistName: "",
    description: "",
    coverImage: null,
    uploadDate: new Date().toISOString().split("T")[0],
    language: "",
    status: "",
    isSuggested: false,
    categories: [],
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
        if (!bookInfo.coverImage) {
          setSnackbarMessage("Please upload a book cover.");
          return false;
        }
        break;
      case 2:
        if (!bookInfo.uploadDate || !bookInfo.language || !bookInfo.status) {
          setSnackbarMessage("Please fill in all required fields in Settings.");
          return false;
        }
        break;
      case 3:
        if (bookInfo.categories.length === 0 || bookInfo.tags.length === 0) {
          setSnackbarMessage("Please select at least one category and one tag.");
          return false;
        }
        break;
      default:
        return true;
    }
    return true;
  };
  const handleNext = () => {
    if (validateStep()) {
      if (currentStep < steps.length - 1) {
        setCurrentStep((prev) => prev + 1);
      } else {
        handleSubmit();
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
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBookInfo((prev) => ({ ...prev, coverImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    console.log("Submitted book info:", bookInfo);
    alert("Book uploaded successfully!");
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
  );
}
