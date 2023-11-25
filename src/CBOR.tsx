import { detectConcordiumProvider } from "@concordium/browser-wallet-api-helpers";
import {
    AccountTransactionType,
    DataBlob,
    RegisterDataPayload,
    sha256,
} from "@concordium/web-sdk";
import { Button, Link, Stack, TextField, Typography } from "@mui/material";
import { FormEvent, useState } from "react";
import { Buffer } from "buffer";


export default function RegisterData() {
    let [state, setState] = useState({
        checking: false,
        error: "",
        hash: "",
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

            const cbor = require('cbor-web')

            let encoded = cbor.encode(formValues.data);

            console.log(encoded)
            const txnHash = await provider.sendTransaction(
                account!,
                AccountTransactionType.RegisterData,
                {
                    data: new DataBlob(encoded),
                } as RegisterDataPayload
            );

            setState({ checking: false, error: "", hash: txnHash });
        } catch (error: any) {
            setState({ checking: false, error: error.message || error, hash: "" });
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
                <Link
                    // href={`https://dashboard.testnet.concordium.com/lookup/${state.hash}`}
                    href={`https://testnet.ccdscan.io/?dcount=1&dentity=transaction&dhash=${state.hash}`}
                    target="_blank"
                >
                    View Transaction <br />
                    {state.hash}
                </Link>

            )
            }
            {state.hash && (
                <p> Check manually using hash: {state.hash}</p>

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
                CBOR Encode Register Data
            </Button>
        </Stack >
    );
}