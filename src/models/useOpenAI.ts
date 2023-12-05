import OpenAI from 'openai';
import { useState } from 'react';

export default () => {
  const [openAI, setOpenAI] = useState<OpenAI>();

  const openai = new OpenAI({
    apiKey: process.env["OPENAI_API_KEY"], // defaults to process.env["OPENAI_API_KEY"]
  });
  setOpenAI(openai);

  // const transcript = openai?.audio.transcriptions.create({
  //   model: 'whisper-1',
  //   file: 
  // });

  return {
    openAI,
  };
};