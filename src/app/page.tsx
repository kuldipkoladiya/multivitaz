"use client";
import React, { useEffect, useState } from "react";

export default function Home() {
    const [open, setOpen] = useState(false);
    const [qty, setQty] = useState(1);
    const [payment, setPayment] = useState("upi");
    const [current, setCurrent] = useState(0);
    const [success, setSuccess] = useState(false);

    // ✅ VARIANT
    const [variant, setVariant] = useState("30");

    // ✅ FAKE NOTIFICATION
    const [notification, setNotification] = useState<any>(null);
// ✅ FAQ STATE (ADDED)
    const [faqForm, setFaqForm] = useState({
        name: "",
        mobile: "",
        question: "",
    });

    const [form, setForm] = useState({
        name: "",
        mobile: "",
        email: "",
        address: "",
        city: "",
        pincode: "",
    });

    const WHATSAPP_NUMBER = "919638470305";
    const RAZORPAY_LINK = "https://rzp.io/l/YOUR_LINK";

    // ✅ VARIANTS DATA
    const variants = {
        "30": {
            label: "30 Tablets",
            price: 899,
            oldPrice: 1499,
            images: [
                "/images/1.jpg",
                "/images/2.jpg",
                "/images/3.jpg",
                "/images/4.jpg",
                "/images/5.jpg",
            ],
        },
        "60": {
            label: "60 Tablets",
            price: 1499,
            oldPrice: 2499,
            images: [
                "/images/6.jpg",
                "/images/7.jpg",
                "/images/8.jpg",
                "/images/9.jpg",
                "/images/10.jpg",
            ],
        },
    };

    const selectedVariant = variants[variant];
    const price = selectedVariant.price;
    const oldPrice = selectedVariant.oldPrice;
    const images = selectedVariant.images;

    const total = qty * price;

    useEffect(() => {
        const t = setTimeout(() => setOpen(true), 10000);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
    }, []);

    // reset image when variant changes
    useEffect(() => {
        setCurrent(0);
    }, [variant]);

    // 🔥 UPDATED NOTIFICATION LOGIC (WITH LOCATION)
    useEffect(() => {
        const names = ["Rahul", "Priya", "Amit", "Neha", "Karan", "Riya", "Vikas", "Sneha"];
        const cities = ["Surat", "Ahmedabad", "Mumbai", "Delhi", "Pune", "Jaipur", "Rajkot", "Vadodara"];

        const interval = setInterval(() => {
            const randomName = names[Math.floor(Math.random() * names.length)];
            const randomCity = cities[Math.floor(Math.random() * cities.length)];
            const randomQty = Math.floor(Math.random() * 3) + 1;

            setNotification({
                name: randomName,
                city: randomCity,
                qty: randomQty,
                variant: selectedVariant.label,
            });

            setTimeout(() => {
                setNotification(null);
            }, 4000);

        }, Math.floor(Math.random() * 10000) + 10000);

        return () => clearInterval(interval);
    }, [variant]);

    const handleFaqSubmit = () => {
        if (!faqForm.name || !faqForm.mobile || !faqForm.question) return;

        const msg = `❓ FAQ Inquiry
👤 Name: ${faqForm.name}
📱 Mobile: ${faqForm.mobile}
💬 Question: ${faqForm.question}`;

        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`);

        setFaqForm({ name: "", mobile: "", question: "" });
    };
    const isFormValid =
        form.name &&
        form.mobile &&
        form.email &&
        form.address &&
        form.city &&
        form.pincode;

    const handleOrder = async () => {
        if (!isFormValid) return;

        const msg = `🛒 Order Details
Product: MULTIVITAZ Hair Grow+
Variant: ${selectedVariant.label}

👤 Name: ${form.name}
📱 Mobile: ${form.mobile}
📧 Email: ${form.email}
🏠 Address: ${form.address}
🏙️ City: ${form.city}
📍 Pincode: ${form.pincode}

📦 Qty: ${qty}
💰 Total: ₹${total}
💳 Payment: ${payment}`;

        if (payment === "cod") {
            window.open(
                `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`
            );

            setOpen(false);
            setSuccess(true);
            return;
        }

        try {
            const res = await fetch("https://multivitaz-be.vercel.app/create-order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ amount: total }),
            });

            const order = await res.json();

            const options = {
                key: "YOUR_KEY_ID",
                amount: order.amount,
                currency: "INR",
                order_id: order.id,

                handler: async function (response: any) {
                    await fetch("https://multivitaz-be.vercel.app/verify-payment", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            ...response,
                            formData: form,
                            qty,
                            total,
                            variant: selectedVariant.label,
                        }),
                    });

                    window.open(
                        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`
                    );

                    setSuccess(true);
                },

                prefill: {
                    name: form.name,
                    email: form.email,
                    contact: form.mobile,
                },

                theme: {
                    color: "#16a34a",
                },
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();

        } catch (err) {
            console.error(err);
            alert("Payment failed");
        }

        setOpen(false);
    };

    return (
        <div className="bg-white text-black pb-24">

            {/* 🔥 NOTIFICATION */}
            {/* 🔥 UPDATED NOTIFICATION UI */}
            {notification && (
                <div className="fixed top-5 left-5 bg-black text-white px-4 py-2 rounded-full shadow-lg z-50 text-sm">
                    🛒 {notification.name} from {notification.city} just bought {notification.qty} ({notification.variant})
                </div>
            )}

            {/* HERO */}
            <div className="max-w-6xl mx-auto px-4 py-6 grid md:grid-cols-2 gap-8">

                <div>
                    <div className="bg-gray-50 rounded-2xl p-4">
                        <img src={images[current]} className="w-full h-[300px] object-contain"/>
                    </div>

                    <div className="flex gap-2 mt-3 overflow-x-auto">
                        {images.map((img, i) => (
                            <img key={i} src={img}
                                 onClick={() => setCurrent(i)}
                                 className={`w-16 h-16 rounded-lg cursor-pointer ${current === i ? "border-2 border-black" : ""}`}
                            />
                        ))}
                    </div>
                </div>

                <div>
                    <h1 className="text-3xl font-bold">MULTIVITAZ Hair Grow+</h1>

                    {/* VARIANT */}
                    <div className="flex gap-2 mt-4">
                        {Object.keys(variants).map((v) => (
                            <button
                                key={v}
                                onClick={() => setVariant(v)}
                                className={`px-4 py-2 rounded-full border ${
                                    variant === v ? "bg-black text-white" : ""
                                }`}
                            >
                                {variants[v].label}
                            </button>
                        ))}
                    </div>

                    <p className="text-green-600 font-medium mt-3">
                        Biotin Advance Formula
                    </p>

                    <p className="text-gray-600 mt-3">
                        Advanced hair growth supplement with Biotin, amino acids, vitamins & minerals.
                    </p>

                    <div className="mt-4 flex gap-3 items-center">
                        <span className="text-3xl font-bold">₹{price}</span>
                        <span className="line-through text-gray-400">₹{oldPrice}</span>
                        <span className="text-green-600">40% OFF</span>
                    </div>

                    <p className="text-red-500 mt-2">🔥 Only 5 left in stock</p>

                    <button onClick={()=>setOpen(true)}
                            className="mt-6 w-full bg-black text-white py-3 rounded-full">
                        Buy Now
                    </button>
                </div>
            </div>

            {/* WHY */}
            <div className="max-w-5xl mx-auto px-4 py-6">
                <h2 className="font-bold text-xl mb-4">Why Choose MULTIVITAZ Hair Grow+?</h2>

                {[
                    "Biotin Advance Formula",
                    "18 Essential Amino Acids",
                    "Rich Vitamins & Minerals",
                    "Supports Hair Growth",
                ].map((item, i) => (
                    <div key={i} className="bg-gray-100 p-3 mb-2 rounded">{item}</div>
                ))}
            </div>

            {/* INGREDIENTS */}
            <div className="max-w-5xl mx-auto px-4 py-6">
                <h2 className="font-bold text-xl mb-4">Power-Packed Ingredients</h2>

                <p><b>Vitamins:</b> Vitamin C, Niacinamide, Vitamin E, Calcium Pantothenate, Folic Acid, Biotin</p>
                <p><b>Minerals:</b> Calcium, Magnesium, Iron, Zinc, Manganese, Copper, Selenium</p>
                <p><b>Special:</b> 18 Essential Amino Acids, Soya Isoflavones, Grape Seed Extract</p>
            </div>

            {/* HOW TO USE */}
            <div className="max-w-5xl mx-auto px-4 py-6">
                <h2 className="font-bold text-xl mb-4">How To Use</h2>

                {[
                    "💊 1 tablet daily or as directed by Dietician",
                    "🌡 Store below 25°C in dry place",
                    "📦 Pack contains 30 tablets",
                ].map((item, i) => (
                    <div key={i} className="bg-gray-100 p-3 mb-2 rounded-[10px]">{item}</div>
                ))}
            </div>

            {/* REVIEWS */}
            <div className="max-w-5xl mx-auto px-4 py-6">
                <h2 className="font-bold text-xl mb-4">What Our Customers Say</h2>

                <div className="grid md:grid-cols-3 gap-4">
                    {[
                        { name: "Rahul Sharma", text: "Hair fall reduced in 2 weeks 🔥", time: "2 days ago" },
                        { name: "Priya Patel", text: "Amazing results 😍 Highly recommend", time: "5 days ago" },
                        { name: "Amit Verma", text: "Hair growth visible 💯", time: "1 week ago" },
                    ].map((r, i) => (
                        <div key={i} className="bg-gray-50 p-4 rounded-xl">
                            ⭐⭐⭐⭐⭐
                            <p className="text-sm mt-2">{r.text}</p>
                            <p className="text-xs text-gray-500 mt-2">{r.name} • {r.time}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* STICKY */}
            <div className="fixed bottom-0 w-full bg-white border-t p-3 flex justify-between">
                <p>₹{total}</p>
                <button onClick={()=>setOpen(true)}
                        className="bg-yellow-400 px-6 py-2 rounded-full">
                    Buy Now
                </button>
            </div>
            {/* ✅ FAQ SECTION (ADDED HERE) */}
            <div className="max-w-5xl mx-auto px-4 py-12">

                <div className="bg-gradient-to-br from-green-50 via-white to-green-100 p-8 rounded-3xl shadow-xl border">

                    {/* HEADER */}
                    <div className="text-center mb-6">
                        <h2 className="text-2xl md:text-3xl font-bold">
                            ❓ Still Have Questions?
                        </h2>
                        <p className="text-gray-600 mt-2">
                            Our experts are ready to help you instantly on WhatsApp
                        </p>
                    </div>

                    {/* FORM */}
                    <div className="grid md:grid-cols-3 gap-4">

                        {/* NAME */}
                        <div className="relative">
                            <span className="absolute left-3 top-3 text-gray-400">👤</span>
                            <input
                                placeholder="Enter your name"
                                value={faqForm.name}
                                onChange={(e)=>setFaqForm({...faqForm,name:e.target.value})}
                                className="w-full pl-10 p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-green-400"
                            />
                        </div>

                        {/* MOBILE */}
                        <div className="relative">
                            <span className="absolute left-3 top-3 text-gray-400">📱</span>
                            <input
                                placeholder="Enter mobile number"
                                value={faqForm.mobile}
                                onChange={(e)=>setFaqForm({...faqForm,mobile:e.target.value})}
                                className="w-full pl-10 p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-green-400"
                            />
                        </div>

                        {/* QUESTION */}
                        <div className="relative">
                            <span className="absolute left-3 top-3 text-gray-400">💬</span>
                            <input
                                placeholder="Type your question..."
                                value={faqForm.question}
                                onChange={(e)=>setFaqForm({...faqForm,question:e.target.value})}
                                className="w-full pl-10 p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-green-400"
                            />
                        </div>

                    </div>

                    {/* CTA */}
                    <button
                        onClick={handleFaqSubmit}
                        className="mt-6 w-full bg-gradient-to-r from-green-500 to-green-700 text-white py-3 rounded-xl text-lg font-semibold shadow-lg hover:scale-[1.02] transition"
                    >
                        💬 Ask on WhatsApp
                    </button>

                    {/* TRUST */}
                    <div className="flex justify-center gap-6 mt-4 text-sm text-gray-500">
                        <span>⚡ Instant Reply</span>
                        <span>🔒 100% Private</span>
                        <span>✅ Free Consultation</span>
                    </div>

                </div>

            </div>
            {/* POPUP */}
            {open && (
                <div className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50">

                    <div className="bg-white w-full md:max-w-md rounded-t-2xl md:rounded-2xl p-5 relative">

                        <button onClick={() => setOpen(false)} className="absolute right-4 top-4 text-lg">✕</button>

                        <h2 className="font-bold mb-4 text-lg">Complete Order</h2>

                        <div className="space-y-3">
                            <input placeholder="Full Name" className="w-full p-2 bg-gray-100 rounded" onChange={(e)=>setForm({...form,name:e.target.value})}/>
                            <input placeholder="Mobile" className="w-full p-2 bg-gray-100 rounded" onChange={(e)=>setForm({...form,mobile:e.target.value})}/>
                            <input placeholder="Email" className="w-full p-2 bg-gray-100 rounded" onChange={(e)=>setForm({...form,email:e.target.value})}/>
                            <textarea placeholder="Address" className="w-full p-2 bg-gray-100 rounded" onChange={(e)=>setForm({...form,address:e.target.value})}/>
                            <input placeholder="City" className="w-full p-2 bg-gray-100 rounded" onChange={(e)=>setForm({...form,city:e.target.value})}/>
                            <input placeholder="Pincode" className="w-full p-2 bg-gray-100 rounded" onChange={(e)=>setForm({...form,pincode:e.target.value})}/>
                        </div>

                        <div className="flex justify-between mt-4">
                            <span>Qty</span>
                            <div>
                                <button onClick={()=>setQty(qty>1?qty-1:1)}>-</button>
                                <span className="mx-2">{qty}</span>
                                <button onClick={()=>setQty(qty+1)}>+</button>
                            </div>
                        </div>

                        <select onChange={(e)=>setPayment(e.target.value)} className="w-full mt-3 p-2 bg-gray-100 rounded">
                            <option value="upi">UPI Payment</option>
                            <option value="cod">Cash on Delivery</option>
                        </select>

                        <p className="mt-3 font-bold text-center">Total: ₹{total}</p>

                        <button
                            disabled={!isFormValid}
                            onClick={handleOrder}
                            className={`w-full mt-4 py-3 rounded-full ${
                                isFormValid ? "bg-green-600 text-white" : "bg-gray-300 text-gray-500"
                            }`}
                        >
                            Confirm Order
                        </button>

                    </div>
                </div>
            )}

            {/* SUCCESS */}
            {success && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl text-center">
                        <h2 className="text-xl font-bold">🎉 Order Placed!</h2>
                        <p className="mt-2 text-gray-600">
                            Your order has been sent successfully.
                        </p>

                        <button
                            onClick={() => setSuccess(false)}
                            className="mt-4 bg-black text-white px-6 py-2 rounded"
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}