import "./App.css";
import Header from "./Header";
import { useState } from "react";
import { Container, Typography, Link } from "@mui/material";
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
      <footer className="footer">
        <Typography sx={{ mt: 15, color: "white" }} textAlign={"center"} >
          <Link
            sx={{ color: "black" }}
            href="https://developer.concordium.software/en/mainnet/net/guides/developer-page.html"
            target={"_blank"}
          >
            Link to Developer Resources
          </Link>
        </Typography>
      </footer>
    </div >
  );
}