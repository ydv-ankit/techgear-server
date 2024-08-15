import express from "express";
import fetch from "node-fetch";

const createPaypalAuth = async () => {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  try {
    const response = await fetch(
      `${process.env.PAYPAL_BASE_URL}/v1/oauth2/token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
        },
        body: "grant_type=client_credentials",
      },
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return { accessToken: data.access_token };
  } catch (error) {
    return { error };
  }
};

export { createPaypalAuth };
