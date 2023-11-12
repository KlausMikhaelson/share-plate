import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import axios from 'axios';
import { backendUrl } from '../../App';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    height: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    borderRadius: '10px',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center', // Center content horizontally
    justifyContent: 'center' // Center content vertically
};

const FoodModal = ({ id,open, handleClose, name, description, image, expiray_date, amount, setStatus, free }) => {
    // const handleIncrease = () => setAmount(amount + 1);
    // const handleDecrease = () => amount > 0 && setAmount(amount - 1);

    const setToTrade = () => setStatus(false);
    const setToFree = () => setStatus(true);

    return (
        <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        >
        <Box sx={style}>
            <Typography id="modal-title" variant="h6" component="h2">
            {name}
            </Typography>
            <img src={image} alt={name} style={{ maxWidth: '80%',maxHeight: '60%', marginTop: '10px' }} />
            <Typography id="modal-description" sx={{ mt: 2 }}>
            {description}
            </Typography>
            <Typography id="modal-description" sx={{ mt: 2 }}>
            {`Expire Day:${expiray_date}`}
            </Typography>
            <Button 
                onClick={async() => {
                    console.log(id);
                    try {
                        await axios.put(`${backendUrl}/user/updateFoodItemofInventory`, {
                            id: id,
                            type: free ? "Trade" : "Free",
                        })
                        .then((res) => {
                            console.log(res);
                            window.location.reload();
                        })
                    } catch(err) {
                        console.log(err);
                    }
                }} 
                disabled={free} 
                style={{
                    backgroundColor: !free ? '#4CAF50' : '#F0F0F0', // Green when active, grey when disabled
                    color: !free ? 'white' : 'black',
                    margin: '10px',
            }}>
            Set to Free
            </Button>
            <Button 
                onClick={async() => {
                    await axios.put(`${backendUrl}/user/updateFoodItemofInventory`, {
                        id: id,
                        type: free ? "Trade" : "Free",
                    })
                    .then((res) => {
                        console.log(res);
                        window.location.reload();
                    })
                }}  
                disabled={!free} 
                style={{
                    backgroundColor: free ? '#FF5722' : '#F0F0F0', // Orange when active, grey when disabled
                    color: free ? 'white' : 'black',
                    margin: '10px',
            }}>
            Set to Trade
            </Button>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                {/* <Button onClick={handleDecrease} sx={{ width: '100px' }} >-</Button> */}
                {/* <Typography>{amount}</Typography> */}
                {/* <Button onClick={handleIncrease} sx={{ width: '100px' }} >+</Button> */}
            </div>
        </Box>
        </Modal>
    );
};

export default FoodModal;
