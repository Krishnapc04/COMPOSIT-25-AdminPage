// import React, { useState } from "react";
// import axios from "axios";
// import { db, doc, getDoc } from "../firebase";
// // import { db } from "../firebase";

// const CertificatePage = () => {
//   const [name, setName] = useState("");
//   const [compositId, setCompositId] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [qrCode, setQrCode] = useState(null);
//   const [certificateBase64, setCertificateBase64] = useState(null);

//   // 🔹 Function to Generate Certificate
//   const generateCertificate = async () => {
//     if (!name || !compositId) {
//       alert("Please enter both name and COMPOSIT ID");
//       return;
//     }

//     setLoading(true);

//     try {
//       const response = await axios.post("http://localhost:5000/api/user/generate-certificate", { name, compositId });
//       setQrCode(response.data.qrCodeUrl);
//       alert("Certificate generated successfully!");
//     } catch (error) {
//       console.error("Error generating certificate:", error);
//       alert("Failed to generate certificate");
//     }

//     setLoading(false);
//   };

//   // 🔹 Function to Fetch Certificate from Firestore
//   const fetchCertificate = async () => {
//     if (!compositId) {
//       alert("Enter your COMPOSIT ID to fetch the certificate!");
//       return;
//     }

//     setLoading(true);

//     try {
//       const docRef = doc(db, "certificates", compositId);
//       const docSnap = await getDoc(docRef);

//       if (docSnap.exists()) {
//         const data = docSnap.data();
//         setCertificateBase64(data.pdfBase64);
//         setQrCode(data.qrCode);
//       } else {
//         alert("Certificate not found! Generate it first.");
//       }
//     } catch (error) {
//       console.error("Error fetching certificate:", error);
//       alert("Failed to fetch certificate");
//     }

//     setLoading(false);
//   };

//   // 🔹 Function to Download Certificate
//   const downloadCertificate = () => {
//     if (!certificateBase64) {
//       alert("No certificate found! Fetch it first.");
//       return;
//     }

//     const link = document.createElement("a");
//     link.href = `data:application/pdf;base64,${certificateBase64}`;
//     link.download = `COMPOSIT_Certificate_${compositId}.pdf`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   return (
//     <div style={{ textAlign: "center", padding: "20px" }}>
//       <h2>COMPOSIT Certificate Generator</h2>

//       {/* 🔹 Input Fields */}
//       <input type="text" placeholder="Enter Your Name" value={name} onChange={(e) => setName(e.target.value)} />
//       <input type="text" placeholder="Enter COMPOSIT ID" value={compositId} onChange={(e) => setCompositId(e.target.value)} />

//       {/* 🔹 Buttons */}
//       <button onClick={generateCertificate} disabled={loading}>Generate Certificate</button>
//       <button onClick={fetchCertificate} disabled={loading}>Fetch Certificate</button>
//       <button onClick={downloadCertificate} disabled={!certificateBase64}>Download Certificate</button>

//       {/* 🔹 QR Code Display */}
//       {qrCode && <div><p>Scan to Verify:</p><img src={qrCode} alt="QR Code" /></div>}
//     </div>
//   );
// };

// export default CertificatePage;
