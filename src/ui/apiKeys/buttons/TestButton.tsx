"use client";

import axios from "axios";
import { FC, useState } from "react";
import { Button, TextField } from "@mui/material";

export const TestButton: FC<{}> = () => {
  const [apiKey, setApiKey] = useState("");

  const handleSubmit = async () => {
    const client = axios.create({
      baseURL: "https://castledkp.vercel.app",
      headers: {
        "Content-Type": "application/json",
      },
    });

    client.interceptors.request.use((config) => {
      config.headers.Authorization = `Bearer ${apiKey}`;
      return config;
    });

    client.post("/api/v1/raid", {
      activity: {
        typeId: 1,
        payout: 3,
        note: "This is a test raid",
      },
      attendees: ["Fred", "Ben", "Savage"].map((name) => ({
        characterName: name,
        pilotCharacterName: name,
      })),
      adjustments: [
        { player: "Fred", value: 1, reason: "Just a cool guy" },
      ]?.map(({ player, value, reason }) => ({
        characterName: player,
        pilotCharacterName: player,
        amount: value,
        reason,
      })),
      purchases: [{ buyer: "Fred", item: "Cloak of Flames", price: 30 }].map(
        ({ buyer, item, price }) => ({
          characterName: buyer,
          pilotCharacterName: buyer,
          amount: price,
          itemName: item,
        }),
      ),
    });
  };

  return (
    <>
      <TextField
        label="API key"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
      />
      <Button onClick={() => handleSubmit()}>Test Upload</Button>
    </>
  );
};
