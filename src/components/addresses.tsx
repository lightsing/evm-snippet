import {Button, List, ListItem, ListItemButton, ListItemText, Stack} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import React from "react";


export const Addresses = () => {
  const [addresses, setAddresses] = React.useState(["0x000000000000000000000000000000000cafe001"]);
  return (
    <Stack>
      <List>
        {addresses.map((address, index) => (
          <ListItem
          >
            <ListItemText
              primary={address}
            />
            <ListItemButton>
              <EditIcon />
            </ListItemButton>
            <ListItemButton>
              <FileOpenIcon />
            </ListItemButton>
            <ListItemButton>
              <DeleteIcon />
            </ListItemButton>

          </ListItem>
        ))}
      </List>
      <Button variant="outlined" startIcon={<AddIcon />}>
        Add New Address
      </Button>
    </Stack>
  )
}
