import { detectConcordiumProvider } from "@concordium/browser-wallet-api-helpers";
import {
    BlockItemStatus,
    CcdAmount,
    TransactionHash,
} from '@concordium/web-sdk';

import { Button, Link, Stack, TextField, Typography } from "@mui/material";
import { FormEvent, useState } from "react";

export default function GetBlockItemStatus() {
    let [state, setState] = useState({
        checking: false,
        error: "",
        hash: "",
    });

    let [trxstate, setTrxState] = useState({
        status: "",
        data: ""
    })

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


            const client = provider.getGrpcClient();
            const blockItemStatus = await client.getBlockItemStatus(
                formValues.data
            );

            if (blockItemStatus.status === 'received') {
                console.log(
                    'blockItemStatus is "received" and therefore has no "status" field'
                );
                alert("blockItemStatus is `received` and therefore has no `status` field'");
            }
            // If the transaction has only been committed, then there is a list of outcomes:
            if (blockItemStatus.status === 'committed') {
                console.log(
                    'blockItemStatus is "committed" and therefore there are potentially multiple outcomes'
                );
                alert("Transaction is `committed` and therefore there are potentially multiple outcomes");
            }
            // If the transaction has been finalized, then there is exactly one outcome:
            if (blockItemStatus.status === 'finalized') {
                console.log(
                    'blockItemStatus is "finalized" and therefore there is exactly one outcome \n'
                );
                alert("Transaction is `finalied` and therefore there is exactly one outcome");
                const { summary } = blockItemStatus.outcome;
                console.log('The transaction is of type:', summary);
            }

        }
        catch (error: any) {
            setState({ checking: false, error: error.message || error, hash: "" });
        };

    }

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
                label="Data"
                variant="standard"
                disabled={state.checking}
            />
            {state.error && (
                <Typography component="div" color="error">
                    {state.error}
                </Typography>
            )}
            {state.checking && <Typography component="div">Checking..</Typography>}

            <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={state.checking}
            >
                Get Registered Data
            </Button>
        </Stack >
    );
}
