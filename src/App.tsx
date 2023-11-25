import "./App.css";
import Header from "./Header";
import { useState } from "react";
import { Container } from "@mui/material";
import RegisterData from "./Register";
import CBOR from "./CBOR"
import GetBlockItemStatus from "./GetBlockItemStatus";
export default function App() {
  const [isConnected, setConnected] = useState(false);

  return (
    <div className="App">
      <Header
        onConnected={() => setConnected(true)}
        onDisconnected={() => setConnected(false)}
      />
      <Container sx={{ mt: 15 }}>{isConnected && <RegisterData />}</Container>
      <Container sx={{ mt: 15 }}>{isConnected && <CBOR />}</Container>
      <Container sx={{ mt: 15 }}>{isConnected && <GetBlockItemStatus />}</Container>

    </div>
  );
}