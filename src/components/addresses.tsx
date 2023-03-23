import {Button, List, Stack} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import React from "react";
import {AddressItem} from "./address";
import {AddressDialog} from "./addressDialog";


export const Addresses = () => {
  const [addresses, setAddresses] = React.useState<readonly string[]>(["0x000000000000000000000000000000000cafe001"]);

  const [dialogOpen, setDialogOpen] = React.useState(false);

  return (
    <Stack>
      <List>
        {addresses.map((address, index) => (
          <AddressItem
            index={index}
            address={address}
            onEdit={
              (newVal) => {
                setAddresses((old) => [...old.slice(0, index), newVal, ...old.slice(index + 1)]);
              }
            }
            onDelete={
              () => {
                setAddresses(old => old.slice(0, index).concat(old.slice(index + 1)))
              }
            }
          />
        ))}
      </List>
      <Button variant="outlined" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}>
        Add New Address
      </Button>
      <AddressDialog
        open={dialogOpen}
        initialValue=""
        onSave={
          (address) => {
            setAddresses(old => [...old, address]);
            setDialogOpen(false);
          }
        }
        onClose={() => setDialogOpen(false)}
        clearOnSave
      />
    </Stack>
  )
}
