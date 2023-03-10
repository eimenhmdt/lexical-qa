import Head from "next/head";
import React, { useState, useRef } from "react";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  Avatar,
  SendButton,
  Loader,
} from "@chatscope/chat-ui-kit-react";
import { FaUserAlt } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import clsx from "clsx";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const userIcon = <FaUserAlt />;
  const [messages, setMessages] = useState([
    { text: "Hi there, how can I help you?", sender: "Lexical" },
  ]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();

  const handleSendMessage = async (message) => {
    setLoading(true);
    setMessages([...messages, { text: message, sender: "User" }]);

    const response = await fetch(
      `https://berri-server-gpt-index-mtj6.zeet-berri.zeet.app/berri_query?proj_path=indexes/eimen.hamedat@gmail.com/109b8131-6939-4a0a-9b2c-eea535d00d5f&query=${question}`
    );
    const data = await response.json();

    setMessages([
      ...messages,
      { text: question, sender: "User" },
      { text: data.response, sender: "Lexical" },
    ]);
    setLoading(false);
    setQuestion("");
  };

  return (
    <>
      <Head>
        <title>Lexical docs Q&A</title>
        <meta name="description" content="Lexical Q&A Bot" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="h-screen py-4 px-6 bg-gray-100">
        <div className="max-w-3xl mx-auto text-center pb-4">
          <h2 className="text-3xl font-extrabold tracking-tighter font-red-hat-display mb-4 text-stone-700">
            Lexical Docs Q&A
          </h2>
        </div>
        <div
          style={{ position: "relative", height: "500px" }}
          className="rounded-lg shadow-lg"
        >
          <MainContainer className="rounded-lg shadow-lg p-8">
            <ChatContainer>
              <MessageList>
                {messages.map((message, index) => {
                  return (
                    <Message
                      model={{
                        message: message.text,
                        sender: message.sender,
                        direction:
                          message.sender === "User" ? "outgoing" : "incoming",
                      }}
                      key={index}
                    >
                      <Avatar
                        src={
                          message.sender === "User" ? "/user.svg" : "/logo.png"
                        }
                        name={message.sender}
                        status="available"
                      />
                    </Message>
                  );
                })}
                {/* <Message
                  model={{
                    message: "Hi there, how can I help you?",
                    direction: "incoming",
                    sender: "Lexical",
                  }}
                >
                  <Avatar
                    src="/logo.png"
                    name="Lexical AI"
                    status="available"
                  />
                </Message>
                <Message
                  model={{
                    message: "Hi there, how can I help you?",
                    direction: "outgoing",
                    sender: "User",
                  }}
                >
                  <Avatar src="/user.svg" name="User" status="available" />
                </Message> */}
              </MessageList>

              <MessageInput
                placeholder="Type message to Lexical AI here"
                value={loading ? "Loading..." : question}
                onChange={setQuestion}
                onSend={handleSendMessage}
                className={clsx(loading && "opacity-10 animate-pulse")}
              />
            </ChatContainer>
          </MainContainer>
        </div>
      </main>
    </>
  );
}
