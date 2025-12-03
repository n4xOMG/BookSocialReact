import React from "react";
import { Box, Button, Typography, Alert } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { logError } from "../../utils/errorLogger";

/**
 * Section Error Boundary
 * A lighter error boundary for wrapping specific sections/features.
 * Shows a smaller error message instead of taking over the whole page.
 */
class SectionErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    const context = this.props.context || "SectionErrorBoundary";
    logError(error, errorInfo, context);
    this.setState({ error });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });

    // Call custom reset handler if provided
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI from props, or default
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Box sx={{ p: 3 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              {this.props.title || "Something went wrong in this section"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {this.props.message || "We encountered an error while loading this content."}
            </Typography>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <Typography variant="caption" component="pre" sx={{ mt: 1, whiteSpace: "pre-wrap" }}>
                {this.state.error.toString()}
              </Typography>
            )}
          </Alert>

          <Button variant="outlined" size="small" startIcon={<RefreshIcon />} onClick={this.handleReset}>
            Try Again
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default SectionErrorBoundary;
