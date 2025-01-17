import { detectConcordiumProvider } from "@concordium/browser-wallet-api-helpers";
import {
    AccountTransactionType,
    DataBlob,
    RegisterDataPayload,
    sha256,
} from "@concordium/web-sdk";
import { Button, Link, Stack, TextField, Typography } from "@mui/material";
import { FormEvent, useState } from "react";
import { Buffer } from "buffer/";

export default function RegisterData() {
    let [state, setState] = useState({
        checking: false,
        error: "",
        hash: "",
        originalMessage: ""
    });

    const submit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setState({ ...state, error: "", checking: true, hash: "" });
        const formData = new FormData(event.currentTarget);

        var formValues = {
            data: formData.get("data")?.toString() ?? "",
        };

        if (!formValues.data) {
            setState({ ...state, error: "Invalid Data" });
            return;
        }

        const provider = await detectConcordiumProvider();
        const account = await provider.connect();

        if (!account) {
            alert("Please connect");
        }

        try {
            const txnHash = await provider.sendTransaction(
                account!,
                AccountTransactionType.RegisterData,
                {
                    data: new DataBlob(sha256([Buffer.from(formValues.data)])),
                } as RegisterDataPayload
            );

            setState({ checking: false, error: "", hash: txnHash, originalMessage: formValues.data });
        } catch (error: any) {
            setState({ checking: false, error: error.message || error, hash: "", originalMessage: "" });
        }
    };

    return (
        <Stack
            component={"form"}
            spacing={2}
            onSubmit={submit}
            autoComplete={"true"}
        >
            <TextField
                id="data"
                name="data"
                label="Data to Register"
                variant="standard"
                disabled={state.checking}
            />
            {state.error && (
                <Typography component="div" color="error">
                    {state.error}
                </Typography>
            )}
            {state.checking && <Typography component="div">Checking..</Typography>}
            {state.hash && (
                <div>
                    <li>
                        <Link
                            // href={`https://testnet.ccdscan.io/?dcount=1&dentity=transaction&dhash=${state.hash}`}
                            // href={`https://dashboard.testnet.concordium.com/lookup/${state.hash}`}
                            href={`https://ccdexplorer.io/testnet/transaction/${state.hash}`}
                            target="_blank"
                        >
                            View Transaction on ccdexplorer.io <br />
                            {state.hash}
                        </Link>
                    </li>
                    <li>
                        <Link
                            href={`https://testnet.ccdscan.io/?dcount=1&dentity=transaction&dhash=${state.hash}`}
                            target="_blank"
                        >
                            View Transaction on ccdscan <br />
                            {state.hash}
                        </Link>
                    </li>
                </div>

            )}
            {state.hash && (
                <p> Check manually using hash: {state.hash}</p>

            )
            }
            {state.hash && (
                <p> Registered Original Message {state.originalMessage}</p>

            )
            }
            <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={state.checking}
                color="success"
            >
                Register Data SHA256
            </Button>
        </Stack>
    );
}