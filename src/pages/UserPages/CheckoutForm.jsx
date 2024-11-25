import { Alert, Box, Button } from "@mui/material";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { confirmPayment, createPaymentIntent } from "../../redux/chapter/chapter.action";

const CheckoutForm = ({ creditPackage, onError, onSuccess, jwt }) => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();

  const [processing, setProcessing] = useState(false);
  const [formError, setFormError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setFormError("");

    try {
      // Step 1: Create Payment Intent on the backend
      const paymentIntentResponse = await dispatch(
        createPaymentIntent({
          creditPackageId: creditPackage.id,
          currency: "usd",
        })
      );

      const clientSecret = paymentIntentResponse.clientSecret;

      // Step 2: Confirm the payment on the frontend
      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (paymentResult.error) {
        setFormError(paymentResult.error.message);
        onError(paymentResult.error.message);
        setProcessing(false);
      } else {
        if (paymentResult.paymentIntent.status === "succeeded") {
          // Step 3: Inform backend to update user credits
          await dispatch(
            confirmPayment(
              {
                paymentIntentId: paymentResult.paymentIntent.id,
                creditPackageId: creditPackage.id,
              },
              jwt
            )
          );
          onSuccess();
          setProcessing(false);
        } else {
          setFormError("Payment was not successful. Please try again.");
          onError("Payment was not successful. Please try again.");
          setProcessing(false);
        }
      }
    } catch (error) {
      console.error("Payment processing error:", error);
      setFormError("An unexpected error occurred. Please try again.");
      onError("An unexpected error occurred. Please try again.");
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ mt: 2 }}>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#9e2146",
              },
            },
          }}
        />
      </Box>
      {formError && (
        <Box sx={{ mt: 2 }}>
          <Alert severity="error">{formError}</Alert>
        </Box>
      )}
      <Box sx={{ mt: 4 }}>
        <Button type="submit" variant="contained" color="primary" disabled={!stripe || processing} fullWidth>
          {processing ? "Processing..." : `Pay $${creditPackage?.price}`}
        </Button>
      </Box>
    </form>
  );
};

export default CheckoutForm;
