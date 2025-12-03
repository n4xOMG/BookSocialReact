import React, { useState } from "react";
import { Box, Alert, Typography } from "@mui/material";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useDispatch } from "react-redux";
import { createPayment, confirmUnifiedPayment, capturePaypalOrder } from "../../redux/chapter/chapter.action";

const PayPalCheckout = ({ creditPackage, onError, onSuccess, jwt }) => {
  const dispatch = useDispatch();
  const [{ isPending }] = usePayPalScriptReducer();
  const [processing, setProcessing] = useState(false);
  const [formError, setFormError] = useState("");

  const createOrder = async (data, actions) => {
    try {
      setProcessing(true);
      setFormError("");

      // Create PayPal order on backend
      const orderResponse = await dispatch(
        createPayment({
          creditPackageId: creditPackage.id,
          paymentProvider: "PAYPAL",
          currency: "USD",
        })
      );
      const orderData = orderResponse?.payload || orderResponse?.data;

      console.log("PayPal order created:", orderData);

      // Return the order ID from the backend response
      const orderId = orderData?.id || orderData?.orderId || orderData?.paypalOrderId;
      if (!orderId) {
        throw new Error("Missing PayPal order id.");
      }

      return orderId;
    } catch (error) {
      console.error("Error creating PayPal order:", error);
      setFormError("Failed to create PayPal order. Please try again.");
      onError("Failed to create PayPal order. Please try again.");
      setProcessing(false);
      throw error;
    }
  };

  const onApprove = async (data, actions) => {
    try {
      setProcessing(true);
      setFormError("");

      console.log("PayPal payment approved:", data);

      // Capture the order on backend
      const captureResponse = await dispatch(capturePaypalOrder(data.orderID));
      const captureData = captureResponse?.payload || captureResponse?.data;

      console.log("PayPal order captured:", captureData);

      const captureStatus = captureData?.status || captureData?.orderStatus;

      if (captureStatus === "COMPLETED") {
        // Confirm payment and update user credits
        const confirmation = await dispatch(
          confirmUnifiedPayment({
            paymentIntentId: data.orderID,
            creditPackageId: creditPackage.id,
            paymentProvider: "PAYPAL",
          })
        );

        if (confirmation?.error) {
          throw new Error(confirmation.error);
        }

        onSuccess();
      } else {
        setFormError("Payment was not completed. Please try again.");
        onError("Payment was not completed. Please try again.");
      }

      setProcessing(false);
    } catch (error) {
      console.error("Error processing PayPal payment:", error);
      setFormError("Payment processing failed. Please try again.");
      onError("Payment processing failed. Please try again.");
      setProcessing(false);
    }
  };

  const onCancel = (data) => {
    console.log("PayPal payment cancelled:", data);
    setFormError("Payment was cancelled.");
    if (onError) onError("Payment was cancelled.");
    setProcessing(false);
  };

  const onPayPalError = (err) => {
    console.error("PayPal payment error:", err);
    setFormError("An error occurred during payment. Please try again.");
    if (onError) onError("An error occurred during payment. Please try again.");
    setProcessing(false);
  };

  if (isPending) {
    return (
      <Box sx={{ mt: 2, textAlign: "center" }}>
        <Typography>Loading PayPal...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Click the PayPal button below to complete your payment of ${creditPackage?.price}
      </Typography>

      <PayPalButtons
        style={{
          layout: "vertical",
          color: "blue",
          shape: "rect",
          label: "paypal",
        }}
        createOrder={createOrder}
        onApprove={onApprove}
        onCancel={onCancel}
        onError={onPayPalError}
        disabled={processing}
      />

      {formError && (
        <Box sx={{ mt: 2 }}>
          <Alert severity="error">{formError}</Alert>
        </Box>
      )}

      {processing && (
        <Box sx={{ mt: 2 }}>
          <Alert severity="info">Processing payment...</Alert>
        </Box>
      )}
    </Box>
  );
};

export default PayPalCheckout;
