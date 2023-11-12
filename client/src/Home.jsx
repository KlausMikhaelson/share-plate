import React, { useState, useContext } from "react";
import { MyContextProvider, backendUrl } from "./App";
import Navbar from "./Navbar";
import { db, storage } from "./firebase";
import { getDownloadURL, ref as storageRef, uploadBytes } from "firebase/storage";
import { v4 as uuid } from "uuid";
import axios from "axios";

const Home = () => {
    const [imageUpload, setImageUpload] = useState(null);
    const [url, setUrl] = useState('https://static.toiimg.com/photo/89946526.cms');
    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [type, setType] = useState("");
    const [location, setLocation] = useState("");
    const { user, setUser } = useContext(MyContextProvider);
    const [expiry, setExpiry] = useState("");
    const imageRef = storageRef(storage, `products/${uuid()}`);
    const uploadFile = () => {
        if (imageUpload == null) {
            alert("Please select an image");
            return;
        }
        const imageRef = storageRef(storage, `products/${uuid()}`);
        uploadBytes(imageRef, imageUpload)
            .then((snapshot) => {
                getDownloadURL(snapshot.ref)
                    .then((url) => {
                        console.log(url);
                        setUrl(url);
                    })
                    .catch((err) => console.log(err));
            })
            .catch((err) => console.log(err));
    };

    const handleAddFoodItem = async(e) => {
        e.preventDefault();
        await axios.post(`${backendUrl}/user/addFood`, {
            name,
            quantity,
            type,
            location,
            imageUri: url,
            email: user.email,
            expiry
        })
        .then(async(res) => {
            await axios.put(`${backendUrl}/user//updateInventory`, {
                email: user.email,
            })
        })
        .catch((err) => console.log(err));
        console.log(name, quantity, type, location, url, expiry);
    }

    return (
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          rowGap: "20px",
          height: "80vh",
          width: "500px", // Adjust the width as needed
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.2)",
          margin: "auto",
          marginTop: "50px",
        }}>
          <h1 style={{alignItems: "center"}}>Add items in your inventory</h1>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", rowGap: "20px" }}>
            <img style={{ height: "100px", width: "150px", borderRadius: "15px" }} src={url} alt="product" />
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <input type="file" accept="image/png,image/jpeg" onChange={(e) => setImageUpload(e.target.files[0])} />
              <p style={{ cursor: "pointer", display: "flex", fontSize: "14px", backgroundColor: "#f2f2f2", padding: "7px 15px", borderRadius: "10px" }} onClick={uploadFile}>Upload</p>
            </div>
            <div>
              <label style={{ margin: "10px", textAlign: "left" }}>Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} style={{ padding: "5px 7px", borderRadius: "10px" }} type="text" />
            </div>
            <div>
              <label style={{ margin: "10px", textAlign: "left" }}>Quantity</label>
              <input value={quantity} onChange={(e) => setQuantity(e.target.value)} style={{ padding: "5px 7px", borderRadius: "10px" }} type="number" />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <label style={{ margin: "10px", textAlign: "left" }}>Type</label>
              <select
                style={{ padding: "5px 7px", borderRadius: "10px" }}
                defaultValue={"Free"}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="Free">Free</option>
                <option value="Trade">Trade</option>
              </select>
            </div>
            <div>
              <label style={{ margin: "10px", textAlign: "left" }}>Location link</label>
              <input value={location} onChange={(e) => setLocation(e.target.value)} style={{ padding: "5px 7px", borderRadius: "10px" }} type="text" />
            </div>
            <div>
              <label style={{ margin: "10px", textAlign: "left" }}>Expiry</label>
              <input value={expiry} onChange={(e) => setExpiry(e.target.value)} style={{ padding: "5px 7px", borderRadius: "10px" }} type="date" />
            </div>
            <button onClick={handleAddFoodItem} style={{ backgroundColor: "#f2f2f2", outline: "none", border: "none", padding: "7px 15px", borderRadius: "10px", cursor: "pointer" }}>Add Item</button>
          </div>
        </div>
      );

}

export default Home;